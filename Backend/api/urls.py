from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MoodLogViewSet, TherapistViewSet, StressAnalysisViewSet

router = DefaultRouter()
router.register(r'mood', MoodLogViewSet)
router.register(r'therapists', TherapistViewSet)
router.register(r'stress', StressAnalysisViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
