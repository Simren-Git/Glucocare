import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart, Users, Activity, Calendar, FileText,
  Bell, TrendingUp, Pill, Plus, LogOut,
  Menu, X, ChevronRight, MessageSquare, ArrowUpRight
} from "lucide-react";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:      #f7f9f9;
      --cream2:     #eff2f2;
      --cream3:     #e6eaea;
      --warm-white: #ffffff;
      --stone-100:  #d9e0e0;
      --stone-300:  #adb9b9;
      --stone-500:  #738080;
      --stone-700:  #475252;
      --stone-900:  #232929;
      --accent:     #5a9b9b;
      --accent-lt:  #ebf3f3;
      --accent-md:  #8dbcbc;
      --accent-dk:  #447878;
      --success:    #5a8f6e;
      --success-lt: #e4f1eb;
      --warn:       #b08a2e;
      --warn-lt:    #fdf3d8;
      --danger:     #b54a3c;
      --danger-lt:  #fceae8;
      --shadow-sm:  0 1px 3px rgba(35,41,41,0.06);
      --shadow:     0 4px 18px rgba(35,41,41,0.07), 0 1px 4px rgba(35,41,41,0.04);
      --shadow-lg:  0 12px 40px rgba(35,41,41,0.10), 0 4px 12px rgba(35,41,41,0.05);
      --radius:     20px;
      --radius-sm:  12px;
      --radius-xs:  8px;
      --font-head:  'Playfair Display', Georgia, serif;
      --font-body:  'Nunito', sans-serif;
    }

    html, body { background: var(--cream); font-family: var(--font-body); color: var(--stone-900); }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--cream2); }
    ::-webkit-scrollbar-thumb { background: var(--stone-300); border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    @keyframes floatDot {
      0%, 100% { transform: translateY(0); opacity: 1; }
      50%       { transform: translateY(-2px); opacity: 0.7; }
    }

    .fade-up  { animation: fadeUp 0.45s ease both; }
    .delay-1  { animation-delay: 0.06s; }
    .delay-2  { animation-delay: 0.13s; }
    .delay-3  { animation-delay: 0.20s; }
    .delay-4  { animation-delay: 0.28s; }
  `}</style>
);

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
const Sk = ({ w = "100%", h = "14px", r = "8px" }) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    background: "linear-gradient(90deg, var(--cream2) 25%, var(--cream3) 50%, var(--cream2) 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.5s infinite linear"
  }} />
);

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, filled = false, delay, sub }) => (
  <div
    className={`fade-up ${delay}`}
    style={{
      background: filled ? "var(--accent)" : "var(--warm-white)",
      borderRadius: "var(--radius)",
      padding: "28px 28px 26px",
      boxShadow: filled ? "0 8px 28px rgba(90,155,155,0.24)" : "var(--shadow)",
      border: filled ? "none" : "1px solid var(--stone-100)",
      position: "relative", overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = filled ? "0 14px 40px rgba(90,155,155,0.32)" : "var(--shadow-lg)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = filled ? "0 8px 28px rgba(90,155,155,0.24)" : "var(--shadow)";
    }}
  >
    {/* Decorative circle */}
    <div style={{
      position: "absolute", bottom: -28, right: -28,
      width: 100, height: 100, borderRadius: "50%",
      background: filled ? "rgba(255,255,255,0.12)" : "var(--accent-lt)",
      pointerEvents: "none"
    }} />
    <div style={{
      position: "absolute", bottom: 16, right: 16,
      width: 52, height: 52, borderRadius: "50%",
      background: filled ? "rgba(255,255,255,0.08)" : "var(--cream2)",
      pointerEvents: "none"
    }} />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div style={{
        width: 44, height: 44, borderRadius: "var(--radius-sm)",
        background: filled ? "rgba(255,255,255,0.22)" : "var(--accent-lt)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: filled ? "#fff" : "var(--accent)"
      }}>
        <Icon size={20} />
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
        color: filled ? "rgba(255,255,255,0.75)" : "var(--stone-500)",
        padding: "4px 10px", borderRadius: 99,
        background: filled ? "rgba(255,255,255,0.16)" : "var(--cream2)"
      }}>
        Live
      </span>
    </div>

    <div style={{
      fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 700, lineHeight: 1,
      color: filled ? "#fff" : "var(--stone-900)"
    }}>
      {value}
    </div>
    <div style={{ marginTop: 9, fontSize: 14, fontWeight: 600, color: filled ? "rgba(255,255,255,0.9)" : "var(--stone-700)" }}>
      {label}
    </div>
    {sub && <div style={{ marginTop: 3, fontSize: 11, color: filled ? "rgba(255,255,255,0.55)" : "var(--stone-400)" }}>{sub}</div>}
  </div>
);

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    normal:      { bg: "var(--success-lt)", text: "var(--success)" },
    prediabetes: { bg: "var(--warn-lt)",    text: "var(--warn)" },
    high:        { bg: "var(--danger-lt)",  text: "var(--danger)" },
  };
  const c = map[status] || { bg: "var(--cream2)", text: "var(--stone-500)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 99,
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "capitalize"
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.text, flexShrink: 0 }} />
      {status}
    </span>
  );
};

/* ─────────────────────────────────────────
   AVATAR PALETTE
───────────────────────────────────────── */
const avatarPalette = (name) => {
  const p = [
    { bg: "#ebf3f3", text: "#5a9b9b" },
    { bg: "#e4f1eb", text: "#4e8c68" },
    { bg: "#fdf3d8", text: "#9e7628" },
    { bg: "#e8ecf8", text: "#4a57b0" },
    { bg: "#f3e8f5", text: "#8e3fa8" },
  ];
  return p[name.charCodeAt(0) % p.length];
};

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */
function DoctorDashboard() {
  const navigate = useNavigate();
  const doctorUserId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "doctor") { navigate("/doctor-login"); return; }
    if (!doctorUserId) return;
    fetchTotalPatients(); fetchTodayAppointments(); fetchRecentPatients();
  }, [doctorUserId, role, navigate]);

  const fetchTotalPatients = async () => {
    try { const r = await axios.get(`${API_BASE}/doctor/total-patients/`); setTotalPatients(r.data.total); }
    catch { /* noop */ } finally { setLoading(false); }
  };
  const fetchTodayAppointments = async () => {
    try { const r = await axios.get(`${API_BASE}/doctor/appointments/today/${doctorUserId}/`); setTodayAppointments(r.data.length); }
    catch { setTodayAppointments(0); }
  };
  const fetchRecentPatients = async () => {
    try { const r = await axios.get(`${API_BASE}/doctor/recent-patients/`); setRecentPatients(r.data); }
    catch { setRecentPatients([]); }
  };

  const menuItems = [
    { id: "overview",      label: "Overview",         icon: Activity },
    { id: "patients",      label: "My Patients",      icon: Users },
    { id: "register",      label: "Register Patient", icon: Plus },
    { id: "monitor",       label: "Glucose Monitor",  icon: TrendingUp },
    { id: "prescriptions", label: "Treatment Plan",   icon: Pill },
    { id: "appointments",  label: "Appointments",     icon: Calendar },
    { id: "diet",          label: "Diet Plans",       icon: FileText },
    { id: "advice",        label: "Medical Advice",   icon: MessageSquare },
  ];

  const handleNavigation = (id) => {
    const routes = {
      patients: "/patient-management", monitor: "/glucose-management",
      appointments: "/appointment-page", diet: "/diet-plan",
      prescriptions: "/treatment-plan", register: "/patient-registration",
      advice: "/doctor/medical-advice",
    };
    routes[id] ? navigate(routes[id]) : setActiveSection(id);
  };

  /* ── OVERVIEW ── */
  const renderOverview = () => {
    if (loading) return (
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[1,2].map(i => (
            <div key={i} style={{ background: "var(--warm-white)", borderRadius: "var(--radius)", padding: 28, boxShadow: "var(--shadow)" }}>
              <Sk w="44px" h="44px" r="12px" />
              <div style={{ marginTop: 18 }}><Sk w="56px" h="46px" r="8px" /></div>
              <div style={{ marginTop: 12 }}><Sk w="130px" h="12px" /></div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--warm-white)", borderRadius: "var(--radius)", padding: 28, boxShadow: "var(--shadow)" }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--stone-100)" }}>
              <Sk w="38px" h="38px" r="50%" />
              <div style={{ flex: 1, display: "grid", gap: 8 }}>
                <Sk w="140px" h="13px" /><Sk w="80px" h="10px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div style={{ display: "grid", gap: 20 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <StatCard label="Total Patients" value={totalPatients} icon={Users} filled delay="delay-1" sub="Under active care" />
          <StatCard label="Today's Appointments" value={todayAppointments} icon={Calendar} delay="delay-2" sub="Scheduled for today" />
        </div>

        {/* Recent Patients Card */}
        <div
          className="fade-up delay-3"
          style={{
            background: "var(--warm-white)", borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)", border: "1px solid var(--stone-100)", overflow: "hidden"
          }}
        >
          <div style={{
            padding: "22px 28px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid var(--stone-100)"
          }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 19, fontWeight: 600, color: "var(--stone-900)" }}>
                Recent Patients
              </h3>
              <p style={{ fontSize: 12, color: "var(--stone-500)", marginTop: 2 }}>
                Latest records &amp; health status
              </p>
            </div>
            <button
              onClick={() => navigate("/patient-management")}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 16px", borderRadius: 99,
                background: "var(--cream)", border: "1px solid var(--stone-100)",
                color: "var(--stone-700)", fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-lt)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent-md)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.color = "var(--stone-700)"; e.currentTarget.style.borderColor = "var(--stone-100)"; }}
            >
              View all <ArrowUpRight size={12} />
            </button>
          </div>

          {recentPatients.length === 0 ? (
            <div style={{ padding: "60px 28px", textAlign: "center" }}>
              <div style={{
                width: 54, height: 54, borderRadius: "var(--radius-sm)",
                background: "var(--cream2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px"
              }}>
                <Users size={22} color="var(--stone-400)" />
              </div>
              <p style={{ fontFamily: "var(--font-head)", fontSize: 15, color: "var(--stone-700)", fontWeight: 600 }}>
                No patients yet
              </p>
              <p style={{ fontSize: 12, color: "var(--stone-400)", marginTop: 4 }}>
                Register your first patient to get started
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--cream)" }}>
                    {["Patient", "Age", "HbA1c", "Status"].map(h => (
                      <th key={h} style={{
                        padding: "11px 22px", textAlign: "left",
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "var(--stone-500)",
                        borderBottom: "1px solid var(--stone-100)"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient, i) => {
                    const av = avatarPalette(patient.name);
                    return (
                      <tr
                        key={patient.patient_id}
                        className="fade-up"
                        style={{ borderBottom: "1px solid var(--stone-100)", transition: "background 0.15s", cursor: "pointer", animationDelay: `${0.28 + i * 0.05}s` }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 22px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: av.bg, flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 14, fontWeight: 700, fontFamily: "var(--font-head)", color: av.text
                            }}>
                              {patient.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--stone-900)", fontSize: 14 }}>
                              {patient.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 22px", fontSize: 13, color: "var(--stone-700)" }}>
                          {patient.age} <span style={{ color: "var(--stone-300)" }}>yrs</span>
                        </td>
                        <td style={{ padding: "14px 22px" }}>
                          <span style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 600, color: "var(--stone-900)" }}>
                            {patient.hba1c ?? "—"}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--stone-300)", marginLeft: 2 }}>%</span>
                        </td>
                        <td style={{ padding: "14px 22px" }}>
                          <StatusBadge status={patient.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection = () => {
    if (activeSection === "overview") return renderOverview();
    return (
      <div style={{ background: "var(--warm-white)", borderRadius: "var(--radius)", padding: "80px 40px", textAlign: "center", boxShadow: "var(--shadow)" }}>
        <Activity size={28} color="var(--stone-300)" style={{ margin: "0 auto 14px" }} />
        <p style={{ fontFamily: "var(--font-head)", fontSize: 16, color: "var(--stone-500)" }}>Coming soon</p>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "var(--font-body)" }}>
      <GlobalStyle />

      {/* ── TOPBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, height: 62,
        background: "rgba(247,249,249,0.94)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--stone-100)",
        display: "flex", alignItems: "center",
        padding: "0 24px", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone-500)", padding: 4, borderRadius: 6 }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(90,155,155,0.30)"
          }}>
            <Heart size={16} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 600, color: "var(--stone-900)", lineHeight: 1.15 }}>
              DiabeteCare
            </div>
            <div style={{ fontSize: 9.5, color: "var(--stone-400)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Doctor Portal
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{
            width: 38, height: 38, borderRadius: "var(--radius-xs)",
            background: "var(--warm-white)", border: "1px solid var(--stone-100)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", transition: "border-color 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--stone-300)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--stone-100)"}
          >
            <Bell size={15} color="var(--stone-600)" />
            <span style={{
              position: "absolute", top: 8, right: 8,
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--accent)", border: "2px solid var(--warm-white)",
              animation: "floatDot 2.2s ease-in-out infinite"
            }} />
          </button>

          <button
            onClick={() => { localStorage.clear(); navigate("/doctor-login", { replace: true }); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0 16px", height: 38, borderRadius: "var(--radius-xs)",
              background: "var(--warm-white)", border: "1px solid var(--stone-100)",
              color: "var(--stone-700)", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.18s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--danger-lt)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "#e8b0aa"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--warm-white)"; e.currentTarget.style.color = "var(--stone-700)"; e.currentTarget.style.borderColor = "var(--stone-100)"; }}
          >
            <LogOut size={13} /> <span>Logout</span>
          </button>
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 232,
          minHeight: "calc(100vh - 62px)",
          background: "var(--warm-white)",
          borderRight: "1px solid var(--stone-100)",
          position: "sticky", top: 62,
          height: "calc(100vh - 62px)",
          overflowY: "auto", flexShrink: 0,
          transition: "margin-left 0.25s ease",
          marginLeft: sidebarOpen ? 0 : -232,
        }}>
          <nav style={{ padding: "18px 12px 12px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--stone-300)", padding: "4px 10px 10px" }}>
              Navigation
            </div>
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: "var(--radius-sm)",
                    border: "1px solid transparent",
                    background: isActive ? "var(--accent-lt)" : "transparent",
                    borderColor: isActive ? "var(--accent-md)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--stone-700)",
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s", textAlign: "left", marginBottom: 2
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.color = "var(--stone-900)"; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--stone-700)"; }}}
                >
                  <span style={{
                    width: 30, height: 30, borderRadius: "var(--radius-xs)", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isActive ? "var(--accent)" : "var(--cream2)",
                    color: isActive ? "#fff" : "var(--stone-500)",
                    transition: "all 0.15s"
                  }}>
                    <item.icon size={14} />
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <ChevronRight size={12} color="var(--accent)" />}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "0 12px 20px" }}>
            <div style={{ height: 1, background: "var(--stone-100)", marginBottom: 14 }} />
            <button
              onClick={() => navigate("/patient-registration")}
              style={{
                width: "100%", padding: "11px 16px", borderRadius: "var(--radius-sm)",
                background: "var(--accent)", border: "none", color: "#fff",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                boxShadow: "0 4px 14px rgba(90,155,155,0.28)",
                transition: "background 0.18s, transform 0.18s, box-shadow 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dk)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 7px 22px rgba(90,155,155,0.36)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(90,155,155,0.28)"; }}
            >
              <Plus size={15} /> New Patient
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: "32px 32px 48px", minWidth: 0 }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="fade-up" style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <h2 style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, color: "var(--stone-900)", letterSpacing: "-0.01em" }}>
                  Dashboard
                </h2>
                <span style={{
                  fontSize: 12, color: "var(--stone-500)",
                  background: "var(--warm-white)", padding: "3px 12px",
                  borderRadius: 99, border: "1px solid var(--stone-100)",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--stone-500)", marginTop: 5 }}>
                Welcome back — here's what's happening today.
              </p>
            </div>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;