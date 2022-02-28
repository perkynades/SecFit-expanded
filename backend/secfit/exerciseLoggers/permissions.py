from rest_framework import permissions
from exerciseLoggers.models import ExerciseLogger

class Isowner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsOwnerOfExerciseLogger(permissions.BasePermission):
    def has_persmissions(self, request, view):
        if request.method == "POST":
            if request.data.get("exerciseLogger"):
                logger_id = request.data["exerciseLogger"].split("/")[-2]
                logger = ExerciseLogger.objects.get(pk=logger_id)
                if logger:
                    return logger.owner == request.user
            return False

        return True

    def has_object_permission(self, request, view, obj):
        return obj.logger.owner == request.user

class IsReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS