import React, { useState } from "react";
import API from "../api";

function StressMeter({ level }) {
    const pct = Math.round(level * 100);
    const colorClass = pct < 35 ? "stress-low" : pct < 65 ? "stress-medium" : "stress-high";
    const label = pct < 35 ? "Low" : pct < 65 ? "Moderate" : "High";
    const desc =
        pct < 35
            ? "You seem to be managing well. Keep up the good habits."
            : pct < 65
                ? "Some stress detected. Consider taking short breaks today."
                : "High stress levels noticed. Please take time to rest and breathe.";

    return (
        <div className="stress-meter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
          Stress level: <strong>{label}</strong>
        </span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "var(--text-primary)" }}>
          {pct}%
        </span>
            </div>
            <div className="stress-bar-bg">
                <div
                    className={`stress-bar-fill ${colorClass}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="stress-labels">
                <span>Low</span><span>Moderate</span><span>High</span>
            </div>
            <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {desc}
            </p>
        </div>
    );
}

export default function StressAnalysis() {
    const [text, setText]     = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert]   = useState(null);

    async function handleAnalyse() {
        if (!text.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const { data } = await API.post("stress/", { text_input: text });
            setResult(data);
        } catch {
            setAlert({ type: "error", text: "Analysis failed — please check your backend connection." });
            setTimeout(() => setAlert(null), 3500);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="two-col">
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Describe how you feel</div>
                        <div className="card-subtitle">Write freely — our AI will assess your stress level</div>
                    </div>
                </div>

                {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

                <div className="form-group">
          <textarea
              className="form-textarea"
              style={{ minHeight: 160 }}
              placeholder="I've been feeling overwhelmed lately with work and struggling to sleep..."
              value={text}
              onChange={e => setText(e.target.value)}
          />
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleAnalyse}
                        disabled={!text.trim() || loading}
                        style={{ opacity: (!text.trim() || loading) ? 0.55 : 1 }}
                    >
                        {loading ? "Analysing…" : "Analyse stress"}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setText(""); setResult(null); }}>
                        Clear
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Analysis result</div>
                        <div className="card-subtitle">Based on your written input</div>
                    </div>
                </div>

                {loading && (
                    <div style={{ padding: "20px 0" }}>
                        <div className="ai-loading">
                            <div className="dot" /><div className="dot" /><div className="dot" />
                            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 8 }}>Analysing your text…</span>
                        </div>
                    </div>
                )}

                {result && !loading && (
                    <StressMeter level={result.stress_level ?? 0.5} />
                )}

                {!result && !loading && (
                    <div className="empty-state">
                        <div className="empty-icon">🧘</div>
                        <div className="empty-text">Your analysis will appear here</div>
                    </div>
                )}
            </div>
        </div>
    );
}
