import os
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.contrib.auth import get_user_model

class ProgrammedExercise(models.Model):
    terrain = models.TextField()
    length = models.IntegerField()
    speed = models.IntegerField()
    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="programmedExercises"
    )

    def __str__(self):
        return self.terrain