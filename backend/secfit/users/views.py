from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import mixins, generics
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from workouts.mixins import CreateListModelMixin
from workouts.permissions import IsOwner, IsReadOnly
from users.permissions import IsCurrentUser, IsAthlete, IsCoach
from users.serializers import (
    UserSerializer,
    OfferSerializer,
    AthleteFileSerializer,
    UserPutSerializer,
    UserGetSerializer
)
from users.models import Offer, AthleteFile

# Create your views here.
class UserList(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Class for handling requests for a list of users
    """
    serializer_class = UserSerializer
    users = []
    admins = []

    def get(self, request, *args, **kwargs):
        """
        Returns a list of users
        """
        self.serializer_class = UserGetSerializer
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a list of users to the database
        """
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        query_set = get_user_model().objects.all()

        if self.request.user:
            # Return the currently logged in user
            status = self.request.query_params.get("user", None)
            if status and status == "current":
                query_set = get_user_model().objects.filter(pk=self.request.user.pk)

        return query_set


class UserDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling requests for a specific user
    """
    lookup_field_options = ["pk", "username"]
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()
    permission_classes = [permissions.IsAuthenticated & (IsCurrentUser | IsReadOnly)]

    def get_object(self):
        for field in self.lookup_field_options:
            if field in self.kwargs:
                self.lookup_field = field
                break

        return super().get_object()

    def get(self, request, *args, **kwargs):
        """
        Returns a specific user
        """
        self.serializer_class = UserGetSerializer
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a specific user
        """
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates a user
        """
        self.serializer_class = UserPutSerializer
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Updates specific parts of a user
        """
        return self.partial_update(request, *args, **kwargs)


class OfferList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Class for handling requests for offer lists
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = OfferSerializer

    def get(self, request, *args, **kwargs):
        """
        Returns a list of offers
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a list of offers to the database
        """
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        query_set = Offer.objects.none()
        result = Offer.objects.none()

        if self.request.user:
            query_set = Offer.objects.filter(
                Q(owner=self.request.user) | Q(recipient=self.request.user)
            ).distinct()
            query_params = self.request.query_params
            user = self.request.user

            # filtering by status (if provided)
            status = query_params.get("status", None)
            if status is not None and self.request is not None:
                query_set = query_set.filter(status=status)
                if query_params.get("status", None) is None:
                    query_set = Offer.objects.filter(Q(owner=user)).distinct()

            # filtering by category (sent or received)
            category = query_params.get("category", None)
            if category is not None and query_params is not None:
                if category == "sent":
                    query_set = query_set.filter(owner=user)
                elif category == "received":
                    query_set = query_set.filter(recipient=user)
            return query_set
        else:
            return result


class OfferDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling requests for a specific offer
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def get(self, request, *args, **kwargs):
        """
        Returns a specific offer
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates a specific offer
        """
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Updates sepcific parts of a specific offer
        """
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a specific offer
        """
        return self.destroy(request, *args, **kwargs)


class AthleteFileList(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    CreateListModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling requests for lists of athlete files
    """
    queryset = AthleteFile.objects.all()
    serializer_class = AthleteFileSerializer
    permission_classes = [permissions.IsAuthenticated & (IsAthlete | IsCoach)]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        """
        Returns a list of athlethe files
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a list of athlete files to the database
        """
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        query_set = AthleteFile.objects.none()

        if self.request.user:
            query_set = AthleteFile.objects.filter(
                Q(athlete=self.request.user) | Q(owner=self.request.user)
            ).distinct()

        return query_set


class AthleteFileDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling requests for a specific athelte file
    """
    queryset = AthleteFile.objects.all()
    serializer_class = AthleteFileSerializer
    permission_classes = [permissions.IsAuthenticated & (IsAthlete | IsOwner)]

    def get(self, request, *args, **kwargs):
        """
        Returns a specific athletes file
        """
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a specific athlete file
        """
        return self.destroy(request, *args, **kwargs)
