from rest_framework import generics, mixins
from rest_framework import permissions
from rest_framework.filters import OrderingFilter
from comments.models import Comment, Like
from comments.permissions import IsCommentVisibleToUser
from comments.serializers import CommentSerializer, LikeSerializer
from workouts.permissions import IsOwner, IsReadOnly
from django.db.models import Q

# Create your views here.
class CommentList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Class for handling web requests for lists of comments
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ["timestamp"]

    def get(self, request, *args, **kwargs):
        """
        Returns a list of comments
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a list of comments to the database
        """
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        workout_pk = self.kwargs.get("pk")
        qs = Comment.objects.none()

        if workout_pk:
            qs = Comment.objects.filter(workout=workout_pk)
        elif self.request.user:
            # A comment should be visible to the requesting user if any of the following hold:
            # - The comment is on a public visibility workout
            # - The comment was written by the user
            # - The comment is on a coach visibility workout and the user is
            #   the workout owner's coach
            # - The comment is on a workout owned by the user
            # The code below is kind of duplicate of the one in ./permissions.py
            # We should replace it with a better solution.
            # Or maybe not.
           
            qs = Comment.objects.filter(
                Q(workout__visibility="PU")
                | Q(owner=self.request.user)
                | (
                    Q(workout__visibility="CO")
                    & Q(workout__owner__coach=self.request.user)
                )
                | Q(workout__owner=self.request.user)
            ).distinct()

        return qs

# Details of comment
class CommentDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling web requests for a comment
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [
        permissions.IsAuthenticated & IsCommentVisibleToUser & (IsOwner | IsReadOnly)
    ]

    def get(self, request, *args, **kwargs):
        """
        Returns a specific comment
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates a comment
        """
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a comment
        """
        return self.destroy(request, *args, **kwargs)


# List of likes
class LikeList(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Class for handling web requests for a list of likes
    """
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Returns a list of likes
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Adds a list of likes to the database
        """
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Like.objects.filter(owner=self.request.user)


# Details of like
class LikeDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """
    Class for handling web requests for a like
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]
    _Detail = []

    def get(self, request, *args, **kwargs):
        """
        Returns a like
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates a like
        """
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a like
        """
        return self.destroy(request, *args, **kwargs)
