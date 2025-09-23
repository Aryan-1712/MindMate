import React, { useEffect, useState } from "react";
import API from "../api";

const MoodLogs = () => {
    const [moods, setMoods] = useState([]);
    const [moodInput, setMoodInput] = useState("");

    useEffect(() => {
        fetchMoods();
    }, []);

    const fetchMoods = async () => {
        const res = await API.get("mood/");
        setMoods(res.data);
    };

    const addMood = async () => {
        try {
            await API.post("mood/", {
                mood: moodInput,
                notes: "" // optional, can be replaced with a notes input if you have one
            });
            setMoodInput("");
            fetchMoods();
        } catch (error) {
            console.error("Error submitting mood:", error);
        }
    };

    return (
        <div>
            <h2>Mood Tracker</h2>
            <input
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                placeholder="Enter your mood"
            />
            <button onClick={addMood}>Add Mood</button>
            <ul>
                {moods.map((m) => (
                    <li key={m.id}>{m.mood}</li>
                ))}
            </ul>
        </div>
    );
};

export default MoodLogs;
