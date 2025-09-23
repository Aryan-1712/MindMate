from django.contrib.auth.models import User
from django.db import models

class MoodLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # optional now
    mood = models.CharField(max_length=50)  # e.g., Happy, Anxious
    notes = models.TextField(blank=True, null=True)  # optional notes
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.mood} on {self.date}"

# Therapist info
class Therapist(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    contact = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.specialization}"

# Optional: Stress/Anxiety analysis
class StressAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    text_input = models.TextField()
    stress_level = models.FloatField(null=True, blank=True)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.stress_level} on {self.date}"


