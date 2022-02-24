import os
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.contrib.auth import get_user_model


class ExerciseLogger(models.Model):
    fitnessCenter = models.TextField()
    loggedExercise = models.TextField()

    def __str__(self):
        return self.fitnessCenter