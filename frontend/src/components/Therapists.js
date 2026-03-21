import React, { useState, useEffect } from "react";
import API from "../api";

const SPEC_COLORS = {
    "Anxiety":    "badge-lavender",
    "Depression": "badge-blush",
    "Trauma":     "badge-amber",
    "default":    "badge-sage",
};

function initials(name) {
    return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Therapists() {
    const [therapists, setTherapists] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");

    // Add therapist form
    const [form, setForm]   = useState({ name: "", specialization: "", location: "", contact: "" });
    const [saving, setSaving] = useState(false);
    const [alert, setAlert]   = useState(null);

    useEffect(() => { fetchTherapists(); }, []);

    async function fetchTherapists() {
        setLoading(true);
        try {
            const { data } = await API.get("therapists/");
            setTherapists(data);
        } catch {
            /* network error */
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!form.name || !form.specialization || !form.location) return;
        setSaving(true);
        try {
            await API.post("therapists/", form);
            setAlert({ type: "success", text: "Therapist added successfully ✓" });
            setForm({ name: "", specialization: "", location: "", contact: "" });
            fetchTherapists();
        } catch {
            setAlert({ type: "error", text: "Could not save — check your backend." });
        } finally {
            setSaving(false);
            setTimeout(() => setAlert(null), 3000);
        }
    }

    const filtered = therapists.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.specialization.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="two-col" style={{ marginBottom: 0 }}>
                {/* List */}
                <div className="card" style={{ gridColumn: "1 / -1" }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Therapist directory</div>
                            <div className="card-subtitle">{therapists.length} professionals listed</div>
                        </div>
                        <input
                            className="form-input"
                            placeholder="Search by name, specialisation…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: 220, marginBottom: 0 }}
                        />
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="ai-loading" style={{ justifyContent: "center" }}>
                                <div className="dot" /><div className="dot" /><div className="dot" />
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🤝</div>
                            <div className="empty-text">
                                {search ? "No results match your search" : "No therapists added yet"}
                            </div>
                        </div>
                    ) : (
                        <div className="therapist-grid">
                            {filtered.map(t => (
                                <div key={t.id} className="therapist-card">
                                    <div className="therapist-avatar">{initials(t.name)}</div>
                                    <div className="therapist-name">{t.name}</div>
                                    <div className="therapist-spec">
                    <span className={`badge ${SPEC_COLORS[t.specialization] || SPEC_COLORS.default}`}>
                      {t.specialization}
                    </span>
                                    </div>
                                    <div className="therapist-location">
                                        <span style={{ fontSize: 12 }}>📍</span> {t.location}
                                    </div>
                                    {t.contact && (
                                        <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                                            {t.contact}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add new therapist */}
            <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header">
                    <div>
                        <div className="card-title">Add a therapist</div>
                        <div className="card-subtitle">Contribute to the directory</div>
                    </div>
                </div>

                {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                    <div className="form-group">
                        <label className="form-label">Full name *</label>
                        <input className="form-input" placeholder="Dr. Priya Sharma" value={form.name}
                               onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Specialisation *</label>
                        <input className="form-input" placeholder="Anxiety, Depression…" value={form.specialization}
                               onChange={e => setForm({ ...form, specialization: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location *</label>
                        <input className="form-input" placeholder="Delhi, India" value={form.location}
                               onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contact (optional)</label>
                        <input className="form-input" placeholder="+91 98765 43210" value={form.contact}
                               onChange={e => setForm({ ...form, contact: e.target.value })} />
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleAdd}
                    disabled={!form.name || !form.specialization || !form.location || saving}
                    style={{ opacity: (!form.name || !form.specialization || !form.location || saving) ? 0.55 : 1 }}
                >
                    {saving ? "Adding…" : "Add therapist"}
                </button>
            </div>
        </>
    );
}
