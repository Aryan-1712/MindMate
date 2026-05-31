from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import MoodLog, Therapist, StressAnalysis
from .serializers import MoodLogSerializer, TherapistSerializer, StressAnalysisSerializer
import random
from django.conf import settings
import google.generativeai as genai

genai.configure(api_key = settings.GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

# ── Auth Views ──────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        email    = request.data.get("email", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken."}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        tokens = RefreshToken.for_user(user)
        return Response({
            "message": "Account created successfully.",
            "access":  str(tokens.access_token),
            "refresh": str(tokens),
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }, status=201)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid username or password."}, status=401)

        tokens = RefreshToken.for_user(user)
        return Response({
            "access":  str(tokens.access_token),
            "refresh": str(tokens),
            "user": {"id": user.id, "username": user.username, "email": user.email},
        })


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"id": user.id, "username": user.username, "email": user.email})


# ── Data Views (protected) ───────────────────────────────

class MoodLogViewSet(viewsets.ModelViewSet):
    serializer_class = MoodLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MoodLog.objects.filter(user=self.request.user).order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TherapistViewSet(viewsets.ModelViewSet):
    serializer_class = TherapistSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Therapist.objects.all()


class StressAnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = StressAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StressAnalysis.objects.filter(user=self.request.user).order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ── AI Advice ────────────────────────────────────────────


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def ai_advice(request):
    mood   = request.data.get("mood", "")
    stress = request.data.get("stress", "")
    prompt = f"""
    You are a supportive mental wellness assistant.

    User Mood: {mood}
    User Stress Description: {stress}

    Provide:
    1. A short empathetic response.
    2. Practical advice.
    3. One actionable step the user can take today.

    Keep the response under 150 words.
    """

    try:
        response = model.generate_content(prompt)

        return Response({
            "advice": response.text
        })

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)