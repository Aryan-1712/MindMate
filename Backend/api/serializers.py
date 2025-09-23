from rest_framework import serializers
from .models import MoodLog, Therapist, StressAnalysis

class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = '__all__'

class TherapistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Therapist
        fields = '__all__'

class StressAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = StressAnalysis
        fields = '__all__'
