from django.urls import path, include
from logging import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = format_suffix_patterns(
    [
        path("", views.api_root),
        path("api/loggers/", views.ExerciseLoggerList.as_view(), name="exercise-logger-list"),
        path("api/loggers/<int:pk>/", views.ExerciseLoggerDetail.as_view(), name="exercise-logger-detail"),
        path("", include("users.urls"))
    ]
)
