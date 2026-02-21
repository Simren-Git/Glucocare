import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Activity,
  Users,
  ChevronRight,
  X,
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

    .gpl-page {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      padding: 40px 48px 64px;
    }

    /* ── TOPBAR ── */
    .gpl-topbar {
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

    .gpl-header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
    }

    /* ── HERO ── */
    .gpl-hero {
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

    .gpl-hero::before {
      content: '';
      position: absolute;
      top: -70px; right: -70px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: rgba(18,153,138,0.1);
      pointer-events: none;
    }

    .gpl-hero::after {
      content: '';
      position: absolute;
      bottom: -80px; right: 120px;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: rgba(201,168,76,0.07);
      pointer-events: none;
    }

    .gpl-hero-left { position: relative; z-index: 1; }

    .gpl-hero-eyebrow {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--gold);
      font-weight: 700;
      margin-bottom: 10px;
    }

    .gpl-hero-title {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      font-weight: 400;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 12px;
    }

    .gpl-hero-sub {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
      font-weight: 400;
    }

    .gpl-hero-badge {
      position: relative;
      z-index: 1;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
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
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* ── SEARCH ── */
    .search-wrap {
      position: relative;
      margin-bottom: 24px;
    }

    .search-icon {
      position: absolute;
      top: 50%; left: 16px;
      transform: translateY(-50%);
      color: var(--ink-light);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 13px 44px 13px 44px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--ink);
      outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
    }

    .search-input::placeholder { color: var(--ink-light); }

    .search-input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 3px rgba(18,153,138,0.1);
    }

    .search-clear {
      position: absolute;
      top: 50%; right: 14px;
      transform: translateY(-50%);
      width: 22px; height: 22px;
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

    /* ── RESULTS META ── */
    .results-meta {
      font-size: 12px;
      color: var(--ink-light);
      font-weight: 500;
      margin-bottom: 14px;
      padding-left: 2px;
    }

    /* ── PATIENT LIST ── */
    .patient-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── PATIENT CARD ── */
    .patient-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
      cursor: default;
    }

    .patient-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.08);
      transform: translateY(-1px);
      border-color: rgba(18,153,138,0.25);
    }

    .patient-card-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Avatar with gradient based on first letter */
    .patient-avatar {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--teal), var(--teal-deep));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      font-weight: 400;
      flex-shrink: 0;
    }

    .patient-name {
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      font-weight: 400;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 5px;
    }

    .patient-chips {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .patient-chip {
      display: inline-flex;
      align-items: center;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 20px;
    }

    .chip-age    { background: var(--teal-soft);   color: var(--teal); }
    .chip-gender { background: var(--violet-soft);  color: var(--violet); }
    .chip-id     { background: var(--paper); border: 1px solid var(--border); color: var(--ink-light); }

    /* View button */
    .view-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--navy);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .view-btn:hover {
      background: var(--teal);
      box-shadow: 0 4px 14px rgba(18,153,138,0.35);
    }

    .view-btn-arrow {
      transition: transform 0.18s;
    }

    .view-btn:hover .view-btn-arrow { transform: translateX(2px); }

    /* ── EMPTY STATE ── */
    .empty-state {
      text-align: center;
      padding: 64px 32px;
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

    .empty-state p { font-size: 13px; color: var(--ink-light); }

    /* ── LOADING ── */
    .gpl-loading {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: var(--paper);
      font-family: 'DM Sans', sans-serif;
    }

    .gpl-spinner {
      width: 48px; height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--teal);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .gpl-loading-text { font-size: 15px; color: var(--ink-light); font-weight: 500; }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .gpl-page { padding: 24px 20px 48px; }
      .gpl-hero { flex-direction: column; align-items: flex-start; }
      .gpl-hero-badge { align-self: flex-start; }
      .patient-card { flex-direction: column; align-items: flex-start; }
      .view-btn { width: 100%; justify-content: center; }
    }
  `}</style>
);

/* ── Avatar gradient palette ── */
const AVATAR_GRADIENTS = [
  ['#12998a', '#0d7a6e'],
  ['#5e4db2', '#4a3d8f'],
  ['#e07b39', '#c46230'],
  ['#c2395a', '#a02f4b'],
  ['#16a34a', '#126e3e'],
  ['#0ea5e9', '#0284c7'],
];

const avatarGradient = (name = '') => {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  const [a, b] = AVATAR_GRADIENTS[idx];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

const initials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

/* ── Main Component ── */
const GlucosePatientListPage = () => {
  const navigate     = useNavigate();
  const doctorUserId = localStorage.getItem('user_id');

  const [patients, setPatients] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!doctorUserId) return;
    axios
      .get(`http://127.0.0.1:8000/api/doctor/patients/${doctorUserId}/`)
      .then(res => { setPatients(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [doctorUserId]);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Styles />
        <div className="gpl-loading">
          <div className="gpl-spinner" />
          <p className="gpl-loading-text">Loading patients…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Styles />
      <div className="gpl-page">

        {/* Topbar */}
        <div className="gpl-topbar">
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
          <div className="gpl-header-right">
            <Activity size={13} color="var(--teal)" />
            Glucose Management
          </div>
        </div>

        {/* Hero */}
        <div className="gpl-hero">
          <div className="gpl-hero-left">
            <p className="gpl-hero-eyebrow">Doctor Portal</p>
            <h1 className="gpl-hero-title">Glucose Management</h1>
            <p className="gpl-hero-sub">Monitor blood glucose readings across all your patients</p>
          </div>
          <div className="gpl-hero-badge">
            <div className="hero-badge-value">{patients.length}</div>
            <div className="hero-badge-label">Total Patients</div>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search patients by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Results meta */}
        <p className="results-meta">
          {search
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
            : `${patients.length} patient${patients.length !== 1 ? 's' : ''} registered`}
        </p>

        {/* Patient List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={22} color="var(--ink-light)" />
            </div>
            <h3>{search ? 'No patients found' : 'No patients yet'}</h3>
            <p>
              {search
                ? `No results for "${search}". Try a different name.`
                : 'Patients assigned to you will appear here.'}
            </p>
          </div>
        ) : (
          <div className="patient-list">
            {filtered.map(patient => (
              <div key={patient.user_id} className="patient-card">

                <div className="patient-card-left">
                  <div
                    className="patient-avatar"
                    style={{ background: avatarGradient(patient.name) }}
                  >
                    {initials(patient.name)}
                  </div>

                  <div>
                    <p className="patient-name">{patient.name}</p>
                    <div className="patient-chips">
                      {patient.age    && <span className="patient-chip chip-age">{patient.age} yrs</span>}
                      {patient.gender && <span className="patient-chip chip-gender">{patient.gender}</span>}
                      <span className="patient-chip chip-id">ID · {patient.user_id}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="view-btn"
                  onClick={() => navigate(`/blood-glucose/${patient.user_id}`)}
                >
                  <Activity size={15} />
                  View Readings
                  <ChevronRight size={14} className="view-btn-arrow" />
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
};

export default GlucosePatientListPage;