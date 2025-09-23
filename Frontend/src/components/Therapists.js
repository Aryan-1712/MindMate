import React, { useEffect, useState } from "react";
import API from "../api";

const Therapists = () => {
    const [therapists, setTherapists] = useState([]);

    useEffect(() => {
        fetchTherapists();
    }, []);

    const fetchTherapists = async () => {
        const res = await API.get("therapists/");
        setTherapists(res.data);
    };

    return (
        <div>
            <h2>Therapists List</h2>
            <ul>
                {therapists.map((t) => (
                    <li key={t.id}>{t.name} - {t.specialization}</li>
                ))}
            </ul>
        </div>
    );
};

export default Therapists;
