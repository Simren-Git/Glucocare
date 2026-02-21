import React, { useState, useEffect } from "react";
import {
  Droplet,
  Plus,
  Check,
  TrendingUp,
  ArrowLeft,
  Utensils,
  Syringe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function BGLoggingModule() {
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [bgEntry, setBgEntry] = useState({
    bgType: "",
    bgValue: "",
    foodItem: "",
    insulinUnits: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bgHistory, setBgHistory] = useState([]);

  const userId = localStorage.getItem("user_id") || "1";
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  /* ================= LOAD BG HISTORY ================= */
  useEffect(() => {
    loadBGHistory();
  }, []);

  const loadBGHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/blood-sugar-history/${userId}/`
      );
      const data = await response.json();
      setBgHistory(data);
    } catch (error) {
      console.error("Error loading BG history:", error);
      setBgHistory([]);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBgEntry(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bgEntry.bgType) newErrors.bgType = "Select type";
    if (!bgEntry.bgValue) newErrors.bgValue = "Enter value";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await fetch(`${API_BASE}/add-blood-sugar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          sugar_level: parseFloat(bgEntry.bgValue),
          measurement_type: bgEntry.bgType,
          food_item: bgEntry.foodItem || null,
          insulin_units: bgEntry.insulinUnits
            ? parseFloat(bgEntry.insulinUnits)
            : null
        })
      });

      setSuccess(true);
      await loadBGHistory();

      setTimeout(() => {
        setBgEntry({
          bgType: "",
          bgValue: "",
          foodItem: "",
          insulinUnits: ""
        });
        setShowAddForm(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS FIX ================= */
  const getStatus = (value) => {
    if (value < 70)
      return { label: "Low", color: "bg-red-100 text-red-700" };
    if (value <= 140)
      return { label: "Normal", color: "bg-green-100 text-green-700" };
    if (value <= 180)
      return { label: "High", color: "bg-orange-100 text-orange-700" };
    return { label: "Very High", color: "bg-red-200 text-red-800" };
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate("/patient-dashboard")}
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold flex items-center mb-6">
          <Droplet className="text-teal-600 mr-2" /> Blood Glucose Log
        </h1>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl mb-6 flex items-center gap-2"
          >
            <Plus size={18} /> Add Reading
          </button>
        )}

        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            {success ? (
              <div className="text-center py-8">
                <Check size={40} className="text-green-600 mx-auto mb-2" />
                Saved successfully
              </div>
            ) : (
              <>
                <select
                  name="bgType"
                  value={bgEntry.bgType}
                  onChange={handleChange}
                  className="w-full border p-3 rounded mb-2"
                >
                  <option value="">Select Type</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="Post Meal">Post Meal</option>
                  <option value="Random">Random</option>
                </select>

                <input
                  type="number"
                  name="bgValue"
                  placeholder="Blood Sugar (mg/dL)"
                  value={bgEntry.bgValue}
                  onChange={handleChange}
                  className="w-full border p-3 rounded mb-3"
                />

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div className="relative">
                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="foodItem"
                      placeholder="Food intake (e.g., Apple, Rice)"
                      value={bgEntry.foodItem}
                      onChange={handleChange}
                      className="w-full border p-3 pl-10 rounded"
                    />
                  </div>
                  <div className="relative">
                    <Syringe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="insulinUnits"
                      placeholder="Insulin units"
                      value={bgEntry.insulinUnits}
                      onChange={handleChange}
                      className="w-full border p-3 pl-10 rounded"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-teal-600 text-white w-full py-3 rounded-xl"
                >
                  {loading ? "Saving..." : "Save Reading"}
                </button>
              </>
            )}
          </div>
        )}

        {/* ================= READINGS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="mr-2" /> Readings
          </h2>

          {bgHistory.length === 0 && (
            <p className="text-sm text-gray-500">No readings yet.</p>
          )}

          {bgHistory.map(r => {
            const status = getStatus(r.sugar_level);

            return (
              <div
                key={r.record_id}
                className="flex justify-between items-center border rounded-xl p-4 mb-3"
              >
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}
                  >
                    {status.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.recorded_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-2xl font-bold">
                  {r.sugar_level} mg/dL
                </div>
              </div>
            );
          })}

          <button
            onClick={() => navigate(`/blood-sugar-history/${userId}`)}
            className="mt-4 text-teal-600 font-semibold"
          >
            View history →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BGLoggingModule;
