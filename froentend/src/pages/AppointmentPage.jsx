import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  PlayCircle,
  User,
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

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
    }
  `}</style>
);

const AppointmentManagement = () => {
  const doctorUserId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");

  const getPendingRequestId = async (appointmentId) => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/doctor/reschedule-requests/${doctorUserId}/`
    );
    const req = res.data.find(
      (r) => Number(r.appointment_id) === Number(appointmentId)
    );
    return req?.request_id || null;
  };

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (role !== "doctor") {
      navigate("/doctor-login");
    }
  }, [role, navigate]);

  /* ================= FETCH PATIENTS ================= */
  useEffect(() => {
    if (!doctorUserId) return;

    axios
      .get(`http://127.0.0.1:8000/api/doctor/patients/${doctorUserId}/`)
      .then(res => setPatients(res.data))
      .catch(err => console.error("Patient fetch error:", err));
  }, [doctorUserId]);

  /* ================= FETCH APPOINTMENTS ================= */
  const loadAppointments = async (patient) => {
    setSelectedPatient(patient);
    setLoading(true);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/patient/appointments/${patient.user_id}/`
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Appointment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPROVE RESCHEDULE ================= */
  const approveReschedule = async (appointmentId) => {
    try {
      const requestId = await getPendingRequestId(appointmentId);
      if (!requestId) {
        alert("No pending reschedule request found");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/appointment/approve-reschedule/",
        { request_id: requestId }
      );

      alert("Reschedule approved");
      loadAppointments(selectedPatient);
    } catch (err) {
      alert("Approval failed");
    }
  };

  /* ================= REJECT RESCHEDULE ================= */
  const rejectReschedule = async (appointmentId) => {
    try {
      const requestId = await getPendingRequestId(appointmentId);
      if (!requestId) {
        alert("No pending reschedule request found");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/appointment/reject-reschedule/",
        { request_id: requestId }
      );

      alert("Reschedule rejected");
      loadAppointments(selectedPatient);
    } catch (err) {
      alert("Rejection failed");
    }
  };

  /* ================= COMPLETE APPOINTMENT ================= */
  const completeAppointment = async (appointmentId) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/appointment/complete/",
        { appointment_id: appointmentId }
      );

      alert("Appointment completed");
      loadAppointments(selectedPatient);
    } catch (err) {
      alert("Completion failed");
    }
  };

  /* ================= STATUS HELPERS ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { bg: "var(--stone-100)", text: "var(--stone-700)" };
      case "PATIENT_CONFIRMED":
        return { bg: "var(--accent-lt)", text: "var(--accent-dk)" };
      case "RESCHEDULE_REQUESTED":
        return { bg: "var(--warn-lt)", text: "var(--warn)" };
      case "COMPLETED":
        return { bg: "var(--success-lt)", text: "var(--success)" };
      case "CANCELLED":
        return { bg: "var(--stone-100)", text: "var(--stone-500)" };
      default:
        return { bg: "var(--stone-100)", text: "var(--stone-500)" };
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ");
  };

  // Filter appointments
  const upcomingAppointments = appointments.filter(
    a => a.status !== "COMPLETED" && a.status !== "CANCELLED"
  );
  const completedAppointments = appointments.filter(
    a => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  const displayedAppointments = selectedTab === "upcoming" 
    ? upcomingAppointments 
    : completedAppointments;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Nunito', sans-serif" }}>
      <GlobalStyle />
      
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "48px 24px" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "48px" }}>
          <button
            onClick={() => navigate("/doctor-dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              color: "var(--stone-500)", background: "none", border: "none",
              cursor: "pointer", marginBottom: "32px", fontSize: "14px",
              fontWeight: 500, transition: "color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--stone-900)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--stone-500)"}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <h1 style={{
            fontSize: "36px", fontWeight: 300, color: "var(--stone-900)",
            letterSpacing: "-0.02em", fontFamily: "'Playfair Display', serif"
          }}>
            Appointments
          </h1>
        </div>

        {/* PATIENT LIST */}
        {!selectedPatient && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <p style={{
                fontSize: "12px", color: "var(--stone-500)",
                textTransform: "uppercase", letterSpacing: "0.1em",
                fontWeight: 600
              }}>
                Select Patient ({patients.length})
              </p>
            </div>

            {patients.length === 0 ? (
              <div style={{
                background: "var(--warm-white)", borderRadius: "12px",
                padding: "64px", textAlign: "center",
                border: "1px solid var(--stone-100)"
              }}>
                <div style={{
                  width: "64px", height: "64px", background: "var(--cream2)",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px"
                }}>
                  <User color="var(--stone-300)" size={32} />
                </div>
                <p style={{ color: "var(--stone-900)", fontWeight: 600, marginBottom: "4px" }}>
                  No patients registered
                </p>
                <p style={{ color: "var(--stone-500)", fontSize: "14px" }}>
                  Add patients to manage appointments
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                gap: "16px"
              }}>
                {patients.map(p => (
                  <button
                    key={p.patient_id}
                    onClick={() => loadAppointments(p)}
                    style={{
                      background: "var(--warm-white)", padding: "24px",
                      borderRadius: "12px", border: "1px solid var(--stone-100)",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--stone-300)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--stone-100)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        background: "var(--accent)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 600
                      }}>
                        {p.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: "18px", fontWeight: 600,
                          color: "var(--stone-900)", marginBottom: "4px"
                        }}>
                          {p.name}
                        </h3>
                        <p style={{ fontSize: "14px", color: "var(--stone-500)" }}>
                          {p.age} years · {p.gender}
                        </p>
                      </div>
                      <ArrowLeft
                        size={20}
                        color="var(--stone-300)"
                        style={{ transform: "rotate(180deg)" }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{
            background: "var(--warm-white)", borderRadius: "12px",
            padding: "64px", textAlign: "center",
            border: "1px solid var(--stone-100)"
          }}>
            <div style={{
              width: "32px", height: "32px",
              border: "2px solid var(--stone-100)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%", animation: "spin 1s linear infinite",
              margin: "0 auto 16px"
            }}></div>
            <p style={{ color: "var(--stone-500)", fontSize: "14px" }}>
              Loading appointments...
            </p>
          </div>
        )}

        {/* APPOINTMENT VIEW */}
        {selectedPatient && !loading && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedPatient(null);
                setAppointments([]);
                setSelectedTab("upcoming");
              }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                color: "var(--stone-500)", background: "none", border: "none",
                cursor: "pointer", marginBottom: "32px", fontSize: "14px",
                fontWeight: 500, transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--stone-900)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--stone-500)"}
            >
              <ArrowLeft size={20} />
              <span>Back to patients</span>
            </button>

            {/* Patient Header */}
            <div style={{
              background: "var(--warm-white)", border: "1px solid var(--stone-100)",
              borderRadius: "12px", padding: "32px", marginBottom: "32px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "var(--accent)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 600, fontSize: "20px"
                  }}>
                    {selectedPatient.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: "24px", fontWeight: 300, color: "var(--stone-900)",
                      marginBottom: "4px", fontFamily: "'Playfair Display', serif"
                    }}>
                      {selectedPatient.name}
                    </h2>
                    <p style={{ fontSize: "14px", color: "var(--stone-500)" }}>
                      {selectedPatient.age} years · {selectedPatient.gender}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontSize: "32px", fontWeight: 300, color: "var(--stone-900)",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {appointments.length}
                  </p>
                  <p style={{
                    fontSize: "12px", color: "var(--stone-500)",
                    textTransform: "uppercase", letterSpacing: "0.1em"
                  }}>
                    Appointments
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex", gap: "4px", marginBottom: "32px",
              borderBottom: "1px solid var(--stone-100)"
            }}>
              <button
                onClick={() => setSelectedTab("upcoming")}
                style={{
                  padding: "12px 24px", fontSize: "14px", fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                  color: selectedTab === "upcoming" ? "var(--stone-900)" : "var(--stone-500)",
                  position: "relative", transition: "color 0.2s"
                }}
              >
                Upcoming
                {selectedTab === "upcoming" && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "2px", background: "var(--accent)"
                  }}></div>
                )}
              </button>
              <button
                onClick={() => setSelectedTab("completed")}
                style={{
                  padding: "12px 24px", fontSize: "14px", fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                  color: selectedTab === "completed" ? "var(--stone-900)" : "var(--stone-500)",
                  position: "relative", transition: "color 0.2s"
                }}
              >
                Completed
                {selectedTab === "completed" && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "2px", background: "var(--accent)"
                  }}></div>
                )}
              </button>
            </div>

            {/* Appointments List */}
            {displayedAppointments.length === 0 ? (
              <div style={{
                background: "var(--warm-white)", borderRadius: "12px",
                padding: "64px", textAlign: "center",
                border: "1px solid var(--stone-100)"
              }}>
                <div style={{
                  width: "64px", height: "64px", background: "var(--cream2)",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px"
                }}>
                  <Calendar color="var(--stone-300)" size={32} />
                </div>
                <p style={{ color: "var(--stone-900)", fontWeight: 600, marginBottom: "4px" }}>
                  No {selectedTab} appointments
                </p>
                <p style={{ color: "var(--stone-500)", fontSize: "14px" }}>
                  {selectedTab === "upcoming" 
                    ? "All appointments are completed or cancelled" 
                    : "No completed appointments yet"}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {displayedAppointments.map(a => {
                  const statusColors = getStatusColor(a.status);
                  return (
                    <div
                      key={a.appointment_id}
                      style={{
                        background: "var(--warm-white)",
                        border: "1px solid var(--stone-100)",
                        borderRadius: "12px", padding: "24px",
                        transition: "border-color 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--stone-300)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--stone-100)"}
                    >
                      <div style={{
                        display: "flex", alignItems: "start",
                        justifyContent: "space-between", marginBottom: "16px"
                      }}>
                        <div>
                          <div style={{
                            display: "flex", alignItems: "center",
                            gap: "12px", marginBottom: "8px"
                          }}>
                            <h3 style={{
                              fontSize: "18px", fontWeight: 600,
                              color: "var(--stone-900)"
                            }}>
                              {a.date}
                            </h3>
                            <span style={{
                              padding: "4px 10px", fontSize: "11px",
                              fontWeight: 700, borderRadius: "99px",
                              background: statusColors.bg,
                              color: statusColors.text,
                              textTransform: "capitalize"
                            }}>
                              {formatStatus(a.status)}
                            </span>
                          </div>
                          <div style={{
                            display: "flex", alignItems: "center",
                            gap: "8px", color: "var(--stone-500)"
                          }}>
                            <Clock size={16} />
                            <span style={{ fontSize: "14px" }}>{a.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* RESCHEDULE ACTIONS */}
                      {a.status === "RESCHEDULE_REQUESTED" && (
                        <div style={{
                          display: "flex", gap: "12px", paddingTop: "16px",
                          borderTop: "1px solid var(--stone-100)"
                        }}>
                          <button
                            onClick={() => approveReschedule(a.appointment_id)}
                            style={{
                              flex: 1, background: "var(--accent)",
                              color: "#fff", padding: "10px 16px",
                              borderRadius: "8px", border: "none",
                              fontSize: "14px", fontWeight: 600,
                              cursor: "pointer", transition: "background 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--accent-dk)"}
                            onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectReschedule(a.appointment_id)}
                            style={{
                              flex: 1, background: "var(--warm-white)",
                              border: "1px solid var(--stone-100)",
                              color: "var(--stone-700)", padding: "10px 16px",
                              borderRadius: "8px", fontSize: "14px",
                              fontWeight: 600, cursor: "pointer",
                              transition: "border-color 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--stone-300)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--stone-100)"}
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* COMPLETE BUTTON */}
                      {a.status === "PATIENT_CONFIRMED" && (
                        <div style={{
                          paddingTop: "16px",
                          borderTop: "1px solid var(--stone-100)"
                        }}>
                          <button
                            onClick={() => completeAppointment(a.appointment_id)}
                            style={{
                              width: "100%", background: "var(--accent)",
                              color: "#fff", padding: "10px 16px",
                              borderRadius: "8px", border: "none",
                              fontSize: "14px", fontWeight: 600,
                              cursor: "pointer", transition: "background 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--accent-dk)"}
                            onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AppointmentManagement;