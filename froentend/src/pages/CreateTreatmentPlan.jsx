import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Pill,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function CreateTreatmentPlan() {
  const { patientId } = useParams(); // THIS IS user_id (by design)
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  /* ================= PATIENT ================= */
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/patient/${patientId}/`)
      .then(res => {
        setPatient(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Patient fetch error:", err);
        setLoading(false);
      });
  }, [patientId]);

  /* ================= FORM STATE ================= */
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", timing: "" }
  ]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const timingOptions = [
    "Before breakfast",
    "After breakfast",
    "Before lunch",
    "After lunch",
    "Before dinner",
    "After dinner",
    "Bedtime",
    "With food",
    "As needed"
  ];

  /* ================= HELPERS ================= */
  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: "", dosage: "", timing: "" }
    ]);
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMedication = id => {
    if (medications.length > 1) {
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};
    if (!diagnosis) e.diagnosis = "Diagnosis required";
    if (!startDate) e.startDate = "Start date required";
    if (!endDate) e.endDate = "End date required";
    if (new Date(endDate) <= new Date(startDate))
      e.endDate = "End date must be after start date";

    const meds = medications.filter(m => m.name && m.dosage && m.timing);
    if (!meds.length) e.medications = "At least one medication required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      patient_id: patient?.user ?? patient?.user_id ?? patientId, // USER ID
      treatment_details: {
        doctor_id: localStorage.getItem("user_id"),
        diagnosis,
        medications: medications.filter(
          m => m.name && m.dosage && m.timing
        ),
        notes
      },
      start_date: startDate,
      end_date: endDate,
    };

    try {
      await axios.post(
        `${API_BASE}/treatment-plan/create/`,
        payload
      );

      setShowSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Treatment save error:", err);
      alert("Failed to save treatment plan");
    }
  };

  /* ================= FIX: LOADING GUARD ================= */
  if (loading || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading patient details...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border p-4 rounded-lg">
          <CheckCircle className="inline mr-2 text-green-600" />
          Treatment Plan Saved
        </div>
      )}

      <button onClick={() => navigate(-1)} className="mb-4 flex gap-2">
        <ArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Create Treatment Plan</h1>

      {/* PATIENT SUMMARY */}
      <div className="bg-white p-4 rounded border mb-6 grid grid-cols-4 gap-4">
        <Info label="Name" value={patient.patient_name} />
        <Info label="Age" value={patient.age} />
        <Info label="Gender" value={patient.gender} />
        <Info label="Patient ID" value={patient.patient_id} />
      </div>

      {/* DIAGNOSIS */}
      <Section title="Diagnosis">
        <input
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Diagnosis"
        />
      </Section>

      {/* MEDICATIONS */}
      <Section title="Medications">
        {medications.map((m, i) => (
          <div key={m.id} className="grid grid-cols-4 gap-3 mb-2">
            <input
              placeholder="Medicine"
              value={m.name}
              onChange={e => updateMedication(m.id, "name", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="Dosage"
              value={m.dosage}
              onChange={e => updateMedication(m.id, "dosage", e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={m.timing}
              onChange={e => updateMedication(m.id, "timing", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Timing</option>
              {timingOptions.map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {i > 0 && (
              <button onClick={() => removeMedication(m.id)}>
                <X className="text-red-500" />
              </button>
            )}
          </div>
        ))}

        <button onClick={addMedication} className="mt-2 text-blue-600">
          <Plus /> Add Medication
        </button>
      </Section>

      {/* DATES */}
      <Section title="Treatment Duration">
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </Section>

      {/* NOTES */}
      <Section title="Notes">
        <textarea
          rows="4"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </Section>

      <div className="flex justify-end gap-4 mt-6">
        <button onClick={() => navigate(-1)} className="border px-6 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Treatment Plan
        </button>
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */
const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded border mb-6">
    <h2 className="font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
