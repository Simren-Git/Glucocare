import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Activity,
  Utensils,
  Syringe,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  User,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react';

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

    .bgm-page {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      padding: 40px 48px 64px;
    }

    /* ── TOPBAR ── */
    .bgm-topbar {
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
    .back-btn:hover { background: var(--navy); color: #fff; border-color: var(--navy); }

    .bgm-header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
    }

    /* ── HERO ── */
    .bgm-hero {
      background: var(--navy);
      border-radius: 24px;
      padding: 32px 40px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      position: relative;
      overflow: hidden;
    }
    .bgm-hero::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 240px; height: 240px;
      border-radius: 50%;
      background: rgba(18,153,138,0.1);
      pointer-events: none;
    }
    .bgm-hero::after {
      content: '';
      position: absolute;
      bottom: -80px; right: 140px;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: rgba(201,168,76,0.07);
      pointer-events: none;
    }

    .hero-left {
      display: flex;
      align-items: center;
      gap: 18px;
      position: relative;
      z-index: 1;
    }

    .hero-avatar {
      width: 60px; height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--teal), var(--teal-deep));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Serif Display', serif;
      font-size: 22px;
      color: #fff;
      flex-shrink: 0;
    }

    .hero-eyebrow {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--gold);
      font-weight: 700;
      margin-bottom: 6px;
    }

    .hero-name {
      font-family: 'DM Serif Display', serif;
      font-size: 24px;
      font-weight: 400;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 8px;
    }

    .hero-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .hero-chip {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.12);
    }

    .hero-right {
      display: flex;
      gap: 12px;
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .hero-stat-box {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 16px 22px;
      text-align: center;
      min-width: 80px;
    }

    .hero-stat-value {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      color: #fff;
      line-height: 1;
    }

    .hero-stat-label {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* ── FILTERS PANEL ── */
    .filters-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 22px 24px;
      margin-bottom: 20px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .search-wrap {
      position: relative;
      flex: 1;
      min-width: 220px;
    }

    .search-icon {
      position: absolute;
      top: 50%; left: 14px;
      transform: translateY(-50%);
      color: var(--ink-light);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 10px 38px 10px 38px;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: var(--ink);
      outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
    }
    .search-input::placeholder { color: var(--ink-light); }
    .search-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(18,153,138,0.1); }

    .search-clear {
      position: absolute;
      top: 50%; right: 12px;
      transform: translateY(-50%);
      width: 20px; height: 20px;
      border-radius: 50%;
      border: none;
      background: var(--border);
      color: var(--ink-light);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
    }
    .search-clear:hover { background: var(--rose-soft); color: var(--rose); }

    .filter-group { display: flex; flex-direction: column; gap: 6px; }
    .filter-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: var(--ink-light); }

    .pill-group { display: flex; gap: 6px; flex-wrap: wrap; }

    .filter-pill {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--paper);
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--ink-mid);
      cursor: pointer;
      transition: all 0.15s;
    }
    .filter-pill:hover { border-color: var(--teal); color: var(--teal); }
    .filter-pill.active-status { background: var(--navy); color: #fff; border-color: var(--navy); }
    .filter-pill.active-time   { background: var(--teal); color: #fff; border-color: var(--teal); }

    /* ── STAT CARDS ── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 22px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); transform: translateY(-1px); }

    .stat-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon.avg     { background: var(--teal-soft);   color: var(--teal); }
    .stat-icon.highest { background: var(--rose-soft);    color: var(--rose); }
    .stat-icon.lowest  { background: var(--green-soft);   color: var(--green); }

    .stat-info {}
    .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: var(--ink-light); margin-bottom: 4px; }
    .stat-value {
      font-family: 'DM Serif Display', serif;
      font-size: 32px;
      line-height: 1;
      color: var(--ink);
    }
    .stat-unit { font-size: 11px; color: var(--ink-light); margin-top: 2px; }

    /* ── SECTION HEADER ── */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .section-title {
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      font-weight: 400;
      color: var(--ink);
    }
    .results-meta { font-size: 12px; color: var(--ink-light); font-weight: 500; }

    /* ── READING CARDS ── */
    .reading-list { display: flex; flex-direction: column; gap: 10px; }

    .reading-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .reading-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); }

    .reading-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 22px;
      cursor: pointer;
      gap: 16px;
    }

    .reading-left { display: flex; align-items: center; gap: 14px; flex: 1; }

    .reading-type-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
      background: var(--violet-soft);
      color: var(--violet);
      white-space: nowrap;
    }

    .reading-datetime {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .reading-dt-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
    }

    .reading-right {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
    }

    .glucose-badge {
      padding: 10px 18px;
      border-radius: 12px;
      border: 1px solid transparent;
      text-align: center;
      min-width: 80px;
    }
    .glucose-badge.status-normal   { background: var(--green-soft);   border-color: rgba(22,163,74,0.2); }
    .glucose-badge.status-high     { background: var(--amber-soft);   border-color: rgba(224,123,57,0.2); }
    .glucose-badge.status-veryhigh { background: var(--rose-soft);    border-color: rgba(194,57,90,0.2); }
    .glucose-badge.status-low      { background: var(--rose-soft);    border-color: rgba(194,57,90,0.2); }

    .glucose-value {
      font-family: 'DM Serif Display', serif;
      font-size: 26px;
      line-height: 1;
    }
    .glucose-value.normal   { color: var(--green); }
    .glucose-value.high     { color: var(--amber); }
    .glucose-value.veryhigh { color: var(--rose); }
    .glucose-value.low      { color: var(--rose); }

    .glucose-unit { font-size: 10px; color: var(--ink-light); margin-top: 2px; text-align: center; }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .status-pill .dot { width: 5px; height: 5px; border-radius: 50%; }
    .status-pill.normal   { background: var(--green-soft); color: var(--green); }
    .status-pill.normal .dot   { background: var(--green); }
    .status-pill.high     { background: var(--amber-soft); color: #b45309; }
    .status-pill.high .dot     { background: #b45309; }
    .status-pill.veryhigh { background: var(--rose-soft); color: var(--rose); }
    .status-pill.veryhigh .dot { background: var(--rose); }
    .status-pill.low      { background: var(--rose-soft); color: var(--rose); }
    .status-pill.low .dot      { background: var(--rose); }

    .expand-btn {
      width: 30px; height: 30px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ink-light);
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .expand-btn:hover { background: var(--teal-soft); border-color: var(--teal); color: var(--teal); }

    /* ── EXPANDED DETAIL ── */
    .reading-detail {
      border-top: 1px solid var(--border);
      padding: 18px 22px;
      background: var(--paper);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .detail-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .detail-icon.syringe  { background: var(--violet-soft); color: var(--violet); }
    .detail-icon.food     { background: var(--amber-soft);  color: var(--amber); }
    .detail-icon.notes    { background: var(--teal-soft);   color: var(--teal); }

    .detail-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: var(--ink-light); margin-bottom: 4px; }
    .detail-value { font-size: 13px; font-weight: 500; color: var(--ink-mid); line-height: 1.4; }

    /* ── EMPTY ── */
    .empty-state {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 56px 32px;
      text-align: center;
    }
    .empty-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: var(--paper);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px;
    }
    .empty-state h3 {
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      font-weight: 400;
      color: var(--ink);
      margin-bottom: 6px;
    }
    .empty-state p { font-size: 13px; color: var(--ink-light); }

    /* ── LOADING ── */
    .bgm-loading {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: var(--paper);
      font-family: 'DM Sans', sans-serif;
    }
    .bgm-spinner {
      width: 48px; height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--teal);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .bgm-loading-text { font-size: 15px; color: var(--ink-light); font-weight: 500; }

    @media (max-width: 900px) {
      .bgm-page { padding: 24px 20px 48px; }
      .bgm-hero { flex-direction: column; align-items: flex-start; }
      .hero-right { align-self: flex-start; }
      .stats-row { grid-template-columns: 1fr 1fr; }
      .reading-detail { grid-template-columns: 1fr; }
      .filters-row { flex-direction: column; }
    }
  `}</style>
);

/* ── Helpers ── */
const getStatus = (g) => {
  const v = Number(g);
  if (v < 70)   return 'low';
  if (v <= 140) return 'normal';
  if (v <= 180) return 'high';
  return 'veryhigh';
};

const STATUS_LABELS = {
  normal:   'Normal',
  high:     'High',
  veryhigh: 'Very High',
  low:      'Low',
};

const fmtDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
};

const fmtTime = (t, recorded_at) => {
  if (t) return t;
  if (recorded_at) {
    try { return new Date(recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch {}
  }
  return '—';
};

const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export default function BloodGlucoseManagement() {
  const { userId }   = useParams();
  const navigate     = useNavigate();
  const API_BASE     = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  const [patient,      setPatient]      = useState(null);
  const [allReadings,  setAllReadings]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeRange,    setTimeRange]    = useState('All Time');
  const [expanded,     setExpanded]     = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, glucoseRes] = await Promise.all([
          axios.get(`${API_BASE}/patient/${userId}/`),
          axios.get(`${API_BASE}/blood-glucose/${userId}/`)
        ]);
        const readings = (glucoseRes.data || []).map(r => ({ ...r, glucose: Number(r.glucose) }));
        const avg = readings.length
          ? Math.round(readings.reduce((a, b) => a + Number(b.glucose), 0) / readings.length)
          : 0;
        setPatient({
          name: patientRes.data.patient_name,
          age: patientRes.data.age,
          gender: patientRes.data.gender,
          id: patientRes.data.user_id,
          initials: initials(patientRes.data.patient_name),
          avgGlucose: avg,
        });
        setAllReadings(readings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const toggleCard = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  /* ── Filters ── */
  const STATUS_MAP = { All: null, Normal: 'normal', High: 'high', 'Very High': 'veryhigh', Low: 'low' };

  const filteredReadings = (() => {
    let list = allReadings;
    if (statusFilter !== 'All') {
      list = list.filter(r => getStatus(r.glucose) === STATUS_MAP[statusFilter]);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(r =>
        (r.date || (r.recorded_at ? r.recorded_at.slice(0, 10) : '')).includes(q) ||
        (r.type || '').toLowerCase().includes(q) ||
        String(r.glucose).includes(q)
      );
    }
    const today = new Date();
    if (timeRange === 'Today') {
      const td = today.toISOString().slice(0, 10);
      list = list.filter(r => (r.date || (r.recorded_at ? r.recorded_at.slice(0, 10) : '')) === td);
    } else if (timeRange === 'Last 7 Days') {
      const d7 = new Date(); d7.setDate(today.getDate() - 7);
      list = list.filter(r => { const ds = r.date || (r.recorded_at ? r.recorded_at.slice(0, 10) : null); return ds ? new Date(ds) >= d7 : false; });
    } else if (timeRange === 'Last 30 Days') {
      const d30 = new Date(); d30.setDate(today.getDate() - 30);
      list = list.filter(r => { const ds = r.date || (r.recorded_at ? r.recorded_at.slice(0, 10) : null); return ds ? new Date(ds) >= d30 : false; });
    }
    return list;
  })();

  const stats = filteredReadings.length
    ? {
        avg:     Math.round(filteredReadings.reduce((a, b) => a + Number(b.glucose), 0) / filteredReadings.length),
        highest: Math.max(...filteredReadings.map(r => Number(r.glucose))),
        lowest:  Math.min(...filteredReadings.map(r => Number(r.glucose))),
      }
    : { avg: 0, highest: 0, lowest: 0 };

  /* ── Loading ── */
  if (loading || !patient) {
    return (
      <>
        <Styles />
        <div className="bgm-loading">
          <div className="bgm-spinner" />
          <p className="bgm-loading-text">Loading glucose data…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Styles />
      <div className="bgm-page">

        {/* Topbar */}
        <div className="bgm-topbar">
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={15} />
            Back to Patients
          </button>
          <div className="bgm-header-right">
            <Activity size={13} color="var(--teal)" />
            Blood Glucose Management
          </div>
        </div>

        {/* Hero — Patient Summary */}
        <div className="bgm-hero">
          <div className="hero-left">
            <div className="hero-avatar">{patient.initials}</div>
            <div>
              <p className="hero-eyebrow">Patient Record</p>
              <p className="hero-name">{patient.name}</p>
              <div className="hero-chips">
                {patient.age    && <span className="hero-chip">{patient.age} yrs</span>}
                {patient.gender && <span className="hero-chip">{patient.gender}</span>}
                <span className="hero-chip">ID · {patient.id}</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stat-box">
              <div className="hero-stat-value">{patient.avgGlucose}</div>
              <div className="hero-stat-label">Avg Glucose</div>
            </div>
            <div className="hero-stat-box">
              <div className="hero-stat-value">{allReadings.length}</div>
              <div className="hero-stat-label">Total Readings</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-panel">
          <div className="filters-row">
            {/* Search */}
            <div className="search-wrap">
              <Search size={15} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by date, type or value…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm('')}>
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Status */}
            <div className="filter-group">
              <span className="filter-label">Status</span>
              <div className="pill-group">
                {['All', 'Normal', 'High', 'Very High', 'Low'].map(s => (
                  <button
                    key={s}
                    className={`filter-pill ${statusFilter === s ? 'active-status' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="filter-group">
              <span className="filter-label">Period</span>
              <div className="pill-group">
                {['All Time', 'Today', 'Last 7 Days', 'Last 30 Days'].map(r => (
                  <button
                    key={r}
                    className={`filter-pill ${timeRange === r ? 'active-time' : ''}`}
                    onClick={() => setTimeRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon avg"><Minus size={20} /></div>
            <div className="stat-info">
              <p className="stat-label">Average</p>
              <p className="stat-value">{stats.avg || '—'}</p>
              <p className="stat-unit">mg / dL</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon highest"><TrendingUp size={20} /></div>
            <div className="stat-info">
              <p className="stat-label">Highest</p>
              <p className="stat-value">{stats.highest || '—'}</p>
              <p className="stat-unit">mg / dL</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon lowest"><TrendingDown size={20} /></div>
            <div className="stat-info">
              <p className="stat-label">Lowest</p>
              <p className="stat-value">{stats.lowest || '—'}</p>
              <p className="stat-unit">mg / dL</p>
            </div>
          </div>
        </div>

        {/* Reading History */}
        <div className="section-header">
          <h2 className="section-title">Reading History</h2>
          <span className="results-meta">
            {filteredReadings.length} reading{filteredReadings.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredReadings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Activity size={20} color="var(--ink-light)" /></div>
            <h3>No readings found</h3>
            <p>Try adjusting your filters or time range.</p>
          </div>
        ) : (
          <div className="reading-list">
            {filteredReadings.map(r => {
              const st    = getStatus(r.glucose);
              const date  = r.date || (r.recorded_at ? r.recorded_at.slice(0, 10) : null);
              const time  = fmtTime(r.time, r.recorded_at);
              const isExp = expanded.has(r.id);

              return (
                <div key={r.id} className="reading-card">
                  <div className="reading-main" onClick={() => toggleCard(r.id)}>

                    <div className="reading-left">
                      <span className="reading-type-badge">{r.type || 'General'}</span>
                      <div className="reading-datetime">
                        <span className="reading-dt-item">
                          <Calendar size={12} />{fmtDate(date)}
                        </span>
                        <span className="reading-dt-item">
                          <Clock size={12} />{time}
                        </span>
                      </div>
                    </div>

                    <div className="reading-right">
                      <span className={`status-pill ${st}`}>
                        <span className="dot" />
                        {STATUS_LABELS[st]}
                      </span>

                      <div className={`glucose-badge status-${st}`}>
                        <p className={`glucose-value ${st}`}>{r.glucose}</p>
                        <p className="glucose-unit">mg/dL</p>
                      </div>

                      <button className="expand-btn">
                        {isExp ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {isExp && (
                    <div className="reading-detail">
                      <div className="detail-item">
                        <div className="detail-icon syringe"><Syringe size={16} /></div>
                        <div>
                          <p className="detail-label">Insulin</p>
                          <p className="detail-value">
                            {r.insulinTaken ? `${r.insulinUnits} units taken` : 'Not taken'}
                          </p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon food"><Utensils size={16} /></div>
                        <div>
                          <p className="detail-label">Food Intake</p>
                          <p className="detail-value">{r.foodIntake || '—'}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon notes"><FileText size={16} /></div>
                        <div>
                          <p className="detail-label">Notes</p>
                          <p className="detail-value">{r.notes || '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}