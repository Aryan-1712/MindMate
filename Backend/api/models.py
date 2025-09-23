from django.db import models
from django.contrib.auth.models import User

# Mood tracker for daily logs
class MoodLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.CharField(max_length=50)  # e.g., Happy, Anxious
    notes = models.TextField(blank=True, null=True)  # optional notes
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} on {self.date}"

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text_input = models.TextField()
    stress_level = models.CharField(max_length=50)  # e.g., Low, Medium, High
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.stress_level} on {self.date}"
