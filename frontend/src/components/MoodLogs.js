import React, { useState, useEffect } from "react";
import API from "../api";

const MOODS = [
    { key: "Happy",    emoji: "😊", color: "#7A9E7E" },
    { key: "Calm",     emoji: "😌", color: "#9B8EC4" },
    { key: "Anxious",  emoji: "😰", color: "#D4A853" },
    { key: "Sad",      emoji: "😔", color: "#8AACCC" },
    { key: "Angry",    emoji: "😤", color: "#C4848E" },
];

const EMOJI_MAP = Object.fromEntries(MOODS.map(m => [m.key, m.emoji]));

export default function MoodLogs() {
    const [logs, setLogs]       = useState([]);
    const [selected, setSelected] = useState(null);
    const [notes, setNotes]     = useState("");
    const [saving, setSaving]   = useState(false);
    const [alert, setAlert]     = useState(null);

    useEffect(() => { fetchLogs(); }, []);

    async function fetchLogs() {
        try {
            const { data } = await API.get("mood/");
            setLogs(data.slice(0, 10));
        } catch {
            /* silently fail on network error */
        }
    }

    async function handleSave() {
        if (!selected) return;
        setSaving(true);
        try {
            await API.post("mood/", { mood: selected, notes });
            setAlert({ type: "success", text: "Mood logged successfully ✓" });
            setSelected(null);
            setNotes("");
            fetchLogs();
        } catch {
            setAlert({ type: "error", text: "Could not save — is the backend running?" });
        } finally {
            setSaving(false);
            setTimeout(() => setAlert(null), 3000);
        }
    }

    const streak = logs.length;

    return (
        <>
            {/* Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                <div className="stat-card">
                    <div className="stat-label">Total logs</div>
                    <div className="stat-value">{logs.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Recent mood</div>
                    <div className="stat-value" style={{ fontSize: 28 }}>
                        {logs[0] ? EMOJI_MAP[logs[0].mood] || "–" : "–"}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Most common</div>
                    <div className="stat-value" style={{ fontSize: 22 }}>
                        {streak > 0 ? (() => {
                            const freq = {};
                            logs.forEach(l => freq[l.mood] = (freq[l.mood] || 0) + 1);
                            return Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] || "–";
                        })() : "–"}
                    </div>
                </div>
            </div>

            <div className="two-col">
                {/* Log new mood */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">How are you feeling?</div>
                            <div className="card-subtitle">Select a mood to log for today</div>
                        </div>
                    </div>

                    {alert && (
                        <div className={`alert alert-${alert.type}`}>{alert.text}</div>
                    )}

                    <div className="mood-grid" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
                        {MOODS.map(({ key, emoji }) => (
                            <button
                                key={key}
                                className={`mood-btn ${selected === key ? "selected" : ""}`}
                                onClick={() => setSelected(key)}
                            >
                                <span className="mood-emoji">{emoji}</span>
                                <span className="mood-label">{key}</span>
                            </button>
                        ))}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Add a note (optional)</label>
                        <textarea
                            className="form-textarea"
                            placeholder="What's on your mind today?"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ minHeight: 72 }}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!selected || saving}
                        style={{ opacity: (!selected || saving) ? 0.55 : 1 }}
                    >
                        {saving ? "Saving…" : "Log mood"}
                    </button>
                </div>

                {/* Recent logs */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Recent entries</div>
                            <div className="card-subtitle">Your last 10 mood logs</div>
                        </div>
                    </div>

                    {logs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <div className="empty-text">No entries yet. Log your first mood!</div>
                        </div>
                    ) : (
                        <div className="log-list">
                            {logs.map(log => (
                                <div key={log.id} className="log-item">
                                    <span className="log-emoji">{EMOJI_MAP[log.mood] || "😶"}</span>
                                    <div className="log-body">
                                        <div className="log-mood-name">{log.mood}</div>
                                        {log.notes && <div className="log-notes">{log.notes}</div>}
                                    </div>
                                    <span className="log-date">{log.date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
