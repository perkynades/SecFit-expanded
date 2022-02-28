from django.urls import path, include
from exerciseLoggers import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = format_suffix_patterns(
    [
        path("", views.api_root),
        path("api/exerciseLoggers/", views.ExerciseLoggerList.as_view(), name="exerciselogger-list"),
        path("api/exerciseLoggers/<int:pk>/", views.ExerciseLoggerDetail.as_view(), name="exerciselogger-detail"),
        path("", include("users.urls"))
    ]
)
