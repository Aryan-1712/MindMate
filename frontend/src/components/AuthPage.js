import React, { useState } from "react";
import API from "../api";

const FEATURES = [
    { icon: "🌿", title: "Mood Journal",    desc: "Track your daily emotions with beautiful insights" },
    { icon: "🧘", title: "Stress Check",    desc: "Analyse your stress and get personalised tips" },
    { icon: "✦",  title: "AI Companion",   desc: "Talk through anything with your wellness companion" },
    { icon: "🤝", title: "Find Therapists", desc: "Connect with mental health professionals near you" },
];

export default function AuthPage({ onLogin }) {
    const [view, setView]         = useState("landing"); // landing | login | register
    const [form, setForm]         = useState({ username: "", email: "", password: "", confirm: "" });
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);
    const [success, setSuccess]   = useState(null);

    function updateForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!form.username || !form.password) return setError("Please fill in all fields.");
        setLoading(true);
        try {
            const { data } = await API.post("auth/login/", {
                username: form.username,
                password: form.password,
            });
            localStorage.setItem("access_token",  data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("user", JSON.stringify(data.user));
            onLogin(data.user);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (!form.username || !form.password) return setError("Username and password are required.");
        if (form.password !== form.confirm)   return setError("Passwords do not match.");
        if (form.password.length < 8)         return setError("Password must be at least 8 characters.");
        setLoading(true);
        try {
            const { data } = await API.post("auth/register/", {
                username: form.username,
                email:    form.email,
                password: form.password,
            });
            localStorage.setItem("access_token",  data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("user", JSON.stringify(data.user));
            setSuccess("Account created! Welcome to MindMate 🌿");
            setTimeout(() => onLogin(data.user), 1000);
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    /* ── Landing Page ── */
    if (view === "landing") return (
        <div style={s.page}>
            <div style={s.landing}>
                {/* Hero */}
                <div style={s.hero}>
                    <div style={s.heroInner}>
                        <div style={s.logoMark}>✦</div>
                        <h1 style={s.heroTitle}>Your mind deserves<br /><em style={s.heroEm}>care and attention.</em></h1>
                        <p style={s.heroSub}>
                            MindMate is your personal mental wellness companion — track moods, manage stress, and get thoughtful support every day.
                        </p>
                        <div style={s.heroBtns}>
                            <button style={s.btnPrimary} onClick={() => setView("register")}>
                                Get started — it's free
                            </button>
                            <button style={s.btnGhost} onClick={() => setView("login")}>
                                Sign in
                            </button>
                        </div>
                    </div>

                    {/* Floating cards decoration */}
                    <div style={s.heroCards}>
                        <div style={{ ...s.floatCard, top: 0, right: 0 }}>
                            <span style={{ fontSize: 20 }}>😊</span>
                            <div>
                                <div style={s.floatCardTitle}>Feeling Happy</div>
                                <div style={s.floatCardSub}>Today · Just now</div>
                            </div>
                        </div>
                        <div style={{ ...s.floatCard, top: 90, right: 40, background: "#EDE8F7", borderColor: "#C8BEE8" }}>
                            <span style={{ fontSize: 20 }}>🧘</span>
                            <div>
                                <div style={s.floatCardTitle}>Stress: Low</div>
                                <div style={s.floatCardSub}>Breathing exercise done</div>
                            </div>
                        </div>
                        <div style={{ ...s.floatCard, top: 180, right: 10, background: "#FBF3E2", borderColor: "#E8D4A0" }}>
                            <span style={{ fontSize: 14 }}>✦</span>
                            <div>
                                <div style={s.floatCardTitle}>AI Companion</div>
                                <div style={s.floatCardSub}>Always here for you</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div style={s.features}>
                    <div style={s.featuresLabel}>Everything you need</div>
                    <div style={s.featuresGrid}>
                        {FEATURES.map(f => (
                            <div key={f.title} style={s.featureCard}>
                                <div style={s.featureIcon}>{f.icon}</div>
                                <div style={s.featureTitle}>{f.title}</div>
                                <div style={s.featureDesc}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={s.cta}>
                    <div style={s.ctaInner}>
                        <h2 style={s.ctaTitle}>Start your wellness journey today.</h2>
                        <p style={s.ctaSub}>Free to use. No credit card required.</p>
                        <button style={s.btnPrimary} onClick={() => setView("register")}>
                            Create your account
                        </button>
                    </div>
                </div>

                <div style={s.landingFooter}>
                    © 2026 MindMate · Built with care for your mental wellness
                </div>
            </div>
        </div>
    );

    /* ── Login / Register forms ── */
    const isLogin = view === "login";

    return (
        <div style={s.page}>
            <div style={s.formPage}>
                {/* Left panel */}
                <div style={s.formLeft}>
                    <div style={s.formLeftInner}>
                        <div style={s.formLogoMark}>✦</div>
                        <h2 style={s.formLeftTitle}>MindMate</h2>
                        <p style={s.formLeftSub}>
                            {isLogin
                                ? "Welcome back. Your wellness journey continues."
                                : "Join thousands taking care of their mental health daily."}
                        </p>
                        <div style={s.formQuotes}>
                            {["Your feelings are valid.", "Small steps matter.", "You are not alone."].map(q => (
                                <div key={q} style={s.formQuote}>✦ {q}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel — form */}
                <div style={s.formRight}>
                    <div style={s.formCard}>
                        <button style={s.backBtn} onClick={() => { setView("landing"); setError(null); }}>
                            ← Back
                        </button>

                        <h2 style={s.formTitle}>{isLogin ? "Welcome back" : "Create account"}</h2>
                        <p style={s.formSubtitle}>
                            {isLogin ? "Sign in to your MindMate account" : "Start your wellness journey today"}
                        </p>

                        {error   && <div style={s.errorBox}>{error}</div>}
                        {success && <div style={s.successBox}>{success}</div>}

                        <form onSubmit={isLogin ? handleLogin : handleRegister}>
                            <div style={s.formGroup}>
                                <label style={s.label}>Username</label>
                                <input
                                    style={s.input}
                                    name="username"
                                    placeholder="yourname"
                                    value={form.username}
                                    onChange={updateForm}
                                    onFocus={e => e.target.style.borderColor = "#7A9E7E"}
                                    onBlur={e => e.target.style.borderColor = "rgba(42,42,38,0.14)"}
                                    autoComplete="username"
                                />
                            </div>

                            {!isLogin && (
                                <div style={s.formGroup}>
                                    <label style={s.label}>Email <span style={s.optional}>— optional</span></label>
                                    <input
                                        style={s.input}
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={updateForm}
                                        onFocus={e => e.target.style.borderColor = "#7A9E7E"}
                                        onBlur={e => e.target.style.borderColor = "rgba(42,42,38,0.14)"}
                                    />
                                </div>
                            )}

                            <div style={s.formGroup}>
                                <label style={s.label}>Password</label>
                                <input
                                    style={s.input}
                                    name="password"
                                    type="password"
                                    placeholder={isLogin ? "Your password" : "Min. 8 characters"}
                                    value={form.password}
                                    onChange={updateForm}
                                    onFocus={e => e.target.style.borderColor = "#7A9E7E"}
                                    onBlur={e => e.target.style.borderColor = "rgba(42,42,38,0.14)"}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                />
                            </div>

                            {!isLogin && (
                                <div style={s.formGroup}>
                                    <label style={s.label}>Confirm password</label>
                                    <input
                                        style={s.input}
                                        name="confirm"
                                        type="password"
                                        placeholder="Repeat your password"
                                        value={form.confirm}
                                        onChange={updateForm}
                                        onFocus={e => e.target.style.borderColor = "#7A9E7E"}
                                        onBlur={e => e.target.style.borderColor = "rgba(42,42,38,0.14)"}
                                        autoComplete="new-password"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{ ...s.submitBtn, opacity: loading ? 0.6 : 1 }}
                                disabled={loading}
                            >
                                {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
                            </button>
                        </form>

                        <div style={s.switchRow}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                style={s.switchBtn}
                                onClick={() => { setView(isLogin ? "register" : "login"); setError(null); setForm({ username: "", email: "", password: "", confirm: "" }); }}
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: "100vh",
        background: "#FAF8F3",
        fontFamily: "'DM Sans', sans-serif",
    },

    /* ── Landing ── */
    landing: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 32px",
    },
    hero: {
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 48,
        alignItems: "center",
        padding: "80px 0 60px",
        minHeight: "80vh",
    },
    heroInner: {},
    logoMark: {
        fontSize: 28,
        color: "#7A9E7E",
        marginBottom: 24,
        display: "block",
    },
    heroTitle: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 52,
        color: "#2C2A26",
        letterSpacing: "-1px",
        lineHeight: 1.15,
        margin: "0 0 20px",
    },
    heroEm: {
        fontStyle: "italic",
        color: "#7A9E7E",
    },
    heroSub: {
        fontSize: 17,
        color: "#5A5750",
        lineHeight: 1.7,
        maxWidth: 480,
        margin: "0 0 36px",
    },
    heroBtns: {
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
    },
    heroCards: {
        position: "relative",
        height: 280,
    },
    floatCard: {
        position: "absolute",
        background: "#EBF3EC",
        border: "1px solid #B8D4BC",
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 200,
        boxShadow: "0 4px 20px rgba(122,158,126,0.15)",
    },
    floatCardTitle: {
        fontSize: 13,
        fontWeight: 500,
        color: "#2C2A26",
    },
    floatCardSub: {
        fontSize: 11,
        color: "#9A9790",
        marginTop: 2,
    },

    /* Features */
    features: {
        padding: "60px 0",
        borderTop: "1px solid rgba(42,42,38,0.08)",
    },
    featuresLabel: {
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        color: "#9A9790",
        marginBottom: 28,
        textAlign: "center",
    },
    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
    },
    featureCard: {
        background: "#fff",
        border: "1px solid rgba(42,42,38,0.09)",
        borderRadius: 16,
        padding: "24px 20px",
        boxShadow: "0 2px 12px rgba(42,42,38,0.04)",
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 12,
    },
    featureTitle: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 16,
        color: "#2C2A26",
        marginBottom: 6,
    },
    featureDesc: {
        fontSize: 13,
        color: "#8A8680",
        lineHeight: 1.55,
    },

    /* CTA */
    cta: {
        padding: "60px 0 48px",
        textAlign: "center",
        borderTop: "1px solid rgba(42,42,38,0.08)",
    },
    ctaInner: {},
    ctaTitle: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 36,
        color: "#2C2A26",
        letterSpacing: "-0.5px",
        margin: "0 0 10px",
    },
    ctaSub: {
        fontSize: 14,
        color: "#9A9790",
        margin: "0 0 28px",
    },
    landingFooter: {
        textAlign: "center",
        padding: "20px 0 40px",
        fontSize: 12,
        color: "#9A9790",
    },

    /* Shared buttons */
    btnPrimary: {
        padding: "13px 28px",
        background: "#7A9E7E",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.2s, transform 0.15s",
    },
    btnGhost: {
        padding: "13px 28px",
        background: "transparent",
        color: "#5A5750",
        border: "1.5px solid rgba(42,42,38,0.18)",
        borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
    },

    /* ── Auth form page ── */
    formPage: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100vh",
    },
    formLeft: {
        background: "#2C2A26",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
    },
    formLeftInner: {
        maxWidth: 360,
    },
    formLogoMark: {
        fontSize: 24,
        color: "#7A9E7E",
        marginBottom: 20,
        display: "block",
    },
    formLeftTitle: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 36,
        color: "#FAF8F3",
        margin: "0 0 14px",
        letterSpacing: "-0.5px",
    },
    formLeftSub: {
        fontSize: 15,
        color: "#9A9790",
        lineHeight: 1.65,
        margin: "0 0 36px",
    },
    formQuotes: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    formQuote: {
        fontSize: 13,
        color: "#7A9E7E",
        fontStyle: "italic",
    },
    formRight: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        background: "#FAF8F3",
    },
    formCard: {
        width: "100%",
        maxWidth: 400,
    },
    backBtn: {
        background: "transparent",
        border: "none",
        fontSize: 13,
        color: "#9A9790",
        cursor: "pointer",
        padding: "0 0 24px",
        fontFamily: "'DM Sans', sans-serif",
    },
    formTitle: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 28,
        color: "#2C2A26",
        margin: "0 0 6px",
        letterSpacing: "-0.3px",
    },
    formSubtitle: {
        fontSize: 14,
        color: "#9A9790",
        margin: "0 0 28px",
    },
    errorBox: {
        background: "#F7EAEC",
        border: "1px solid #E8BCC0",
        color: "#8A3A44",
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 18,
    },
    successBox: {
        background: "#EBF3EC",
        border: "1px solid #B8D4BC",
        color: "#4A6E4E",
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 18,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: "#5A5750",
        marginBottom: 6,
    },
    optional: {
        fontWeight: 400,
        color: "#9A9790",
    },
    input: {
        width: "100%",
        padding: "11px 14px",
        border: "1.5px solid rgba(42,42,38,0.14)",
        borderRadius: 9,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: "#2C2A26",
        background: "#fff",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxSizing: "border-box",
    },
    submitBtn: {
        width: "100%",
        padding: "12px",
        background: "#7A9E7E",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        marginTop: 6,
        marginBottom: 20,
        transition: "background 0.2s",
    },
    switchRow: {
        textAlign: "center",
        fontSize: 13,
        color: "#8A8680",
    },
    switchBtn: {
        background: "transparent",
        border: "none",
        color: "#7A9E7E",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        marginLeft: 5,
        textDecoration: "underline",
        textUnderlineOffset: 2,
    },
};