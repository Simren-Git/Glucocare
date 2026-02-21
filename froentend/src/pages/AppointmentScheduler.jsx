import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  FileText,
  User,
  Stethoscope,
  CheckCircle
} from "lucide-react";

export default function AppointmentScheduler() {
  const { patientUserId } = useParams();
  const navigate = useNavigate();

  const doctorUserId = localStorage.getItem("user_id");

  /* ===================== STATE ===================== */
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notesForPatient, setNotesForPatient] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /* ===================== FETCH PATIENT ===================== */
  useEffect(() => {
    if (!patientUserId) return;

    axios
      .get(`http://127.0.0.1:8000/api/patient/${patientUserId}/`)
      .then(res => {
        setPatientName(res.data.patient_name);
        setDoctorName(res.data.doctor_name);
        setLoading(false);
      })
      .catch(err => {
        console.error("Patient fetch error:", err);
        setLoading(false);
      });
  }, [patientUserId]);

  /* ===================== TIME SLOTS ===================== */
  const timeSlots = [
    "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","02:00 PM","02:30 PM","03:00 PM",
    "03:30 PM","04:00 PM","04:30 PM","05:00 PM"
  ];

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  /* ===================== VALIDATION ===================== */
  const validate = () => {
    const e = {};
    if (!appointmentDate) e.date = "Date is required";
    if (!appointmentTime) e.time = "Time is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===================== SUBMIT ===================== */
  const handleSchedule = async () => {
    if (!validate()) return;

    if (!doctorUserId) {
      alert("Doctor not authenticated");
      return;
    }

    setSubmitting(true);

    const payload = {
      doctor_user_id: doctorUserId,
      patient_user_id: patientUserId,
      appointment_date: appointmentDate,
      appointment_time: convertTo24Hour(appointmentTime),
      notes_for_patient: notesForPatient
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/appointment/create/",
        payload
      );

      setShowSuccess(true);

      setTimeout(() => {
        navigate(-1);
      }, 2000);

    } catch (err) {
      console.error("API ERROR:", err.response || err);
      alert(
        err.response?.data?.error ||
        "Failed to schedule appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================== UI ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-white border-l-4 border-green-500 shadow-lg p-4 rounded flex gap-3 z-50">
          <CheckCircle className="text-green-600" />
          <div>
            <p className="font-semibold">Appointment Scheduled</p>
            <p className="text-sm text-gray-500">
              Email sent to patient successfully
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            Schedule Appointment
          </h1>
          <p className="text-gray-600">
            Create a new appointment for the patient
          </p>
        </div>

        {/* PATIENT / DOCTOR */}
        <div className="bg-white rounded-xl shadow border p-6 mb-6 grid md:grid-cols-2 gap-6">
          <Info icon={<User />} label="Patient Name" value={patientName} />
          <Info icon={<Stethoscope />} label="Doctor Name" value={doctorName} />
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow border p-6 space-y-6">
          <Field icon={<Calendar />} label="Appointment Date *" error={errors.date}>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
              className="input"
            />
          </Field>

          <Field icon={<Clock />} label="Appointment Time *" error={errors.time}>
            <select
              value={appointmentTime}
              onChange={e => setAppointmentTime(e.target.value)}
              className="input"
            >
              <option value="">Select time</option>
              {timeSlots.map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field icon={<FileText />} label="Notes for Patient">
            <textarea
              rows="4"
              value={notesForPatient}
              onChange={e => setNotesForPatient(e.target.value)}
              className="input"
              placeholder="Instructions like fasting, bring reports..."
            />
          </Field>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border rounded-lg"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            onClick={handleSchedule}
            disabled={submitting}
            className={`px-8 py-3 text-white rounded-lg ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Scheduling..." : "Schedule Appointment"}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
        }
      `}</style>
    </div>
  );
}

/* ===================== HELPERS ===================== */

const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const Field = ({ icon, label, error, children }) => (
  <div>
    <label className="flex items-center gap-2 font-semibold mb-2">
      {icon} {label}
    </label>
    {children}
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);
