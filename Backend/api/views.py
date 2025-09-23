from rest_framework import viewsets
from .models import MoodLog, Therapist, StressAnalysis
from .serializers import MoodLogSerializer, TherapistSerializer, StressAnalysisSerializer

# Mood Logs API
class MoodLogViewSet(viewsets.ModelViewSet):
    queryset = MoodLog.objects.all()
    serializer_class = MoodLogSerializer

# Therapists API
class TherapistViewSet(viewsets.ModelViewSet):
    queryset = Therapist.objects.all()
    serializer_class = TherapistSerializer

# Stress/Anxiety Analysis API
class StressAnalysisViewSet(viewsets.ModelViewSet):
    queryset = StressAnalysis.objects.all()
    serializer_class = StressAnalysisSerializer
