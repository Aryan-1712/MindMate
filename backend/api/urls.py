from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    MoodLogViewSet, TherapistViewSet, StressAnalysisViewSet,
    ai_advice, RegisterView, LoginView, MeView
)

router = DefaultRouter()
router.register(r"mood", MoodLogViewSet, basename="mood")
router.register(r"therapists", TherapistViewSet, basename="therapists")
router.register(r"stress", StressAnalysisViewSet, basename="stress")

urlpatterns = [
    path("", include(router.urls)),
    path("ai-advice/", ai_advice),
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/",    LoginView.as_view()),
    path("auth/refresh/",  TokenRefreshView.as_view()),
    path("auth/me/",       MeView.as_view()),
]