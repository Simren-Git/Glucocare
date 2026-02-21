import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ArrowLeft, Activity, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PatientGlucoseGraph() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/blood-sugar-history/${userId}/`)
      .then(res => res.json())
      .then(data => {
        // reverse so graph flows left → right (old → new)
        setReadings(data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error("Graph fetch error:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading glucose graph...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-6xl mx-auto">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Activity /> Glucose Trend
      </h1>

      {/* GRAPH CARD */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Droplet /> Blood Glucose Over Time
        </h2>

        {readings.length === 0 ? (
          <p className="text-gray-500">No glucose data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="recorded_at"
                tickFormatter={value =>
                  new Date(value).toLocaleDateString()
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} mg/dL`, "Glucose"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleString()
                }
              />
              <Line
                type="monotone"
                dataKey="sugar_level"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default PatientGlucoseGraph;
