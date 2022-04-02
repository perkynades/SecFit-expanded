# pylint: disable=locally-disabled, line-too-long
"""Contains views for the workouts application. These are mostly class-based views.
"""
import base64
import pickle
from collections import namedtuple
from rest_framework import generics, mixins
from rest_framework import permissions
from rest_framework.parsers import (
    JSONParser,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import filters
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.core.exceptions import PermissionDenied
from django.core.signing import Signer
from workouts.parsers import MultipartJsonParser
from workouts.permissions import (
    IsOwner,
    IsCoachAndVisibleToCoach,
    IsOwnerOfWorkout,
    IsCoachOfWorkoutAndVisibleToCoach,
    IsReadOnly,
    IsPublic,
    IsWorkoutPublic,
)
from workouts.mixins import CreateListModelMixin
from workouts.models import Workout, Exercise, ExerciseInstance, WorkoutFile
from workouts.serializers import WorkoutSerializer, ExerciseSerializer
from workouts.serializers import RememberMeSerializer
from workouts.serializers import ExerciseInstanceSerializer, WorkoutFileSerializer


@api_view(["GET"])
def api_root(request):
    """
    Handler for workouts get requests
    """
    return Response(
        {
            "users": reverse("user-list", request=request, format=format),
            "workouts": reverse("workout-list", request=request, format=format),
            "exercises": reverse("exercise-list", request=request, format=format),
            "exercise-instances": reverse(
                "exercise-instance-list", request=request, format=format
            ),
            "workout-files": reverse(
                "workout-file-list", request=request, format=format
            ),
            "comments": reverse("comment-list", request=request, format=format),
            "likes": reverse("like-list", request=request, format=format),
        }
    )


# Allow users to save a persistent session in their browser
class RememberMe(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    """
    Class for handling and creating session cookies
    """
    serializer_class = RememberMeSerializer

    def get(self, request):
        """
        Returns a session cookie
        """
        if not request.user.is_authenticated:
            raise PermissionDenied
        return Response({"remember_me": self.rememberme()})

    def post(self, request):
        """
        Creates a new session cookie and returns it
        """
        cookie_object = namedtuple("Cookies", request.COOKIES.keys())(
            *request.COOKIES.values()
        )
        user = self.get_user(cookie_object)
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        )

    def get_user(self, cookie_object):
        """
        Returns the user that is connected to a session cookie
        """
        decode = base64.b64decode(cookie_object.remember_me)
        user, sign = pickle.loads(decode)

        # Validate signature
        if sign == self.sign_user(user):
            return user

    def rememberme(self):
        """
        Encodes a session cookie for enabling holding a user session
        """
        creds = [self.request.user, self.sign_user(str(self.request.user))]
        return base64.b64encode(pickle.dumps(creds))

    def sign_user(self, username):
        """
        Assigns a user to a session cookie
        """
        signer = Signer()
        signed_user = signer.sign(username)
        return signed_user


class WorkoutList(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """Class defining the web response for the creation of a Workout, or displaying a list
    of Workouts

    HTTP methods: GET, POST
    """

    serializer_class = WorkoutSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]  # User must be authenticated to create/view workouts
    parser_classes = [
        MultipartJsonParser,
        JSONParser,
    ]  # For parsing JSON and Multi-part requests
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["name", "date", "owner__username"]

    def get(self, request, *args, **kwargs):
        """
        Returns a list of workouts
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Stores a list of workouts in the database
        """
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        query_set = Workout.objects.none()
        if self.request.user:
            # A workout should be visible to the requesting user if any of the following hold:
            # - The workout has public visibility
            # - The owner of the workout is the requesting user
            # - The workout has coach visibility and the requesting user is the owner's coach
            query_set = Workout.objects.filter(
                Q(visibility="PU")
                | (Q(visibility="CO") & Q(owner__coach=self.request.user))
            ).distinct()

        return query_set


class WorkoutDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """Class defining the web response for the details of an individual Workout.

    HTTP methods: GET, PUT, DELETE
    """

    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [
        permissions.IsAuthenticated
        & (IsOwner | (IsReadOnly & (IsCoachAndVisibleToCoach | IsPublic)))
    ]
    parser_classes = [MultipartJsonParser, JSONParser]

    def get(self, request, *args, **kwargs):
        """
        Returns a specific workout
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates a specific workout
        """
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete a specific workout
        """
        return self.destroy(request, *args, **kwargs)


class ExerciseList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """Class defining the web response for the creation of an Exercise, or
    a list of Exercises.

    HTTP methods: GET, POST
    """

    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Returns a list of exercises
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a list of exercises to the database
        """
        return self.create(request, *args, **kwargs)


class ExerciseDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """Class defining the web response for the details of an individual Exercise.

    HTTP methods: GET, PUT, PATCH, DELETE
    """

    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Returns a specific exercise
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates a specific exercise
        """
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Updates parts of a specific exercise
        """
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a specific exercise
        """
        return self.destroy(request, *args, **kwargs)


class ExerciseInstanceList(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    CreateListModelMixin,
    generics.GenericAPIView,
):
    """Class defining the web response for the creation"""

    serializer_class = ExerciseInstanceSerializer
    permission_classes = [permissions.IsAuthenticated & IsOwnerOfWorkout]

    def get(self, request, *args, **kwargs):
        """
        Returns a specific list of exercise instances
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a specific list of exercise instances to the database
        """
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        query_set = ExerciseInstance.objects.none()
        if self.request.user:
            query_set = ExerciseInstance.objects.filter(
                Q(workout__owner=self.request.user)
                | (
                    (Q(workout__visibility="CO") | Q(workout__visibility="PU"))
                    & Q(workout__owner__coach=self.request.user)
                )
            ).distinct()

        return query_set


class ExerciseInstanceDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling web results on exercise instance details
    """
    serializer_class = ExerciseInstanceSerializer
    permission_classes = [
        permissions.IsAuthenticated
        & (
            IsOwnerOfWorkout
            | (IsReadOnly & (IsCoachOfWorkoutAndVisibleToCoach | IsWorkoutPublic))
        )
    ]

    def get(self, request, *args, **kwargs):
        """
        Returns specific exercise instance details
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates all details of a specific exercise instance
        """
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Updates specific details of a specific exercise instance
        """
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a specific exercise instance
        """
        return self.destroy(request, *args, **kwargs)


class WorkoutFileList(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    CreateListModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling web results on workout file lists
    """
    queryset = WorkoutFile.objects.all()
    serializer_class = WorkoutFileSerializer
    permission_classes = [permissions.IsAuthenticated & IsOwnerOfWorkout]
    parser_classes = [MultipartJsonParser, JSONParser]

    def get(self, request, *args, **kwargs):
        """
        Gets a specific list of workout files
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a specific list of workout files to the database
        """
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        query_set = WorkoutFile.objects.none()
        if self.request.user:
            query_set = WorkoutFile.objects.filter(
                Q(owner=self.request.user)
                | Q(workout__owner=self.request.user)
                | (
                    Q(workout__visibility="CO")
                    & Q(workout__owner__coach=self.request.user)
                )
            ).distinct()

        return query_set


class WorkoutFileDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling web results on specific workout file
    """
    queryset = WorkoutFile.objects.all()
    serializer_class = WorkoutFileSerializer
    permission_classes = [
        permissions.IsAuthenticated
        & (
            IsOwner
            | IsOwnerOfWorkout
            | (IsReadOnly & (IsCoachOfWorkoutAndVisibleToCoach | IsWorkoutPublic))
        )
    ]

    def get(self, request, *args, **kwargs):
        """
        Gets a specific workout file
        """
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a specific workouts file
        """
        return self.destroy(request, *args, **kwargs)
