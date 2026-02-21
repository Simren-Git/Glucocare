import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Apple,
  Info,
  AlertCircle,
  Heart,
  Clock,
  Droplet,
  ArrowLeft,
  Activity,
  CheckCircle,
  Sun,
  Sunset,
  Moon,
  Coffee,
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

    .dp-page {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      padding: 40px 48px 64px;
    }

    /* ── TOPBAR ── */
    .dp-topbar {
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
    }

    .back-btn:hover {
      background: var(--navy);
      color: #fff;
      border-color: var(--navy);
    }

    .dp-header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
    }

    /* ── HERO ── */
    .dp-hero {
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

    .dp-hero::before {
      content: '';
      position: absolute;
      top: -70px; right: -70px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: rgba(18,153,138,0.1);
      pointer-events: none;
    }

    .dp-hero::after {
      content: '';
      position: absolute;
      bottom: -80px; right: 120px;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: rgba(201,168,76,0.07);
      pointer-events: none;
    }

    .dp-hero-left { position: relative; z-index: 1; }

    .dp-hero-eyebrow {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--gold);
      font-weight: 700;
      margin-bottom: 10px;
    }

    .dp-hero-title {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      font-weight: 400;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 16px;
    }

    .dp-hero-meta {
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
      color: rgba(255,255,255,0.55);
      font-weight: 500;
    }

    .hero-meta-item span { color: rgba(255,255,255,0.9); }

    .dp-hero-badges {
      display: flex;
      gap: 12px;
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .hero-badge {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 18px 22px;
      text-align: center;
    }

    .hero-badge-value {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      color: #fff;
      line-height: 1;
    }

    .hero-badge-label {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* ── MEALS GRID ── */
    .meals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    /* ── MEAL CARD ── */
    .meal-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .meal-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    .meal-card-header {
      padding: 20px 22px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
    }

    .meal-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .meal-icon {
      width: 42px; height: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .meal-icon.breakfast { background: #fff7ed; color: #ea580c; }
    .meal-icon.lunch     { background: var(--teal-soft); color: var(--teal); }
    .meal-icon.dinner    { background: var(--violet-soft); color: var(--violet); }
    .meal-icon.snack     { background: var(--green-soft); color: var(--green); }
    .meal-icon.default   { background: var(--amber-soft); color: var(--amber); }

    .meal-title {
      font-family: 'DM Serif Display', serif;
      font-size: 17px;
      font-weight: 400;
      color: var(--ink);
      text-transform: capitalize;
      line-height: 1.2;
    }

    .meal-count {
      font-size: 11px;
      color: var(--ink-light);
      margin-top: 2px;
    }

    .meal-time-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 4px 11px;
      font-size: 11px;
      color: var(--ink-mid);
      font-weight: 600;
      white-space: nowrap;
    }

    .meal-items {
      padding: 16px 22px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .meal-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      background: var(--paper);
      border-radius: 9px;
      font-size: 13px;
      color: var(--ink-mid);
      font-weight: 500;
      border: 1px solid transparent;
      transition: border-color 0.15s, background 0.15s;
    }

    .meal-item:hover {
      background: var(--teal-soft);
      border-color: rgba(18,153,138,0.2);
      color: var(--ink);
    }

    .meal-item-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--teal);
      flex-shrink: 0;
    }

    /* ── FULL-WIDTH CARDS ── */
    .dp-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 20px;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .dp-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.07);
      transform: translateY(-1px);
    }

    .dp-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .dp-card-icon {
      width: 40px; height: 40px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dp-card-icon.teal   { background: var(--teal-soft);   color: var(--teal); }
    .dp-card-icon.amber  { background: var(--amber-soft);   color: var(--amber); }
    .dp-card-icon.green  { background: var(--green-soft);   color: var(--green); }
    .dp-card-icon.violet { background: var(--violet-soft);  color: var(--violet); }

    .dp-card-title {
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      font-weight: 400;
      color: var(--ink);
    }

    .dp-card-subtitle {
      font-size: 12px;
      color: var(--ink-light);
      margin-top: 2px;
    }

    /* ── NOTES BOX ── */
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

    /* ── TIPS ── */
    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: border-color 0.18s;
    }

    .tip-item:hover { border-color: var(--teal); }

    .tip-emoji { font-size: 20px; line-height: 1; flex-shrink: 0; margin-top: 1px; }

    .tip-text strong {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 2px;
    }

    .tip-text span {
      font-size: 12px;
      color: var(--ink-light);
      line-height: 1.5;
    }

    /* ── WATER BANNER ── */
    .water-banner {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #e0f2fe, #e6f7f5);
      border: 1px solid rgba(18,153,138,0.2);
      border-radius: 12px;
    }

    .water-icon {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: var(--teal);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .water-text strong {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 2px;
    }

    .water-text span { font-size: 12px; color: var(--ink-light); }

    /* ── LOADING / EMPTY ── */
    .dp-loading {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: var(--paper);
      font-family: 'DM Sans', sans-serif;
    }

    .dp-spinner {
      width: 48px; height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--teal);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .dp-loading-text { font-size: 15px; color: var(--ink-light); font-weight: 500; }

    .dp-empty {
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
      background: var(--teal-soft);
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
      .dp-page { padding: 24px 20px 48px; }
      .meals-grid { grid-template-columns: 1fr; }
      .dp-hero { flex-direction: column; align-items: flex-start; }
      .dp-hero-badges { align-self: flex-start; }
      .tips-grid { grid-template-columns: 1fr 1fr; }
    }
  `}</style>
);

/* ── Meal icon helper ── */
const mealIcon = (key) => {
  const k = key.toLowerCase();
  if (k.includes("breakfast")) return { icon: Coffee,  cls: "breakfast" };
  if (k.includes("lunch"))     return { icon: Sun,     cls: "lunch" };
  if (k.includes("dinner"))    return { icon: Moon,    cls: "dinner" };
  if (k.includes("snack"))     return { icon: Apple,   cls: "snack" };
  return { icon: Utensils, cls: "default" };
};

/* ── Meal Card ── */
const MealCard = ({ title, timeFrom, timeTo, items }) => {
  if (!items || items.length === 0) return null;
  const { icon: Icon, cls } = mealIcon(title);

  return (
    <div className="meal-card">
      <div className="meal-card-header">
        <div className="meal-header-left">
          <div className={`meal-icon ${cls}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="meal-title">{title}</p>
            <p className="meal-count">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {timeFrom && timeTo && (
          <span className="meal-time-chip">
            <Clock size={11} />
            {timeFrom} – {timeTo}
          </span>
        )}
      </div>
      <div className="meal-items">
        {items.map((item, i) => (
          <div key={i} className="meal-item">
            <span className="meal-item-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Component ── */
export default function MyDietPlan() {
  const userId   = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [dietPlan,     setDietPlan]     = useState(null);
  const [doctorName,   setDoctorName]   = useState("");
  const [createdDate,  setCreatedDate]  = useState("");
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://127.0.0.1:8000/api/diet-plan/${userId}/`)
      .then(res => {
        if (res.data.length === 0) {
          setDietPlan(null);
        } else {
          const latest = res.data[0];
          setDietPlan(latest.diet_details);
          setDoctorName(latest.doctor_name);
          setCreatedDate(latest.created_at);
        }
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
        <div className="dp-loading">
          <div className="dp-spinner" />
          <p className="dp-loading-text">Loading your diet plan…</p>
        </div>
      </>
    );
  }

  /* ── Empty ── */
  if (!dietPlan) {
    return (
      <>
        <Styles />
        <div className="dp-empty">
          <div className="empty-card">
            <div className="empty-icon-wrap">
              <Apple size={28} color="var(--teal)" />
            </div>
            <h2>No Diet Plan Yet</h2>
            <p>Your doctor hasn't assigned a diet plan yet. Check back after your next consultation.</p>
            <button className="empty-back-btn" onClick={() => navigate("/patient-dashboard")}>
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const meals      = dietPlan.meals || {};
  const mealCount  = Object.keys(meals).length;
  const totalItems = Object.values(meals).reduce((n, m) => n + (m.items?.length || 0), 0);

  return (
    <>
      <Styles />
      <div className="dp-page">

        {/* Topbar */}
        <div className="dp-topbar">
          <button className="back-btn" onClick={() => navigate("/patient-dashboard")}>
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
          <div className="dp-header-right">
            <Activity size={13} color="var(--teal)" />
            Active Diet Plan
          </div>
        </div>

        {/* Hero */}
        <div className="dp-hero">
          <div className="dp-hero-left">
            <p className="dp-hero-eyebrow">Nutrition Plan</p>
            <h1 className="dp-hero-title">My Diet Plan</h1>
            <div className="dp-hero-meta">
              <div className="hero-meta-item">
                <Utensils size={13} color="rgba(255,255,255,0.5)" />
                Prescribed by <span>Dr. {doctorName}</span>
              </div>
              <div className="hero-meta-item">
                <Clock size={13} color="rgba(255,255,255,0.5)" />
                <span>{formatDate(createdDate)}</span>
              </div>
              {dietPlan.calories && (
                <div className="hero-meta-item">
                  <Activity size={13} color="rgba(255,255,255,0.5)" />
                  <span>{dietPlan.calories} kcal / day</span>
                </div>
              )}
            </div>
          </div>

          <div className="dp-hero-badges">
            <div className="hero-badge">
              <div className="hero-badge-value">{mealCount}</div>
              <div className="hero-badge-label">Meals / Day</div>
            </div>
            <div className="hero-badge">
              <div className="hero-badge-value">{totalItems}</div>
              <div className="hero-badge-label">Total Items</div>
            </div>
          </div>
        </div>

        {/* Meal Cards */}
        {mealCount > 0 && (
          <div className="meals-grid">
            {Object.entries(meals).map(([key, meal]) => (
              <MealCard
                key={key}
                title={key}
                timeFrom={meal.timeFrom}
                timeTo={meal.timeTo}
                items={meal.items}
              />
            ))}
          </div>
        )}

        {/* Doctor's Instructions */}
        {dietPlan.notes && (
          <div className="dp-card">
            <div className="dp-card-header">
              <div className="dp-card-icon amber"><AlertCircle size={18} /></div>
              <div>
                <p className="dp-card-title">Doctor's Instructions</p>
                <p className="dp-card-subtitle">Additional guidance from your physician</p>
              </div>
            </div>
            <div className="notes-box">
              <div className="notes-icon-wrap">
                <Info size={16} color="#fff" />
              </div>
              <p className="notes-text">{dietPlan.notes}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="dp-card">
          <div className="dp-card-header">
            <div className="dp-card-icon green"><Heart size={18} /></div>
            <div>
              <p className="dp-card-title">Important Tips</p>
              <p className="dp-card-subtitle">Daily habits for better results</p>
            </div>
          </div>

          <div className="tips-grid">
            {[
              { emoji: "⏰", title: "Eat on Time",     body: "Follow the schedule provided for each meal." },
              { emoji: "🍽",  title: "Don't Skip",      body: "Skipping meals can disrupt your glucose balance." },
              { emoji: "🚶", title: "Stay Active",     body: "Light movement after meals aids digestion." },
              { emoji: "📋", title: "Track Progress",  body: "Log meals and glucose readings regularly." },
            ].map((t, i) => (
              <div key={i} className="tip-item">
                <span className="tip-emoji">{t.emoji}</span>
                <div className="tip-text">
                  <strong>{t.title}</strong>
                  <span>{t.body}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="water-banner">
            <div className="water-icon">
              <Droplet size={18} color="#fff" />
            </div>
            <div className="water-text">
              <strong>Stay Hydrated</strong>
              <span>Drink 8–10 glasses of water daily to support kidney function and glucose regulation.</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}