import React, { useState, useEffect } from "react";
import API from "../api";  // make sure this points to your API.js

const StressChecker = () => {
    const [userInput, setUserInput] = useState("");
    const [stressData, setStressData] = useState([]);

    const fetchStressLogs = async () => {
        try {
            const res = await API.get("stress/");
            setStressData(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const addStressLog = async () => {
        if (!userInput) return alert("Please enter some text");
        try {
            await API.post("stress/", { text_input: userInput });
            setUserInput("");
            fetchStressLogs();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchStressLogs();
    }, []);

    return (
        <div>
            <h2>Stress/Anxiety Checker</h2>
            <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="How are you feeling?"
            />
            <button onClick={addStressLog}>Submit</button>
            <ul>
                {stressData.map((s) => (
                    <li key={s.id}>{s.text_input} | Stress Level: {s.stress_level}</li>
                ))}
            </ul>
        </div>
    );
};

export default StressChecker;
