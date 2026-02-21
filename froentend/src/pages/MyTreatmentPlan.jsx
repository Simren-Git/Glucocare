import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  FileText,
  Heart,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Activity,
  CheckCircle,
} from "lucide-react";

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

    .tp-page {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      padding: 40px 48px 64px;
    }

    /* ── TOP BAR ── */
    .tp-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 36px;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-mid);
      cursor: pointer;
      transition: all 0.18s;
      text-decoration: none;
    }

    .back-btn:hover {
      background: var(--navy);
      color: #fff;
      border-color: var(--navy);
    }

    .tp-header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
    }

    /* ── PAGE HERO ── */
    .tp-hero {
      background: var(--navy);
      border-radius: 24px;
      padding: 36px 40px;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      position: relative;
      overflow: hidden;
    }

    .tp-hero::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 240px; height: 240px;
      border-radius: 50%;
      background: rgba(18,153,138,0.12);
    }

    .tp-hero::after {
      content: '';
      position: absolute;
      bottom: -80px; right: 80px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(201,168,76,0.08);
    }

    .tp-hero-left { position: relative; z-index: 1; }

    .tp-hero-eyebrow {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--gold);
      font-weight: 700;
      margin-bottom: 10px;
    }

    .tp-hero-title {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      font-weight: 400;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 16px;
    }

    .tp-hero-meta {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .hero-meta-item {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: rgba(255,255,255,0.6);
      font-weight: 500;
    }

    .hero-meta-item span { color: rgba(255,255,255,0.9); }

    .tp-hero-badge {
      position: relative;
      z-index: 1;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 20px 28px;
      text-align: center;
      flex-shrink: 0;
    }

    .hero-badge-value {
      font-family: 'DM Serif Display', serif;
      font-size: 36px;
      color: #fff;
      line-height: 1;
    }

    .hero-badge-label {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* ── CONTENT GRID ── */
    .tp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .tp-grid-full {
      margin-bottom: 20px;
    }

    /* ── SECTION CARD ── */
    .tp-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .tp-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.07);
      transform: translateY(-1px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .card-icon {
      width: 40px; height: 40px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-icon.teal   { background: var(--teal-soft);   color: var(--teal); }
    .card-icon.violet { background: var(--violet-soft);  color: var(--violet); }
    .card-icon.amber  { background: var(--amber-soft);   color: var(--amber); }
    .card-icon.green  { background: var(--green-soft);   color: var(--green); }
    .card-icon.rose   { background: var(--rose-soft);    color: var(--rose); }

    .card-title {
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      font-weight: 400;
      color: var(--ink);
    }

    .card-subtitle {
      font-size: 12px;
      color: var(--ink-light);
      margin-top: 1px;
    }

    /* ── DIAGNOSIS ── */
    .diagnosis-text {
      font-size: 15px;
      color: var(--ink-mid);
      line-height: 1.7;
    }

    /* ── MEDICATION ITEMS ── */
    .med-list { display: flex; flex-direction: column; gap: 12px; }

    .med-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: border-color 0.18s;
    }

    .med-item:hover { border-color: var(--teal); }

    .med-number {
      width: 28px; height: 28px;
      border-radius: 8px;
      background: var(--teal-soft);
      color: var(--teal);
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .med-info { flex: 1; }
    .med-name { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }

    .med-meta { display: flex; gap: 12px; }

    .med-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 20px;
    }

    .med-tag.dosage    { background: var(--violet-soft); color: var(--violet); }
    .med-tag.frequency { background: var(--amber-soft);  color: var(--amber); }

    .med-check {
      color: var(--green);
      flex-shrink: 0;
    }

    /* ── NOTES ── */
    .notes-box {
      background: var(--teal-soft);
      border: 1px solid rgba(18,153,138,0.2);
      border-radius: 12px;
      padding: 18px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }

    .notes-icon-wrap {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: var(--teal);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notes-text {
      font-size: 14px;
      color: var(--ink-mid);
      line-height: 1.7;
    }

    /* ── REMINDERS ── */
    .reminder-list { display: flex; flex-direction: column; gap: 10px; }

    .reminder-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 13px;
      color: var(--ink-mid);
      font-weight: 500;
    }

    .reminder-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--teal);
      flex-shrink: 0;
    }

    /* ── EMPTY / LOADING ── */
    .tp-loading {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: var(--paper);
    }

    .tp-spinner {
      width: 48px; height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--teal);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .tp-loading-text { font-size: 15px; color: var(--ink-light); font-weight: 500; font-family: 'DM Sans', sans-serif; }

    .tp-empty {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--paper);
      padding: 24px;
      font-family: 'DM Sans', sans-serif;
    }

    .empty-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 56px 48px;
      text-align: center;
      max-width: 400px;
    }

    .empty-icon-wrap {
      width: 64px; height: 64px;
      border-radius: 18px;
      background: var(--violet-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .empty-card h2 {
      font-family: 'DM Serif Display', serif;
      font-size: 22px;
      font-weight: 400;
      color: var(--ink);
      margin-bottom: 8px;
    }

    .empty-card p { font-size: 14px; color: var(--ink-light); line-height: 1.6; }

    .empty-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
      padding: 10px 22px;
      background: var(--navy);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s;
    }

    .empty-back-btn:hover { background: #253460; }

    @media (max-width: 768px) {
      .tp-page { padding: 24px 20px 48px; }
      .tp-grid { grid-template-columns: 1fr; }
      .tp-hero { flex-direction: column; align-items: flex-start; }
      .tp-hero-badge { align-self: flex-start; }
    }
  `}</style>
);

export default function MyTreatmentPlan() {
  const userId   = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://127.0.0.1:8000/api/treatment-plan/${userId}/`)
      .then(res => {
        setPlan(res.data.length === 0 ? null : res.data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Styles />
        <div className="tp-loading">
          <div className="tp-spinner" />
          <p className="tp-loading-text">Loading your treatment plan…</p>
        </div>
      </>
    );
  }

  /* ── Empty ── */
  if (!plan) {
    return (
      <>
        <Styles />
        <div className="tp-empty">
          <div className="empty-card">
            <div className="empty-icon-wrap">
              <Pill size={28} color="var(--violet)" />
            </div>
            <h2>No Treatment Plan Yet</h2>
            <p>Your doctor hasn't assigned a treatment plan yet. Check back after your next consultation.</p>
            <button className="empty-back-btn" onClick={() => navigate("/patient-dashboard")}>
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const { diagnosis, medications = [], notes } = plan.treatment_details;

  return (
    <>
      <Styles />
      <div className="tp-page">

        {/* Top bar */}
        <div className="tp-topbar">
          <button className="back-btn" onClick={() => navigate("/patient-dashboard")}>
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
          <div className="tp-header-right">
            <Activity size={13} color="var(--teal)" />
            Active Treatment Plan
          </div>
        </div>

        {/* Hero */}
        <div className="tp-hero">
          <div className="tp-hero-left">
            <p className="tp-hero-eyebrow">Treatment Plan</p>
            <h1 className="tp-hero-title">
              {diagnosis ? diagnosis : "Your Treatment Plan"}
            </h1>
            <div className="tp-hero-meta">
              <div className="hero-meta-item">
                <Calendar size={14} color="rgba(255,255,255,0.5)" />
                Start: <span>{formatDate(plan.start_date)}</span>
              </div>
              {plan.end_date && (
                <div className="hero-meta-item">
                  <Clock size={14} color="rgba(255,255,255,0.5)" />
                  End: <span>{formatDate(plan.end_date)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="tp-hero-badge">
            <div className="hero-badge-value">{medications.length}</div>
            <div className="hero-badge-label">Medication{medications.length !== 1 ? "s" : ""}</div>
          </div>
        </div>

        {/* Diagnosis + Reminders side by side */}
        {diagnosis && (
          <div className="tp-grid">
            <div className="tp-card">
              <div className="card-header">
                <div className="card-icon violet"><FileText size={18} /></div>
                <div>
                  <p className="card-title">Diagnosis</p>
                  <p className="card-subtitle">Your medical condition</p>
                </div>
              </div>
              <p className="diagnosis-text">{diagnosis}</p>
            </div>

            <div className="tp-card">
              <div className="card-header">
                <div className="card-icon green"><Heart size={18} /></div>
                <div>
                  <p className="card-title">Important Reminders</p>
                  <p className="card-subtitle">Follow these daily</p>
                </div>
              </div>
              <div className="reminder-list">
                {["Take medicines on time every day", "Do not skip doses without consulting your doctor", "Report any side effects to your doctor immediately"].map((r, i) => (
                  <div key={i} className="reminder-item">
                    <span className="reminder-dot" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medications — full width */}
        <div className="tp-grid-full">
          <div className="tp-card">
            <div className="card-header">
              <div className="card-icon teal"><Pill size={18} /></div>
              <div>
                <p className="card-title">Medications</p>
                <p className="card-subtitle">{medications.length} prescribed medication{medications.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {medications.length === 0 ? (
              <p style={{ fontSize: 14, color: "var(--ink-light)" }}>No medications have been prescribed yet.</p>
            ) : (
              <div className="med-list">
                {medications.map((m, i) => (
                  <div key={i} className="med-item">
                    <div className="med-number">{i + 1}</div>
                    <div className="med-info">
                      <p className="med-name">{m.name}</p>
                      <div className="med-meta">
                        {m.dosage    && <span className="med-tag dosage">💊 {m.dosage}</span>}
                        {m.frequency && <span className="med-tag frequency">🕐 {m.frequency}</span>}
                      </div>
                    </div>
                    <CheckCircle size={18} className="med-check" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doctor Notes */}
        {notes && (
          <div className="tp-grid-full">
            <div className="tp-card">
              <div className="card-header">
                <div className="card-icon amber"><AlertCircle size={18} /></div>
                <div>
                  <p className="card-title">Doctor's Notes</p>
                  <p className="card-subtitle">Additional instructions from your physician</p>
                </div>
              </div>
              <div className="notes-box">
                <div className="notes-icon-wrap">
                  <FileText size={16} color="#fff" />
                </div>
                <p className="notes-text">{notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* No diagnosis — still show reminders */}
        {!diagnosis && (
          <div className="tp-grid-full">
            <div className="tp-card">
              <div className="card-header">
                <div className="card-icon green"><Heart size={18} /></div>
                <div>
                  <p className="card-title">Important Reminders</p>
                  <p className="card-subtitle">Follow these daily</p>
                </div>
              </div>
              <div className="reminder-list">
                {["Take medicines on time every day", "Do not skip doses without consulting your doctor", "Report any side effects to your doctor immediately"].map((r, i) => (
                  <div key={i} className="reminder-item">
                    <span className="reminder-dot" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}