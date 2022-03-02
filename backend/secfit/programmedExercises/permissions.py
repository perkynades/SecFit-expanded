from rest_framework import permissions
from programmedExercises.models import ProgrammedExercise

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsOwnerOfProgrammedExercise(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            if request.data.get("programmedExercise"):
                programmed_exercise_id = request.data["programmedExercise"].split("/")[-2]
                programmed_exercise = ProgrammedExercise.objects.get(pk=programmed_exercise_id)
                if programmed_exercise:
                    return programmed_exercise.owner == request.user
            return False
    
    def has_object_permission(self, request, view, obj):
        return obj.programmed_exercise.owner == request.user

class IsReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS