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

RESPONSES = {
    "anxious": [
        "It's completely okay to feel anxious — your feelings are valid. Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. This activates your parasympathetic nervous system and can bring calm within minutes.",
        "Anxiety often comes from focusing on things outside our control. Try writing down exactly what's worrying you, then separate the list into 'things I can control' and 'things I can't'. Focus your energy only on the first list.",
        "When anxiety spikes, grounding yourself in the present helps. Look around and name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This 5-4-3-2-1 technique can interrupt the anxiety loop.",
    ],
    "stressed": [
        "Stress is a signal that something needs your attention — not a sign that you're failing. Try breaking your biggest stressor into the smallest possible next action. Just one small step forward can shift your mental state significantly.",
        "When stress feels overwhelming, a short walk — even just 10 minutes — can reduce cortisol levels meaningfully. You don't need to solve everything today. Be kind to yourself and take it one hour at a time.",
        "Chronic stress often comes from overcommitment. It's okay to say no to things that drain you. Protecting your energy isn't selfish — it's necessary. What's one thing you could let go of today?",
    ],
    "sad": [
        "Sadness is a natural and important emotion — it means you care deeply about something. Allow yourself to feel it without judgment. Sometimes the kindest thing you can do is simply acknowledge: 'I'm having a hard time right now, and that's okay.'",
        "When you're feeling low, small acts of self-care can make a big difference. A warm shower, a nourishing meal, or a short call with someone you trust can gently lift your mood.",
        "It can help to write down three things — no matter how small — that went okay today. Not to dismiss your sadness, but to remind your mind that both hardship and goodness can coexist.",
    ],
    "overwhelmed": [
        "When everything feels like too much, the best thing to do is stop trying to hold it all at once. Write down every single thing on your mind — a full brain dump. Then pick just ONE thing to focus on. Everything else can wait.",
        "Overwhelm often comes from trying to see the whole mountain at once. You only need to see the next step. What is the single most important thing you need to do in the next hour? Just that one thing.",
        "It's okay to pause. Give yourself permission to take 15 minutes away from everything. Make a tea, sit quietly, breathe. You'll return with more clarity than if you push through exhausted.",
    ],
    "tired": [
        "Fatigue — especially emotional fatigue — is your body asking for rest. If you can, prioritise sleep above almost everything tonight. Even 20 minutes of lying down without your phone can restore more than you'd expect.",
        "Low energy often signals that you've been giving a lot without refilling. Think about what genuinely recharges you and schedule even a small amount of that today.",
        "Sometimes tiredness is physical, and sometimes it's the weight of unprocessed feelings. Journaling for 5 minutes about what's been on your mind lately can help release some of that mental load.",
    ],
    "sleep": [
        "Poor sleep and mental health are deeply connected. Try keeping a consistent bedtime, avoiding screens 30 minutes before bed, and writing a short 'worry list' to get anxious thoughts out of your head before you lie down.",
        "Racing thoughts at night are very common. Try the cognitive shuffle technique: imagine a random word, then picture unrelated objects one by one starting with each letter. This interrupts your brain's problem-solving mode.",
        "Your bedroom environment matters. Keep it cool, dark, and only for sleep. If you've been lying awake for 20+ minutes, get up and do something calm in dim light until you feel sleepy — don't fight it in bed.",
    ],
    "motivation": [
        "Motivation rarely comes before action — it usually follows it. Try the '2-minute rule': commit to doing just 2 minutes of the task. Starting is the hardest part, and momentum builds from there.",
        "Low motivation can sometimes signal that what you're working toward no longer aligns with your values. Take a moment to ask: is this goal still mine? Reconnecting with your 'why' can reignite energy.",
        "Be careful not to confuse low motivation with burnout. If you've been pushing hard for a long time, your mind may genuinely need rest before it can engage again. Rest is productive.",
    ],
    "happy": [
        "It's wonderful that you're feeling happy! Savour this feeling intentionally — research shows that consciously appreciating positive emotions helps them last longer and builds emotional resilience over time.",
        "Good energy is worth sharing! Is there someone in your life who could use a kind word today? Spreading positivity tends to amplify it.",
        "On good days, it's a great time to reflect on what's working well in your life. Noticing the conditions that support your wellbeing helps you recreate them when things feel harder.",
    ],
    "calm": [
        "A calm state of mind is genuinely valuable — it's a foundation for clear thinking and good decisions. Enjoy this and try to notice what's contributed to it today.",
        "When you're feeling calm, it's a good time to do the things that require patience and focus. Use this energy wisely.",
        "Calmness is a skill that can be practised. Whatever brought you here today is worth noting and returning to.",
    ],
    "relationship": [
        "Relationship stress can be some of the most draining kind. Try to separate the person from the problem — ask yourself what outcome you actually want, then think about what you'd need to say to move toward it.",
        "When conflict arises, timing matters. If emotions are running high, it's okay to say 'I need a little time to think before we talk about this' — that's not avoidance, it's maturity.",
        "Sometimes relationship tension is really about unmet needs that haven't been clearly communicated. Try expressing how you feel using 'I' statements rather than 'you' statements.",
    ],
    "work": [
        "Work pressure is real. One effective approach is 'time boxing' — assigning fixed time slots to tasks instead of working until they're done. It creates boundaries and reduces the feeling that work is endless.",
        "If deadlines are piling up, list your tasks and rate each one: urgent + important, important but not urgent, urgent but not important, and neither. Focus your energy on the first category.",
        "Burnout often creeps in slowly. Check in with yourself: are you taking actual breaks? Eating properly? Logging off at a reasonable time? Sustainable output requires sustainable habits.",
    ],
    "default": [
        "Thank you for sharing how you're feeling. Whatever you're going through, know that reaching out and checking in with yourself is a meaningful act of self-care. You're not alone.",
        "Your mental health matters deeply. Even on the hardest days, small steps — a glass of water, a short walk, a moment of stillness — can gently shift your state.",
        "It takes courage to acknowledge how we're really feeling. You're doing something important by paying attention to your inner world. Whatever is weighing on you, try to take it one moment at a time.",
        "Sometimes we don't need solutions — we just need to feel heard. I hear you. What you're experiencing is real, and it's okay to not be okay sometimes.",
    ],
}

def get_smart_response(mood, stress):
    combined = f"{mood} {stress}".lower()
    if any(w in combined for w in ["anxi", "panic", "worry", "worried", "nervous"]):
        return random.choice(RESPONSES["anxious"])
    elif any(w in combined for w in ["stress", "pressure", "deadline"]):
        return random.choice(RESPONSES["stressed"] + RESPONSES["work"])
    elif any(w in combined for w in ["sad", "depress", "down", "low", "cry"]):
        return random.choice(RESPONSES["sad"])
    elif any(w in combined for w in ["overwhelm"]):
        return random.choice(RESPONSES["overwhelmed"])
    elif any(w in combined for w in ["tired", "exhaust", "fatigue", "drained"]):
        return random.choice(RESPONSES["tired"])
    elif any(w in combined for w in ["sleep", "insomnia", "awake"]):
        return random.choice(RESPONSES["sleep"])
    elif any(w in combined for w in ["motivat", "lazy", "procrastinat", "stuck"]):
        return random.choice(RESPONSES["motivation"])
    elif any(w in combined for w in ["happy", "great", "good", "joy", "excited"]):
        return random.choice(RESPONSES["happy"])
    elif any(w in combined for w in ["calm", "peaceful", "relax", "fine"]):
        return random.choice(RESPONSES["calm"])
    elif any(w in combined for w in ["relationship", "partner", "friend", "family", "conflict"]):
        return random.choice(RESPONSES["relationship"])
    elif any(w in combined for w in ["work", "job", "boss", "career", "office"]):
        return random.choice(RESPONSES["work"])
    else:
        return random.choice(RESPONSES["default"])


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def ai_advice(request):
    mood   = request.data.get("mood", "")
    stress = request.data.get("stress", "")
    advice = get_smart_response(mood, stress)
    return Response({"advice": advice})