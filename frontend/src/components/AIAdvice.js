import React, { useState, useRef, useEffect } from "react";
import API from "../api";

const QUICK_PROMPTS = [
    { label: "Feeling anxious",        mood: "Anxious",    stress: "Work pressure and deadlines" },
    { label: "Can't sleep",            mood: "Tired",      stress: "Racing thoughts at night" },
    { label: "Feeling overwhelmed",    mood: "Overwhelmed", stress: "Too many responsibilities" },
    { label: "Need motivation",        mood: "Low energy", stress: "Lack of motivation and purpose" },
    { label: "Relationship stress",    mood: "Sad",        stress: "Conflict with someone close" },
    { label: "Breathing exercises",    mood: "Anxious",    stress: "Need calming techniques" },
];

const AFFIRMATIONS = [
    "You are doing better than you think.",
    "Every small step forward is progress.",
    "It's okay to ask for help.",
    "Your feelings are valid.",
    "This too shall pass.",
];

export default function AIAdvice() {
    const [mood, setMood]       = useState("");
    const [stress, setStress]   = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);
    const [affirmation]         = useState(
        AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
    );
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function handleAsk() {
        if (!mood.trim() && !stress.trim()) return;
        const userMsg = [mood, stress].filter(Boolean).join(" — ");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setMood("");
        setStress("");
        setLoading(true);
        try {
            const { data } = await API.post("ai-advice/", { mood, stress });
            setMessages(prev => [...prev, { role: "ai", text: data.advice }]);
        } catch {
            setAlert({ text: "Could not reach the AI — is the backend running?" });
            setTimeout(() => setAlert(null), 3500);
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    }

    function applyPrompt(p) {
        setMood(p.mood);
        setStress(p.stress);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    }

    return (
        <div style={s.wrapper}>

            {/* ── LEFT: Input panel ── */}
            <div style={s.inputPanel}>
                {/* Affirmation card */}
                <div style={s.affirmCard}>
                    <div style={s.affirmIcon}>✦</div>
                    <div style={s.affirmText}>"{affirmation}"</div>
                </div>

                <div style={s.sectionLabel}>Quick topics</div>
                <div style={s.promptGrid}>
                    {QUICK_PROMPTS.map(p => (
                        <button
                            key={p.label}
                            style={{
                                ...s.promptBtn,
                                background: mood === p.mood ? "#EBF3EC" : "#FAF8F3",
                                borderColor: mood === p.mood ? "#7A9E7E" : "rgba(42,42,38,0.12)",
                                color: mood === p.mood ? "#4A6E4E" : "#5A5750",
                            }}
                            onClick={() => applyPrompt(p)}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                <div style={s.divider} />

                <div style={s.sectionLabel}>Or describe yourself</div>

                {alert && (
                    <div style={s.alert}>{alert.text}</div>
                )}

                <div style={s.formGroup}>
                    <label style={s.formLabel}>How are you feeling?</label>
                    <input
                        style={s.input}
                        placeholder="e.g. Anxious, tired, overwhelmed…"
                        value={mood}
                        onChange={e => setMood(e.target.value)}
                        onFocus={e => e.target.style.borderColor = "#7A9E7E"}
                        onBlur={e => e.target.style.borderColor = "rgba(42,42,38,0.14)"}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div style={s.formGroup}>
                    <label style={s.formLabel}>What's causing stress? <span style={s.optional}>optional</span></label>
                    <input
                        style={s.input}
                        placeholder="e.g. Work deadlines, relationship issues…"
                        value={stress}
                        onChange={e => setStress(e.target.value)}
                        onFocus={e => e.target.style.borderColor = "#7A9E7E"}
                        onBlur={e => e.target.style.borderColor = "rgba(42,42,38,0.14)"}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <button
                    style={{
                        ...s.submitBtn,
                        opacity: ((!mood.trim() && !stress.trim()) || loading) ? 0.5 : 1,
                        cursor: ((!mood.trim() && !stress.trim()) || loading) ? "not-allowed" : "pointer",
                    }}
                    onClick={handleAsk}
                    disabled={(!mood.trim() && !stress.trim()) || loading}
                >
                    {loading ? "Thinking…" : "Get support ✦"}
                </button>

                {messages.length > 0 && (
                    <button style={s.clearBtn} onClick={() => setMessages([])}>
                        Clear conversation
                    </button>
                )}
            </div>

            {/* ── RIGHT: Chat panel ── */}
            <div style={s.chatPanel}>
                <div style={s.chatHeader}>
                    <div style={s.chatAvatar}>✦</div>
                    <div>
                        <div style={s.chatName}>MindMate Companion</div>
                        <div style={s.chatStatus}>
                            <span style={s.statusDot} />
                            Always here for you
                        </div>
                    </div>
                </div>

                <div style={s.chatBody}>
                    {messages.length === 0 && !loading && (
                        <div style={s.emptyChat}>
                            <div style={s.emptyChatIcon}>💬</div>
                            <div style={s.emptyChatText}>Start a conversation</div>
                            <div style={s.emptyChatSub}>
                                Select a quick topic or describe how you're feeling — your companion is ready to listen.
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                ...s.msgRow,
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                animationDelay: `${i * 0.05}s`,
                            }}
                        >
                            {msg.role === "ai" && (
                                <div style={s.aiAvatar}>✦</div>
                            )}
                            <div style={{
                                ...s.bubble,
                                ...(msg.role === "user" ? s.userBubble : s.aiBubble),
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ ...s.msgRow, justifyContent: "flex-start" }}>
                            <div style={s.aiAvatar}>✦</div>
                            <div style={{ ...s.bubble, ...s.aiBubble }}>
                                <div style={s.typingDots}>
                                    <span style={{ ...s.typingDot, animationDelay: "0s" }} />
                                    <span style={{ ...s.typingDot, animationDelay: "0.2s" }} />
                                    <span style={{ ...s.typingDot, animationDelay: "0.4s" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}

const s = {
    wrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "start",
    },

    /* ── Input Panel ── */
    inputPanel: {
        background: "#fff",
        borderRadius: 22,
        border: "1px solid rgba(42,42,38,0.09)",
        padding: "24px 26px",
        boxShadow: "0 1px 3px rgba(42,42,38,0.05), 0 4px 24px rgba(42,42,38,0.05)",
    },
    affirmCard: {
        background: "#EBF3EC",
        border: "1px solid #B8D4BC",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 22,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
    },
    affirmIcon: {
        color: "#7A9E7E",
        fontSize: 14,
        flexShrink: 0,
        marginTop: 1,
    },
    affirmText: {
        fontSize: 13,
        color: "#4A6E4E",
        fontStyle: "italic",
        lineHeight: 1.55,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "#9A9790",
        marginBottom: 10,
    },
    promptGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 4,
    },
    promptBtn: {
        padding: "8px 12px",
        border: "1.5px solid",
        borderRadius: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
        textAlign: "left",
    },
    divider: {
        height: 1,
        background: "rgba(42,42,38,0.08)",
        margin: "18px 0",
    },
    alert: {
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 13,
        background: "#F7EAEC",
        border: "1px solid #E8BCC0",
        color: "#8A3A44",
        marginBottom: 14,
    },
    formGroup: {
        marginBottom: 14,
    },
    formLabel: {
        display: "block",
        fontSize: 12,
        fontWeight: 500,
        color: "#5A5750",
        marginBottom: 6,
        letterSpacing: "0.1px",
    },
    optional: {
        fontWeight: 400,
        color: "#9A9790",
    },
    input: {
        width: "100%",
        padding: "10px 13px",
        border: "1.5px solid rgba(42,42,38,0.14)",
        borderRadius: 9,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: "#2C2A26",
        background: "#FAF8F3",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    },
    submitBtn: {
        width: "100%",
        padding: "11px 20px",
        background: "#7A9E7E",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        transition: "background 0.2s",
        marginBottom: 10,
    },
    clearBtn: {
        width: "100%",
        padding: "8px",
        background: "transparent",
        color: "#9A9790",
        border: "none",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        cursor: "pointer",
        textDecoration: "underline",
        textUnderlineOffset: 2,
    },

    /* ── Chat Panel ── */
    chatPanel: {
        background: "#fff",
        borderRadius: 22,
        border: "1px solid rgba(42,42,38,0.09)",
        boxShadow: "0 1px 3px rgba(42,42,38,0.05), 0 4px 24px rgba(42,42,38,0.05)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 480,
    },
    chatHeader: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 24px",
        borderBottom: "1px solid rgba(42,42,38,0.08)",
        background: "#FAF8F3",
    },
    chatAvatar: {
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "#EBF3EC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "#7A9E7E",
        flexShrink: 0,
    },
    chatName: {
        fontSize: 14,
        fontWeight: 500,
        color: "#2C2A26",
        marginBottom: 2,
    },
    chatStatus: {
        fontSize: 11,
        color: "#9A9790",
        display: "flex",
        alignItems: "center",
        gap: 5,
    },
    statusDot: {
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#7A9E7E",
    },
    chatBody: {
        flex: 1,
        padding: "20px 20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        maxHeight: 480,
    },
    emptyChat: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
    },
    emptyChatIcon: {
        fontSize: 32,
        marginBottom: 12,
        opacity: 0.4,
    },
    emptyChatText: {
        fontSize: 15,
        fontWeight: 500,
        color: "#8A8680",
        marginBottom: 6,
    },
    emptyChatSub: {
        fontSize: 12,
        color: "#9A9790",
        lineHeight: 1.6,
        maxWidth: 240,
    },
    msgRow: {
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        animation: "fadeIn 0.3s ease forwards",
    },
    aiAvatar: {
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "#EBF3EC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "#7A9E7E",
        flexShrink: 0,
    },
    bubble: {
        maxWidth: "78%",
        padding: "11px 15px",
        fontSize: 13,
        lineHeight: 1.65,
        borderRadius: 14,
    },
    userBubble: {
        background: "#7A9E7E",
        color: "#fff",
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        background: "#FAF8F3",
        color: "#2C2A26",
        border: "1px solid rgba(42,42,38,0.08)",
        borderBottomLeftRadius: 4,
    },
    typingDots: {
        display: "flex",
        gap: 4,
        alignItems: "center",
        padding: "2px 0",
    },
    typingDot: {
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#B8D4BC",
        animation: "pulse 1.2s infinite",
    },
};