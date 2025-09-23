import React from "react";
import MoodLogs from "./components/MoodLogs";
import Therapists from "./components/Therapists";
import StressAnalysis from "./components/StressAnalysis";

function App() {
  return (
      <div className="App">
        <h1>AI Mental Health Assistance</h1>
        <MoodLogs />
        <Therapists />
        <StressAnalysis />
      </div>
  );
}

export default App;
