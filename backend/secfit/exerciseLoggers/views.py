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
from exerciseLoggers.parsers import MutlipartJsonparse
from exerciseLoggers.permissions import (
    Isowner,
    IsOwnerOfExerciseLogger,
    IsReadOnly
)
from exerciseLoggers.mixins import CreateListModelMixin
from exerciseLoggers.models import ExerciseLogger
from exerciseLoggers.serializers import ExerciseLoggerSerializer
from django.core.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
import json
from collections import namedtuple
import base64, pickle
from django.core.signing import Signer

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("user-list", request=request, format=format),
            "exercise-loggers": reverse("exerciselogger-list", request=request, format=format)
        }
    )

class ExerciseLoggerList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    serializer_class = ExerciseLoggerSerializer
    permission_class = [
        permissions.IsAuthenticated
        & Isowner
    ]
    parser_classes = [
        MutlipartJsonparse,
        JSONParser
    ]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = []

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        qs = ExerciseLogger.objects.none()
        if (self.request.user):
            qs = ExerciseLogger.objects.filter(Q(owner=self.request.user)).distinct()
        return qs

class ExerciseLoggerDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = ExerciseLogger.objects.all()
    serializer_class = ExerciseLoggerSerializer
    permission_classes = [
        permissions.IsAuthenticated
        & Isowner
    ]
    parser_classes = [MutlipartJsonparse, JSONParser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)