import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Clock, User, Calendar, Hash } from "lucide-react";

export default function CreateDietPlan() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const [breakfast, setBreakfast] = useState({
    timeFrom: "07:00",
    timeTo: "09:00",
    items: [""]
  });

  const [lunch, setLunch] = useState({
    timeFrom: "12:00",
    timeTo: "14:00",
    items: [""]
  });

  const [dinner, setDinner] = useState({
    timeFrom: "19:00",
    timeTo: "21:00",
    items: [""]
  });

  /* ---------------- FETCH PATIENT ---------------- */
  useEffect(() => {
    axios
      .get(`${API_BASE}/patient/${patientId}/`)
      .then(res => {
        setPatient(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Patient fetch error:", err);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return <div className="p-6">Loading patient details...</div>;
  }

  if (!patient) {
    return <div className="p-6 text-red-600">Patient not found</div>;
  }

  /* ---------------- HELPERS ---------------- */
  const addItem = (setMeal) => {
    setMeal(prev => ({ ...prev, items: [...prev.items, ""] }));
  };

  const removeItem = (setMeal, index) => {
    setMeal(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (setMeal, index, value) => {
    setMeal(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? value : item))
    }));
  };

  const updateTime = (setMeal, field, value) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  /* ---------------- SAVE DIET PLAN (API) ---------------- */
  const handleSave = async () => {
    if (!dietType || !calories) {
      alert("Please select diet type and calories");
      return;
    }

    const dietPlanPayload = {
      patient_id: patient.user ?? patient.user_id ?? patient.patient_id,
      diet_details: {
        diet_type: dietType,
        calories,
        notes,
        meals: {
          breakfast,
          lunch,
          dinner
        }
      }
    };

    console.log("Saving diet plan:", dietPlanPayload);

    try {
      const res = await axios.post(
        `${API_BASE}/diet-plan/create/`,
        dietPlanPayload
      );

      alert("✅ Diet plan saved successfully");
      console.log("API RESPONSE:", res.data);

      navigate(-1); // go back to patient management
    } catch (error) {
      console.error("❌ Diet plan save error:", error);
      alert("Failed to save diet plan");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes?")) {
      navigate(-1);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Create Diet Plan</h1>

        {/* PATIENT SUMMARY */}
        <div className="bg-white p-5 rounded-lg border mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Info icon={User} label="Name" value={patient.patient_name} />
          <Info icon={Calendar} label="Age" value={`${patient.age} years`} />
          <Info icon={User} label="Gender" value={patient.gender} />
          <Info icon={Hash} label="Patient ID" value={patient.patient_id} />
        </div>

        {/* DIET OVERVIEW */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h2 className="text-xl font-semibold mb-4">Diet Overview</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <select
              value={dietType}
              onChange={e => setDietType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Select diet type</option>
              <option value="diabetic">Diabetic</option>
              <option value="low-carb">Low Carb</option>
              <option value="high-protein">High Protein</option>
            </select>

            <input
              type="number"
              placeholder="Calories (kcal/day)"
              value={calories}
              onChange={e => setCalories(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>

          <textarea
            rows="4"
            placeholder="Additional notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* MEALS */}
        <div className="grid gap-6 mb-6">
          <MealCard
            title="Breakfast"
            meal={breakfast}
            onTimeChange={(field, value) => updateTime(setBreakfast, field, value)}
            onItemChange={(index, value) => updateItem(setBreakfast, index, value)}
            onAddItem={() => addItem(setBreakfast)}
            onRemoveItem={(index) => removeItem(setBreakfast, index)}
          />
          <MealCard
            title="Lunch"
            meal={lunch}
            onTimeChange={(field, value) => updateTime(setLunch, field, value)}
            onItemChange={(index, value) => updateItem(setLunch, index, value)}
            onAddItem={() => addItem(setLunch)}
            onRemoveItem={(index) => removeItem(setLunch, index)}
          />
          <MealCard
            title="Dinner"
            meal={dinner}
            onTimeChange={(field, value) => updateTime(setDinner, field, value)}
            onItemChange={(index, value) => updateItem(setDinner, index, value)}
            onAddItem={() => addItem(setDinner)}
            onRemoveItem={(index) => removeItem(setDinner, index)}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={handleCancel} className="px-6 py-2 border rounded-md">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-teal-600 text-white rounded-md"
          >
            Save Diet Plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INFO BLOCK ---------------- */
const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-teal-600 mt-1" />
    <div>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

/* ---------------- MEAL CARD ---------------- */
const MealCard = React.memo(({ title, meal, onTimeChange, onItemChange, onAddItem, onRemoveItem }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-2 mb-4">
      <Clock className="w-5 h-5 text-teal-600" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Time Window</label>
      <div className="flex items-center gap-3">
        <input
          type="time"
          value={meal.timeFrom}
          onChange={e => onTimeChange("timeFrom", e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <span>to</span>
        <input
          type="time"
          value={meal.timeTo}
          onChange={e => onTimeChange("timeTo", e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
      </div>
    </div>

    <label className="block text-sm font-medium mb-2">Food Items</label>

    {meal.items.map((item, index) => (
      <div key={index} className="flex gap-2 mb-2">
        <input
          value={item}
          onChange={e => onItemChange(index, e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
          placeholder="Food item"
        />
        {meal.items.length > 1 && (
          <button type="button" onClick={() => onRemoveItem(index)}>
            <X className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>
    ))}

    <button
      type="button"
      onClick={onAddItem}
      className="mt-2 text-teal-600 flex items-center gap-1"
    >
      <Plus className="w-4 h-4" /> Add Item
    </button>
  </div>
));
