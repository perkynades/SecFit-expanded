import os
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.contrib.auth import get_user_model

from secfit.meals.models import meal_directory_path

class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=none):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))

class ExerciseLogger(models.Model):
    fitnessCenter = models.TextField()
    loggedExercise = models.TextField()

    def __str__(self):
        return self.fitnessCenter

def exercise_logger_directory_path(instance, filename):
    return f"loggers/{instance.logger.id}/{filename}"

class LoggerFile(models.Model):
    meal = models.ForeignKey(ExerciseLogger, on_delete=models.CASCADE, related_name="files")
    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="logger_files"
    )
    file = models.FileField(upload_to=meal_directory_path)
