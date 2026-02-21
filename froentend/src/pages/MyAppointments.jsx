import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, ChevronRight, X, CheckCircle, RefreshCw, XCircle, User } from "lucide-react";

/* ─── Styles ─── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0e1117;
      --ink-mid:    #4a5568;
      --ink-light:  #718096;
      --paper:      #fafaf9;
      --surface:    #ffffff;
      --border:     #e8e4df;
      --teal-deep:  #0d7a6e;
      --teal:       #12998a;
      --teal-soft:  #e6f7f5;
      --amber:      #e07b39;
      --amber-soft: #fdf0e8;
      --violet:     #5e4db2;
      --violet-soft:#f0eeff;
      --rose:       #c2395a;
      --rose-soft:  #fce8ee;
      --navy:       #1a2744;
      --gold:       #c9a84c;
      --green:      #16a34a;
      --green-soft: #dcfce7;
    }

    .appt-page {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      padding: 44px 48px;
    }

    /* ── PAGE HEADER ── */
    .page-header {
      margin-bottom: 36px;
    }

    .page-header h1 {
      font-family: 'DM Serif Display', serif;
      font-size: 32px;
      font-weight: 400;
      color: var(--ink);
      line-height: 1;
      margin-bottom: 6px;
    }

    .page-header p {
      font-size: 14px;
      color: var(--ink-light);
    }

    /* ── TABS ── */
    .tabs-row {
      display: flex;
      gap: 6px;
      margin-bottom: 28px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 5px;
      width: fit-content;
    }

    .tab-btn {
      padding: 8px 24px;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-light);
      cursor: pointer;
      transition: all 0.18s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-btn.active {
      background: var(--navy);
      color: #fff;
      box-shadow: 0 2px 8px rgba(26,39,68,0.2);
    }

    .tab-btn:not(.active):hover {
      background: var(--paper);
      color: var(--ink);
    }

    .tab-count {
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 1px 7px;
      font-size: 11px;
      font-weight: 700;
    }

    .tab-btn:not(.active) .tab-count {
      background: var(--border);
      color: var(--ink-mid);
    }

    /* ── EMPTY STATE ── */
    .empty-state {
      text-align: center;
      padding: 64px 32px;
      color: var(--ink-light);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
    }

    .empty-icon {
      width: 56px; height: 56px;
      border-radius: 16px;
      background: var(--paper);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .empty-state h3 {
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      font-weight: 400;
      color: var(--ink);
      margin-bottom: 6px;
    }

    .empty-state p { font-size: 13px; }

    /* ── APPOINTMENT LIST ── */
    .appt-list { display: flex; flex-direction: column; gap: 14px; }

    /* ── APPOINTMENT CARD ── */
    .appt-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px 28px;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .appt-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.07);
      transform: translateY(-1px);
    }

    .appt-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }

    .appt-card-left { display: flex; align-items: center; gap: 16px; }

    .doctor-avatar {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--teal), var(--teal-deep));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #fff;
    }

    .doctor-info h3 {
      font-family: 'DM Serif Display', serif;
      font-size: 19px;
      font-weight: 400;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 6px;
    }

    .appt-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
    }

    /* ── STATUS PILL ── */
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .pill-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
    }

    .status-CONFIRMED          { background: #dbeafe; color: #1e40af; }
    .status-CONFIRMED .pill-dot           { background: #1e40af; }
    .status-PATIENT_CONFIRMED  { background: var(--green-soft); color: var(--green); }
    .status-PATIENT_CONFIRMED .pill-dot   { background: var(--green); }
    .status-RESCHEDULE_REQUESTED { background: var(--amber-soft); color: #b45309; }
    .status-RESCHEDULE_REQUESTED .pill-dot { background: #b45309; }
    .status-COMPLETED          { background: #d1fae5; color: #065f46; }
    .status-COMPLETED .pill-dot           { background: #065f46; }
    .status-CANCELLED          { background: var(--rose-soft); color: var(--rose); }
    .status-CANCELLED .pill-dot           { background: var(--rose); }

    /* ── DIVIDER ── */
    .appt-divider {
      height: 1px;
      background: var(--border);
      margin-bottom: 18px;
    }

    /* ── ACTION BUTTONS ── */
    .action-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 18px;
      border-radius: 10px;
      border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
      letter-spacing: 0.2px;
    }

    .btn-confirm {
      background: var(--green-soft);
      color: var(--green);
      border: 1px solid rgba(22,163,74,0.2);
    }
    .btn-confirm:hover { background: #bbf7d0; border-color: rgba(22,163,74,0.4); }

    .btn-reschedule {
      background: var(--amber-soft);
      color: var(--amber);
      border: 1px solid rgba(224,123,57,0.2);
    }
    .btn-reschedule:hover { background: #fde8d0; border-color: rgba(224,123,57,0.4); }

    .btn-cancel {
      background: var(--rose-soft);
      color: var(--rose);
      border: 1px solid rgba(194,57,90,0.2);
    }
    .btn-cancel:hover { background: #f8d0d9; border-color: rgba(194,57,90,0.4); }

    /* ── MODAL OVERLAY ── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(14,17,23,0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 24px;
    }

    .modal-box {
      background: var(--surface);
      border-radius: 24px;
      padding: 32px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.18);
      border: 1px solid var(--border);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .modal-title {
      font-family: 'DM Serif Display', serif;
      font-size: 22px;
      font-weight: 400;
      color: var(--ink);
      line-height: 1.2;
    }

    .modal-subtitle {
      font-size: 13px;
      color: var(--ink-light);
      margin-top: 4px;
    }

    .modal-close {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--ink-light);
      transition: all 0.18s;
      flex-shrink: 0;
    }

    .modal-close:hover { background: var(--rose-soft); border-color: rgba(194,57,90,0.3); color: var(--rose); }

    .modal-field { margin-bottom: 16px; }

    .field-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--ink-mid);
      margin-bottom: 8px;
    }

    .field-input {
      width: 100%;
      padding: 11px 14px;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--ink);
      background: var(--paper);
      transition: border-color 0.18s, box-shadow 0.18s;
      outline: none;
    }

    .field-input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 3px rgba(18,153,138,0.1);
    }

    .modal-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }

    .btn-primary {
      width: 100%;
      padding: 12px;
      background: var(--navy);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary:hover { background: #253460; }

    .btn-ghost {
      width: 100%;
      padding: 10px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink-light);
      cursor: pointer;
      transition: all 0.18s;
    }

    .btn-ghost:hover { background: var(--paper); color: var(--ink); }

    /* ── STATUS LABEL MAPS ── */
    .status-label-CONFIRMED           { }
    .status-label-PATIENT_CONFIRMED   { }
    .status-label-RESCHEDULE_REQUESTED { }
    .status-label-COMPLETED           { }
    .status-label-CANCELLED           { }
  `}</style>
);

const STATUS_LABELS = {
  CONFIRMED: "Confirmed",
  PATIENT_CONFIRMED: "Attendance Confirmed",
  RESCHEDULE_REQUESTED: "Reschedule Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function MyAppointments() {
  const userId = localStorage.getItem("user_id");

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/patient/appointments/${userId}/`
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmAttendance = async (id) => {
    await axios.post("http://127.0.0.1:8000/api/appointment/confirm-attendance/", { appointment_id: id });
    fetchAppointments();
  };

  const cancelAppointment = async (id) => {
    await axios.post("http://127.0.0.1:8000/api/appointment/cancel/", { appointment_id: id });
    fetchAppointments();
  };

  const submitReschedule = async () => {
    await axios.post("http://127.0.0.1:8000/api/appointment/request-reschedule/", {
      appointment_id: rescheduleId,
      requested_date: newDate,
      requested_time: newTime,
    });
    setRescheduleId(null);
    setNewDate("");
    setNewTime("");
    fetchAppointments();
  };

  const upcoming = appointments.filter(a =>
    ["CONFIRMED", "PATIENT_CONFIRMED", "RESCHEDULE_REQUESTED"].includes(a.status)
  );

  const history = appointments.filter(a =>
    ["COMPLETED", "CANCELLED"].includes(a.status)
  );

  const displayed = activeTab === "upcoming" ? upcoming : history;

  /* Format date nicely */
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric"
      });
    } catch { return d; }
  };

  /* Format time nicely */
  const fmtTime = (t) => {
    if (!t) return "—";
    try {
      const [h, m] = t.split(":");
      const date = new Date();
      date.setHours(+h, +m);
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch { return t; }
  };

  return (
    <>
      <Styles />
      <div className="appt-page">

        {/* Header */}
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Manage your scheduled visits and medical consultations</p>
        </div>

        {/* Tabs */}
        <div className="tabs-row">
          <button
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
            <span className="tab-count">{upcoming.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
            <span className="tab-count">{history.length}</span>
          </button>
        </div>

        {/* List */}
        {displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Calendar size={22} color="var(--ink-light)" />
            </div>
            <h3>No {activeTab === "upcoming" ? "upcoming" : "past"} appointments</h3>
            <p>
              {activeTab === "upcoming"
                ? "You have no scheduled appointments at the moment."
                : "Your appointment history will appear here."}
            </p>
          </div>
        ) : (
          <div className="appt-list">
            {displayed.map((a) => (
              <div key={a.appointment_id} className="appt-card">

                {/* Card Top */}
                <div className="appt-card-top">
                  <div className="appt-card-left">
                    <div className="doctor-avatar">
                      <User size={22} />
                    </div>
                    <div className="doctor-info">
                      <h3>Dr. {a.doctor_name}</h3>
                      <div className="appt-meta">
                        <span className="meta-item">
                          <Calendar size={12} />
                          {fmtDate(a.date)}
                        </span>
                        <span className="meta-item">
                          <Clock size={12} />
                          {fmtTime(a.time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`status-pill status-${a.status}`}>
                    <span className="pill-dot" />
                    {STATUS_LABELS[a.status] || a.status}
                  </span>
                </div>

                {/* Actions */}
                {activeTab === "upcoming" && (
                  <>
                    <div className="appt-divider" />
                    <div className="action-row">
                      {a.status === "CONFIRMED" && (
                        <button
                          className="btn btn-confirm"
                          onClick={() => confirmAttendance(a.appointment_id)}
                        >
                          <CheckCircle size={14} />
                          Confirm Attendance
                        </button>
                      )}
                      {a.status === "CONFIRMED" && (
                        <button
                          className="btn btn-reschedule"
                          onClick={() => setRescheduleId(a.appointment_id)}
                        >
                          <RefreshCw size={14} />
                          Request Reschedule
                        </button>
                      )}
                      {!["COMPLETED", "CANCELLED"].includes(a.status) && (
                        <button
                          className="btn btn-cancel"
                          onClick={() => cancelAppointment(a.appointment_id)}
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleId && (
          <div className="modal-overlay" onClick={() => setRescheduleId(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>

              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Request Reschedule</h3>
                  <p className="modal-subtitle">Choose a new preferred date and time</p>
                </div>
                <button className="modal-close" onClick={() => setRescheduleId(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="modal-field">
                <label className="field-label">Preferred Date</label>
                <input
                  type="date"
                  className="field-input"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="field-label">Preferred Time</label>
                <input
                  type="time"
                  className="field-input"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button className="btn-primary" onClick={submitReschedule}>
                  <ChevronRight size={16} />
                  Submit Request
                </button>
                <button className="btn-ghost" onClick={() => setRescheduleId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}