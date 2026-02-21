import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Stethoscope,
  Clock,
  Pill,
  FileText,
  User,
  ArrowLeft,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp
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

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}</style>
);

const TreatmentPlanPage = () => {
  const doctorUserId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [plans, setPlans] = useState([]);
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedMed, setExpandedMed] = useState(null);

  /* ---------------- FETCH PATIENTS ---------------- */
  useEffect(() => {
    if (!doctorUserId) return;

    axios
      .get(`http://127.0.0.1:8000/api/doctor/patients/${doctorUserId}/`)
      .then(res => setPatients(res.data))
      .catch(err => console.error("Patient fetch error:", err));
  }, [doctorUserId]);

  /* ---------------- FETCH TREATMENT PLANS ---------------- */
  const loadTreatmentPlans = async (patient) => {
    setLoading(true);
    setSelectedPatient(patient);
    setPlans([]);
    setView(null);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/treatment-plan/${patient.user_id}/`
      );
      setPlans(res.data || []);
      if (res.data && res.data.length > 0) {
        setView("current");
      }
    } catch (err) {
      console.error("Treatment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = plans[0];
  const historyPlans = plans.slice(1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Nunito', sans-serif" }}>
      <GlobalStyle />
      
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "48px 24px" }}>
        
        {/* Header */}
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
            Treatment Plans
          </h1>
        </div>

        {/* ================= PATIENT LIST ================= */}
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
                  Add patients to manage treatment plans
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
                    onClick={() => loadTreatmentPlans(p)}
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

        {/* ================= LOADING ================= */}
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
              Loading treatment plans...
            </p>
          </div>
        )}

        {/* ================= TREATMENT VIEW ================= */}
        {selectedPatient && !loading && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedPatient(null);
                setPlans([]);
                setView(null);
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
                    {plans.length}
                  </p>
                  <p style={{
                    fontSize: "12px", color: "var(--stone-500)",
                    textTransform: "uppercase", letterSpacing: "0.1em"
                  }}>
                    Plans
                  </p>
                </div>
              </div>
            </div>

            {/* No Plans */}
            {plans.length === 0 && (
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
                  <Stethoscope color="var(--stone-300)" size={32} />
                </div>
                <p style={{ color: "var(--stone-900)", fontWeight: 600, marginBottom: "4px" }}>
                  No treatment plans
                </p>
                <p style={{ color: "var(--stone-500)", fontSize: "14px", marginBottom: "24px" }}>
                  Create a treatment plan for {selectedPatient.name}
                </p>
                <button
                  onClick={() => navigate(`/create-treatment-plan/${selectedPatient.user_id}`)}
                  style={{
                    background: "var(--accent)", color: "#fff",
                    padding: "12px 24px", borderRadius: "12px",
                    fontWeight: 600, border: "none", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--accent-dk)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
                >
                  <Pill size={18} />
                  Create Plan
                </button>
              </div>
            )}

            {/* Tabs */}
            {plans.length > 0 && (
              <div style={{
                display: "flex", gap: "4px", marginBottom: "32px",
                borderBottom: "1px solid var(--stone-100)"
              }}>
                <button
                  onClick={() => setView("current")}
                  style={{
                    padding: "12px 24px", fontSize: "14px", fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    color: view === "current" ? "var(--stone-900)" : "var(--stone-500)",
                    position: "relative", transition: "color 0.2s"
                  }}
                >
                  Current Plan
                  {view === "current" && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: "2px", background: "var(--accent)"
                    }}></div>
                  )}
                </button>
                <button
                  onClick={() => setView("history")}
                  style={{
                    padding: "12px 24px", fontSize: "14px", fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    color: view === "history" ? "var(--stone-900)" : "var(--stone-500)",
                    position: "relative", transition: "color 0.2s"
                  }}
                >
                  History
                  {view === "history" && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: "2px", background: "var(--accent)"
                    }}></div>
                  )}
                </button>
              </div>
            )}

            {/* ================= CURRENT TREATMENT ================= */}
            {view === "current" && currentPlan && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Diagnosis */}
                <div style={{
                  background: "var(--warm-white)", border: "1px solid var(--stone-100)",
                  borderRadius: "12px", padding: "24px"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                    <div style={{
                      padding: "8px", background: "var(--accent-lt)",
                      borderRadius: "12px"
                    }}>
                      <AlertCircle color="var(--accent)" size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: "14px", color: "var(--stone-500)",
                        marginBottom: "4px", fontWeight: 600
                      }}>
                        Diagnosis
                      </p>
                      <p style={{ fontSize: "20px", fontWeight: 600, color: "var(--stone-900)" }}>
                        {currentPlan.treatment_details.diagnosis}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px"
                }}>
                  <div style={{
                    background: "var(--warm-white)", border: "1px solid var(--stone-100)",
                    borderRadius: "12px", padding: "20px"
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px"
                    }}>
                      <Calendar color="var(--stone-300)" size={18} />
                      <p style={{ fontSize: "14px", color: "var(--stone-500)", fontWeight: 600 }}>
                        Start Date
                      </p>
                    </div>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--stone-900)" }}>
                      {currentPlan.start_date}
                    </p>
                  </div>
                  <div style={{
                    background: "var(--warm-white)", border: "1px solid var(--stone-100)",
                    borderRadius: "12px", padding: "20px"
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px"
                    }}>
                      <Calendar color="var(--stone-300)" size={18} />
                      <p style={{ fontSize: "14px", color: "var(--stone-500)", fontWeight: 600 }}>
                        End Date
                      </p>
                    </div>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--stone-900)" }}>
                      {currentPlan.end_date}
                    </p>
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <h4 style={{
                    fontSize: "12px", color: "var(--stone-500)",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    fontWeight: 600, marginBottom: "16px"
                  }}>
                    Medications
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(currentPlan.treatment_details.medications || []).map((m, i) => {
                      const isExpanded = expandedMed === i;
                      return (
                        <div 
                          key={i}
                          style={{
                            background: "var(--warm-white)",
                            border: "1px solid var(--stone-100)",
                            borderRadius: "12px", overflow: "hidden",
                            transition: "border-color 0.2s"
                          }}
                          onMouseEnter={e => !isExpanded && (e.currentTarget.style.borderColor = "var(--stone-300)")}
                          onMouseLeave={e => !isExpanded && (e.currentTarget.style.borderColor = "var(--stone-100)")}
                        >
                          <button
                            onClick={() => setExpandedMed(isExpanded ? null : i)}
                            style={{
                              width: "100%", padding: "20px",
                              background: "none", border: "none",
                              cursor: "pointer", textAlign: "left"
                            }}
                          >
                            <div style={{
                              display: "flex", alignItems: "center",
                              justifyContent: "space-between"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                  padding: "8px", background: "var(--accent-lt)",
                                  borderRadius: "12px"
                                }}>
                                  <Pill color="var(--accent)" size={20} />
                                </div>
                                <div>
                                  <p style={{
                                    fontSize: "16px", fontWeight: 600,
                                    color: "var(--stone-900)", marginBottom: "4px"
                                  }}>
                                    {m.name}
                                  </p>
                                  <p style={{ fontSize: "14px", color: "var(--stone-500)" }}>
                                    {m.dosage} · {m.timing}
                                  </p>
                                </div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp size={20} color="var(--stone-300)" />
                              ) : (
                                <ChevronDown size={20} color="var(--stone-300)" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div style={{
                              padding: "0 20px 20px",
                              borderTop: "1px solid var(--stone-100)",
                              paddingTop: "16px"
                            }}>
                              <div style={{
                                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "16px"
                              }}>
                                <div>
                                  <p style={{
                                    fontSize: "11px", color: "var(--stone-500)",
                                    textTransform: "uppercase", letterSpacing: "0.1em",
                                    fontWeight: 600, marginBottom: "4px"
                                  }}>
                                    Dosage
                                  </p>
                                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                                    {m.dosage}
                                  </p>
                                </div>
                                <div>
                                  <p style={{
                                    fontSize: "11px", color: "var(--stone-500)",
                                    textTransform: "uppercase", letterSpacing: "0.1em",
                                    fontWeight: 600, marginBottom: "4px"
                                  }}>
                                    Timing
                                  </p>
                                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                                    {m.timing}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                {currentPlan.treatment_details.notes && (
                  <div style={{
                    background: "var(--warm-white)", border: "1px solid var(--stone-100)",
                    borderRadius: "12px", padding: "24px"
                  }}>
                    <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                      <div style={{
                        padding: "8px", background: "var(--accent-lt)",
                        borderRadius: "12px"
                      }}>
                        <FileText color="var(--accent)" size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: "14px", color: "var(--stone-500)",
                          marginBottom: "8px", fontWeight: 600
                        }}>
                          Additional Notes
                        </p>
                        <p style={{
                          color: "var(--stone-900)", lineHeight: 1.6
                        }}>
                          {currentPlan.treatment_details.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= HISTORY ================= */}
            {view === "history" && (
              <div>
                {historyPlans.length === 0 ? (
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
                      <Clock color="var(--stone-300)" size={32} />
                    </div>
                    <p style={{ color: "var(--stone-900)", fontWeight: 600, marginBottom: "4px" }}>
                      No previous treatments
                    </p>
                    <p style={{ color: "var(--stone-500)", fontSize: "14px" }}>
                      This is the first treatment plan
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {historyPlans.map((p, index) => (
                      <div
                        key={p.treatment_id || index}
                        style={{
                          background: "var(--warm-white)", border: "1px solid var(--stone-100)",
                          borderRadius: "12px", padding: "24px"
                        }}
                      >
                        <div style={{
                          display: "flex", flexWrap: "wrap", alignItems: "start",
                          justifyContent: "space-between", gap: "12px", marginBottom: "20px"
                        }}>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                              Previous Treatment {index + 1}
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--stone-500)", marginTop: "4px" }}>
                              {p.created_at
                                ? new Date(p.created_at).toLocaleDateString()
                                : "Date unavailable"}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "12px", color: "var(--stone-500)" }}>Diagnosis</p>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                              {p.treatment_details?.diagnosis || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px", marginBottom: "20px"
                        }}>
                          <div style={{
                            background: "var(--cream2)", borderRadius: "12px", padding: "16px"
                          }}>
                            <p style={{
                              fontSize: "11px", color: "var(--stone-500)",
                              textTransform: "uppercase", fontWeight: 600, marginBottom: "4px"
                            }}>
                              Start Date
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                              {p.start_date || "N/A"}
                            </p>
                          </div>
                          <div style={{
                            background: "var(--cream2)", borderRadius: "12px", padding: "16px"
                          }}>
                            <p style={{
                              fontSize: "11px", color: "var(--stone-500)",
                              textTransform: "uppercase", fontWeight: 600, marginBottom: "4px"
                            }}>
                              End Date
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                              {p.end_date || "N/A"}
                            </p>
                          </div>
                        </div>

                        {(p.treatment_details?.medications || []).length > 0 && (
                          <div style={{ marginBottom: "20px" }}>
                            <p style={{
                              fontSize: "11px", color: "var(--stone-500)",
                              textTransform: "uppercase", fontWeight: 600, marginBottom: "12px"
                            }}>
                              Medications
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                              {(p.treatment_details.medications || []).map((m, medIdx) => (
                                <div
                                  key={medIdx}
                                  style={{
                                    border: "1px solid var(--stone-100)",
                                    borderRadius: "12px", padding: "16px"
                                  }}
                                >
                                  <div style={{
                                    display: "flex", alignItems: "center",
                                    justifyContent: "space-between", gap: "12px"
                                  }}>
                                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--stone-900)" }}>
                                      {m.name || "Medication"}
                                    </p>
                                    <p style={{ fontSize: "12px", color: "var(--stone-500)" }}>
                                      {(m.dosage || "N/A")} - {(m.timing || "N/A")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {p.treatment_details?.notes && (
                          <div style={{
                            borderTop: "1px solid var(--stone-100)",
                            paddingTop: "16px"
                          }}>
                            <p style={{
                              fontSize: "11px", color: "var(--stone-500)",
                              textTransform: "uppercase", fontWeight: 600, marginBottom: "8px"
                            }}>
                              Notes
                            </p>
                            <p style={{
                              fontSize: "14px", color: "var(--stone-700)", lineHeight: 1.6
                            }}>
                              {p.treatment_details.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPlanPage;