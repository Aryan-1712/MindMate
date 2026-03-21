import React, { useState, useEffect } from "react";
import "./App.css";
import AuthPage from "./components/AuthPage";
import MoodLogs from "./components/MoodLogs";
import Therapists from "./components/Therapists";
import StressAnalysis from "./components/StressAnalysis";
import AIAdvice from "./components/AIAdvice";

const NAV = [
  { id: "mood",       label: "Mood Journal",   icon: "🌿" },
  { id: "stress",     label: "Stress Check",    icon: "🧘" },
  { id: "advice",     label: "AI Companion",    icon: "✦"  },
  { id: "therapists", label: "Find Therapists", icon: "🤝" },
];

const PAGE_TITLES = {
  mood:       { title: "Mood Journal",     sub: "Track how you're feeling each day" },
  stress:     { title: "Stress Check",     sub: "Analyse and understand your stress levels" },
  advice:     { title: "AI Companion",     sub: "Talk through anything on your mind" },
  therapists: { title: "Find Therapists",  sub: "Connect with mental health professionals" },
};

function App() {
  const [user, setUser]           = useState(null);
  const [activePage, setActivePage] = useState("mood");
  const [authChecked, setAuthChecked] = useState(false);

  // Check if already logged in on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token  = localStorage.getItem("access_token");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* invalid */ }
    }
    setAuthChecked(true);
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    setActivePage("mood");
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  }

  // Wait for auth check before rendering
  if (!authChecked) return null;

  // Show auth page if not logged in
  if (!user) return <AuthPage onLogin={handleLogin} />;

  const { title, sub } = PAGE_TITLES[activePage];
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h2>MindMate</h2>
            <span>Mental wellness companion</span>
          </div>

          <nav className="sidebar-nav">
            {NAV.map(({ id, label, icon }) => (
                <button
                    key={id}
                    className={`nav-item ${activePage === id ? "active" : ""}`}
                    onClick={() => setActivePage(id)}
                >
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  {label}
                </button>
            ))}
          </nav>

          {/* User info + logout */}
          <div style={userStyles.userBox}>
            <div style={userStyles.avatar}>{initials}</div>
            <div style={userStyles.userInfo}>
              <div style={userStyles.userName}>{user.username}</div>
              <button style={userStyles.logoutBtn} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-header fade-in" key={activePage}>
            <div className="page-date">{today}</div>
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>

          <div className="fade-in" key={activePage + "-content"}>
            {activePage === "mood"       && <MoodLogs />}
            {activePage === "stress"     && <StressAnalysis />}
            {activePage === "advice"     && <AIAdvice />}
            {activePage === "therapists" && <Therapists />}
          </div>
        </main>
      </div>
  );
}

const userStyles = {
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    borderTop: "1px solid rgba(42,42,38,0.1)",
    marginTop: "auto",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#EBF3EC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    color: "#4A6E4E",
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#2C2A26",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    fontSize: 11,
    color: "#9A9790",
    cursor: "pointer",
    padding: 0,
    fontFamily: "'DM Sans', sans-serif",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
};

export default App;