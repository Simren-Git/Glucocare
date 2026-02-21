import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Utensils,
  Syringe,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function BloodGlucoseManagement() {
  const { userId } = useParams();

  /* 🔒 GUARD */
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid patient selected
      </div>
    );
  }

  const [patient, setPatient] = useState(null);
  const [allReadings, setAllReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState(new Set());

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, glucoseRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/patient/${userId}/`),
          axios.get(
            `http://127.0.0.1:8000/api/blood-sugar-history/${userId}/`
          )
        ]);

        /* ✅ MAP BACKEND → FRONTEND */
        const readings = (glucoseRes.data || []).map(r => ({
          id: r.record_id,
          glucose: r.sugar_level,
          type: r.measurement_type,
          food: r.food_item,
          insulin_units: r.insulin_units,
          date: r.date,
          time: r.time
        }));

        setPatient({
          name: patientRes.data.patient_name,
          age: patientRes.data.age,
          gender: patientRes.data.gender,
          id: patientRes.data.user_id,
          initials: patientRes.data.patient_name
            .split(" ")
            .map(n => n[0])
            .join(""),
          avgGlucose: readings.length
            ? Math.round(
                readings.reduce((a, b) => a + b.glucose, 0) /
                  readings.length
              )
            : 0
        });

        setAllReadings(readings);
        setLoading(false);
      } catch (err) {
        console.error("Glucose fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const toggleCard = id => {
    const next = new Set(expandedCards);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedCards(next);
  };

  if (loading || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading glucose data...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* HEADER */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold">
          Blood Glucose Management
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor and analyze patient glucose levels
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* PATIENT SUMMARY */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-2xl font-bold">{patient.name}</h2>
          <p className="text-gray-600">
            {patient.age} • {patient.gender} • {patient.id}
          </p>
          <p className="mt-3 text-xl font-semibold">
            Avg Glucose: {patient.avgGlucose} mg/dL
          </p>
        </div>

        {/* HISTORY */}
        <h2 className="text-xl font-bold mb-4">
          Reading History
        </h2>

        {allReadings.map(r => (
          <div
            key={r.id}
            className="bg-white border rounded-xl mb-3"
          >
            <div
              className="p-5 flex justify-between cursor-pointer"
              onClick={() => toggleCard(r.id)}
            >
              <div>
                <p className="font-semibold capitalize">
                  {r.type}
                </p>
                <p className="text-sm text-gray-500">
                  {r.date} • {r.time}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold">
                  {r.glucose}
                </p>
                {expandedCards.has(r.id) ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>
            </div>

            {expandedCards.has(r.id) && (
              <div className="bg-gray-50 border-t p-5 grid md:grid-cols-3 gap-6">
                <Detail icon={<Syringe />} label="Insulin">
                  {r.insulin_units
                    ? `${r.insulin_units} units`
                    : "No"}
                </Detail>

                <Detail icon={<Utensils />} label="Food">
                  {r.food || "—"}
                </Detail>

                <Detail icon={<Activity />} label="Notes">
                  —
                </Detail>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== DETAIL COMPONENT ===== */
const Detail = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <div className="p-2 bg-gray-200 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-sm">{children}</p>
    </div>
  </div>
);
