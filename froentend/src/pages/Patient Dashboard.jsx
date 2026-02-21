import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Activity,
  Calendar,
  Apple,
  Pill,
  Plus,
  Droplet,
  LogOut,
  Stethoscope,
  LineChart,
  ClipboardList,
  Bell,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Shield,
} from "lucide-react";

/* ─── Inject Google Fonts ─── */
const FontLoader = () => (
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
    }

    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }

    /* ── SIDEBAR ─────────────────────────────────────────────── */
    .sidebar {
      width: 264px;
      min-height: 100vh;
      background: var(--navy);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0;
      z-index: 100;
      border-right: 1px solid rgba(201,168,76,0.15);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 32px 24px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }

    .logo-mark {
      width: 42px; height: 42px;
      background: linear-gradient(135deg, var(--teal) 0%, var(--teal-deep) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(18,153,138,0.4);
    }

    .logo-text h1 {
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      font-weight: 400;
      color: #fff;
      letter-spacing: -0.3px;
      line-height: 1.1;
    }

    .logo-text span {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--gold);
      font-weight: 600;
    }

    /* Patient card */
    .patient-card {
      margin: 20px 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 16px;
    }

    .patient-avatar {
      width: 46px; height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--teal), var(--teal-deep));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      color: #fff;
      flex-shrink: 0;
    }

    .patient-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .patient-name {
      font-weight: 600;
      font-size: 15px;
      color: #fff;
      line-height: 1.2;
    }

    .patient-id {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 0.5px;
    }

    .patient-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .meta-chip {
      background: rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 8px 10px;
    }

    .meta-chip label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255,255,255,0.35);
      display: block;
      margin-bottom: 2px;
    }

    .meta-chip span {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }

    /* Nav */
    .sidebar-nav {
      padding: 8px 12px;
      flex: 1;
    }

    .nav-section-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255,255,255,0.25);
      padding: 12px 12px 6px;
      font-weight: 600;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.18s ease;
      margin-bottom: 2px;
    }

    .nav-item:hover { background: rgba(255,255,255,0.06); }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(18,153,138,0.25), rgba(13,122,110,0.15));
      border: 1px solid rgba(18,153,138,0.3);
    }

    .nav-item-inner {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-icon-wrap {
      width: 32px; height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.06);
      flex-shrink: 0;
    }

    .nav-item.active .nav-icon-wrap {
      background: var(--teal);
      box-shadow: 0 2px 8px rgba(18,153,138,0.5);
    }

    .nav-label {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,0.55);
      transition: color 0.18s;
    }

    .nav-item.active .nav-label,
    .nav-item:hover .nav-label { color: #fff; }

    .nav-badge {
      background: var(--rose);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 20px;
    }

    /* Logout */
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px;
      background: rgba(194,57,90,0.12);
      border: 1px solid rgba(194,57,90,0.25);
      color: #e8788e;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
      letter-spacing: 0.3px;
    }

    .logout-btn:hover {
      background: rgba(194,57,90,0.2);
      border-color: rgba(194,57,90,0.45);
      color: #f0a0ae;
    }

    /* ── MAIN LAYOUT ─────────────────────────────────────────── */
    .main-wrapper {
      margin-left: 264px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── TOPBAR ──────────────────────────────────────────────── */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(250,250,249,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0 40px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .topbar-left h2 {
      font-family: 'DM Serif Display', serif;
      font-size: 22px;
      font-weight: 400;
      color: var(--ink);
      line-height: 1;
    }

    .topbar-left p {
      font-size: 13px;
      color: var(--ink-light);
      margin-top: 3px;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notif-btn {
      width: 40px; height: 40px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.18s;
      position: relative;
    }

    .notif-btn:hover { background: var(--teal-soft); border-color: var(--teal); }

    .notif-dot {
      position: absolute;
      top: 8px; right: 8px;
      width: 8px; height: 8px;
      background: var(--rose);
      border-radius: 50%;
      border: 2px solid var(--paper);
    }

    .date-chip {
      font-size: 12px;
      color: var(--ink-light);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 14px;
      font-weight: 500;
    }

    .topbar-logout-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      background: var(--rose-soft);
      border: 1px solid rgba(194,57,90,0.2);
      border-radius: 10px;
      color: var(--rose);
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
      letter-spacing: 0.2px;
    }

    .topbar-logout-btn:hover {
      background: #f8d0d9;
      border-color: rgba(194,57,90,0.4);
    }

    /* ── CONTENT ─────────────────────────────────────────────── */
    .content {
      flex: 1;
      padding: 36px 40px;
    }

    .content-grid {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ── STAT CARDS ──────────────────────────────────────────── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(0,0,0,0.09);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; right: 0;
      width: 140px; height: 140px;
      border-radius: 50%;
      opacity: 0.06;
      pointer-events: none;
      transform: translate(40px, -40px);
    }

    .stat-card.glucose::before { background: var(--teal); }
    .stat-card.hba1c::before  { background: var(--violet); }
    .stat-card.appt::before   { background: var(--amber); }

    .stat-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .stat-icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.teal   { background: var(--teal-soft);   color: var(--teal); }
    .stat-icon.violet { background: var(--violet-soft);  color: var(--violet); }
    .stat-icon.amber  { background: var(--amber-soft);   color: var(--amber); }

    .status-pill {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .pill-green  { background: #dcfce7; color: #166534; }
    .pill-orange { background: #ffedd5; color: #9a3412; }
    .pill-red    { background: #fee2e2; color: #991b1b; }
    .pill-gray   { background: #f1f5f9; color: #475569; }
    .pill-muted  { background: var(--violet-soft); color: var(--violet); }
    .pill-amber  { background: var(--amber-soft); color: var(--amber); }

    .stat-value {
      font-family: 'DM Serif Display', serif;
      font-size: 52px;
      font-weight: 400;
      line-height: 1;
      color: var(--ink);
      margin-bottom: 6px;
    }

    .stat-label {
      font-size: 13px;
      color: var(--ink-light);
      font-weight: 500;
    }

    .stat-unit {
      font-size: 12px;
      color: #adb5c2;
      margin-top: 4px;
    }

    .stat-action {
      margin-top: 18px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 600;
      color: var(--amber);
      background: var(--amber-soft);
      border: none;
      border-radius: 8px;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.18s;
      font-family: 'DM Sans', sans-serif;
    }

    .stat-action:hover { background: #fae0ce; }

    /* Divider rule */
    .stat-divider {
      height: 1px;
      background: var(--border);
      margin: 0 0 28px;
    }

    /* ── QUICK ACTIONS ───────────────────────────────────────── */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }

    .section-title {
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      font-weight: 400;
      color: var(--ink);
    }

    .section-subtitle {
      font-size: 12px;
      color: var(--ink-light);
      margin-top: 2px;
    }

    .actions-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: var(--paper);
      cursor: pointer;
      transition: all 0.18s;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .action-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.18s;
    }

    .action-btn.teal::after   { background: var(--teal-soft); }
    .action-btn.orange::after { background: var(--amber-soft); }
    .action-btn.indigo::after { background: var(--violet-soft); }
    .action-btn.pink::after   { background: var(--rose-soft); }

    .action-btn:hover { border-color: transparent; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    .action-btn:hover::after { opacity: 1; }

    .action-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .action-icon.teal   { background: var(--teal-soft);   color: var(--teal); }
    .action-icon.orange { background: var(--amber-soft);   color: var(--amber); }
    .action-icon.indigo { background: var(--violet-soft);  color: var(--violet); }
    .action-icon.pink   { background: var(--rose-soft);    color: var(--rose); }

    .action-text { position: relative; z-index: 1; }
    .action-text strong { display: block; font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.2; margin-bottom: 2px; }
    .action-text span   { font-size: 11px; color: var(--ink-light); }

    .action-arrow { margin-left: auto; color: #c5ccd6; position: relative; z-index: 1; transition: color 0.18s, transform 0.18s; }
    .action-btn:hover .action-arrow { color: var(--ink); transform: translateX(2px); }

    /* ── TIPS ────────────────────────────────────────────────── */
    .tips-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
    }

    .tips-list { display: flex; flex-direction: column; gap: 12px; }

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 16px;
      background: var(--paper);
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .tip-emoji {
      font-size: 22px;
      flex-shrink: 0;
      line-height: 1;
    }

    .tip-title  { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
    .tip-body   { font-size: 12px; color: var(--ink-light); line-height: 1.5; }

    /* ── LOADING ─────────────────────────────────────────────── */
    .loading-screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--paper);
      gap: 16px;
    }

    .loading-spinner {
      width: 48px; height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--teal);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .loading-text { font-size: 15px; color: var(--ink-light); font-weight: 500; }

    /* ── RESPONSIVE ──────────────────────────────────────────── */
    @media (max-width: 1100px) {
      .stats-row { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-wrapper { margin-left: 0; }
      .stats-row { grid-template-columns: 1fr; }
      .actions-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);

function PatientDashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [patient, setPatient] = useState(null);
  const [latestBG, setLatestBG] = useState(null);
  const [avgGlucose, setAvgGlucose] = useState(null);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://127.0.0.1:8000/api/patient/${userId}/`)
      .then(res => setPatient(res.data));

    axios.get(`http://127.0.0.1:8000/api/blood-sugar-history/${userId}/`)
      .then(res => {
        if (res.data.length > 0) {
          setLatestBG(res.data[0]);
          const sum = res.data.reduce((t, r) => t + r.sugar_level, 0);
          setAvgGlucose(Math.round(sum / res.data.length));
        }
      });

    axios.get(`http://127.0.0.1:8000/api/patient/appointments/${userId}/`)
      .then(res => {
        setUpcomingCount(res.data.filter(a => a.status === "SCHEDULED").length);
      });
  }, [userId]);

  if (!patient) {
    return (
      <>
        <FontLoader />
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p className="loading-text">Loading your health portal…</p>
        </div>
      </>
    );
  }

  const estimatedHbA1c = avgGlucose
    ? ((avgGlucose + 46.7) / 28.7).toFixed(1)
    : "--";

  const getGlucoseStatus = () => {
    if (!latestBG)                    return { text: "No Data",  pill: "pill-gray" };
    if (latestBG.sugar_level < 70)   return { text: "Low",      pill: "pill-red" };
    if (latestBG.sugar_level > 180)  return { text: "Elevated", pill: "pill-orange" };
    return { text: "Normal", pill: "pill-green" };
  };

  const glucoseStatus = getGlucoseStatus();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/patient-login", { replace: true });
  };

  const handleNav = (section, route) => {
    setActiveSection(section);
    if (route) navigate(route);
  };

  const menuItems = [
    { id: "overview",      label: "Overview",         icon: Activity,      route: "/patient-dashboard" },
    { id: "treatment",     label: "Treatment Plan",   icon: Pill,          route: "/my-treatment-plan" },
    { id: "diet",          label: "Diet Plan",        icon: Apple,         route: "/my-diet-plan" },
    { id: "appointments",  label: "Appointments",     icon: Calendar,      route: "/my-appointments", badge: upcomingCount },
    { id: "advice",        label: "Medical Advice",   icon: Stethoscope,   route: "/medical-advice" },
    { id: "readings",      label: "Glucose Readings", icon: ClipboardList, route: `/blood-sugar-history/${userId}` },
    { id: "graph",         label: "Glucose Graph",    icon: LineChart,     route: "/glucose-graph" },
  ];

  return (
    <>
      <FontLoader />

      <div style={{ display: "flex" }}>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <Heart size={20} color="#fff" />
            </div>
            <div className="logo-text">
              <h1>DiabeteCare</h1>
              <span>Patient Portal</span>
            </div>
          </div>

          {/* Patient card */}
          <div className="patient-card">
            <div className="patient-card-header">
              <div className="patient-avatar">{patient.patient_name?.charAt(0)}</div>
              <div>
                <p className="patient-name">{patient.patient_name}</p>
                <p className="patient-id">ID · {patient.patient_id}</p>
              </div>
            </div>
            <div className="patient-meta">
              <div className="meta-chip">
                <label>Age</label>
                <span>{patient.age} yrs</span>
              </div>
              <div className="meta-chip">
                <label>Gender</label>
                <span>{patient.gender}</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <p className="nav-section-label">Navigation</p>
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => handleNav(item.id, item.route)}
              >
                <div className="nav-item-inner">
                  <div className="nav-icon-wrap">
                    <item.icon size={15} color={activeSection === item.id ? "#fff" : "rgba(255,255,255,0.5)"} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ───────────────────────────────────────────── */}
        <div className="main-wrapper">

          {/* Topbar */}
          <nav className="topbar">
            <div className="topbar-left">
              <h2>Dashboard Overview</h2>
              <p>Welcome back, {patient.patient_name?.split(" ")[0]}</p>
            </div>
            <div className="topbar-right">
              <span className="date-chip">{today}</span>
              <button className="notif-btn">
                <Bell size={17} color="var(--ink-mid)" />
                <span className="notif-dot" />
              </button>
              <button className="topbar-logout-btn" onClick={handleLogout}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </nav>

          {/* Content */}
          <main className="content">
            <div className="content-grid">

              {/* ─ Stats Row ─ */}
              <div className="stats-row">

                {/* Latest Glucose */}
                <div className="stat-card glucose">
                  <div className="stat-header">
                    <div className="stat-icon teal"><Droplet size={20} /></div>
                    <span className={`status-pill ${glucoseStatus.pill}`}>{glucoseStatus.text}</span>
                  </div>
                  <div className="stat-value">{latestBG ? latestBG.sugar_level : "--"}</div>
                  <div className="stat-label">Latest Glucose Reading</div>
                  <div className="stat-unit">mg / dL</div>
                </div>

                {/* HbA1c */}
                <div className="stat-card hba1c">
                  <div className="stat-header">
                    <div className="stat-icon violet"><Activity size={20} /></div>
                    <span className="status-pill pill-muted">Estimated</span>
                  </div>
                  <div className="stat-value">{estimatedHbA1c}</div>
                  <div className="stat-label">HbA1c Level</div>
                  <div className="stat-unit">Percentage (%)</div>
                </div>

                {/* Appointments */}
                <div className="stat-card appt">
                  <div className="stat-header">
                    <div className="stat-icon amber"><Calendar size={20} /></div>
                    {upcomingCount > 0 && (
                      <span className="status-pill pill-amber">{upcomingCount} Upcoming</span>
                    )}
                  </div>
                  <div className="stat-value">{upcomingCount || "0"}</div>
                  <div className="stat-label">Scheduled Appointments</div>
                  <button className="stat-action" onClick={() => navigate("/my-appointments")}>
                    View All <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* ─ Quick Actions (full width) ─ */}
              <div className="actions-panel">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Quick Actions</h3>
                    <p className="section-subtitle">Common tasks at a glance</p>
                  </div>
                </div>
                <div className="actions-grid">
                  {[
                    { label: "Add Glucose Reading", sub: "Log your blood sugar", icon: Plus,      color: "teal",   route: "/bg-logging" },
                    { label: "View Diet Plan",       sub: "Check meal schedule",  icon: Apple,     color: "orange", route: "/my-diet-plan" },
                    { label: "Treatment Plan",       sub: "Medications & dosage", icon: Pill,      color: "indigo", route: "/my-treatment-plan" },
                    { label: "Glucose Graph",        sub: "Visualize trends",     icon: LineChart, color: "pink",   route: "/glucose-graph" },
                  ].map((a, i) => (
                    <button key={i} className={`action-btn ${a.color}`} onClick={() => navigate(a.route)}>
                      <div className={`action-icon ${a.color}`}><a.icon size={17} /></div>
                      <div className="action-text">
                        <strong>{a.label}</strong>
                        <span>{a.sub}</span>
                      </div>
                      <ChevronRight size={15} className="action-arrow" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ Health Tips ─ */}
              <div className="tips-panel">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Daily Health Tips</h3>
                    <p className="section-subtitle">Personalised guidance for better diabetes management</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Shield size={14} color="var(--teal)" />
                    <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>Clinically Reviewed</span>
                  </div>
                </div>
                <div className="tips-list">
                  {[
                    { emoji: "🍎", title: "Balanced Diet",      body: "Follow your prescribed meal plan consistently. Complex carbohydrates and fibre help stabilise blood glucose levels throughout the day." },
                    { emoji: "💧", title: "Stay Hydrated",       body: "Aim for 8–10 glasses of water daily. Proper hydration supports kidney function and helps your body process glucose more efficiently." },
                    { emoji: "🏃", title: "Daily Movement",      body: "Just 30 minutes of moderate activity improves insulin sensitivity. Even a brisk walk after meals can reduce post-meal glucose spikes." },
                  ].map((tip, i) => (
                    <div key={i} className="tip-item">
                      <span className="tip-emoji">{tip.emoji}</span>
                      <div>
                        <p className="tip-title">{tip.title}</p>
                        <p className="tip-body">{tip.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;