from django.urls import path, include
from programmedExercises import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = format_suffix_patterns(
    [
        path("", views.api_root),
        path("api/programmedExercises/", views.ProgrammedExerciseList.as_view(), name="programmedexercise-list"),
        path("api/programmedExercises/<int:pk>/", views.ProgrammedExerciseDetail.as_view(), name="programmedexercise-detail"),
        path("", include("users.urls"))
    ]
)