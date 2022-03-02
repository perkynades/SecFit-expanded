import re
from rest_framework import generics, mixins
from rest_framework import permissions
from rest_framework.parsers import (
    JSONParser,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.db.models import Q
from rest_framework import filters
from programmedExercises.permissions import (
    IsOwner,
    IsOwnerOfProgrammedExercise,
    IsReadOnly
)
from programmedExercises.models import ProgrammedExercise
from programmedExercises.serializers import ProgrammedExerciseSerializer
from rest_framework.response import Response

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("user-list", request=request, format=format),
            "programmed-exercises": reverse("programmedexercise-list", request=request, format=format)
        }
    )

class ProgrammedExerciseList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    serializer_class = ProgrammedExerciseSerializer
    permission_class = [
        permissions.IsAuthenticated
        & IsOwner
    ]
    parser_classes = [JSONParser]
    filter_backends = [filters.OrderingFilter]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def get_queryset(self):
        qs = ProgrammedExercise.objects.none()
        if (self.request.user):
            qs = ProgrammedExercise.objects.filter(Q(owner=self.request.user)).distinct()
        return qs

class ProgrammedExerciseDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = ProgrammedExercise.objects.all()
    serializer_class = ProgrammedExerciseSerializer
    permission_classes = [
        permissions.IsAuthenticated
        & IsOwner
    ]
    parser_classes = [JSONParser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)