import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import {
  Heart, Activity, Apple, Moon, Users, Target, Eye,
  TrendingUp, Calendar, Award, CheckCircle, Shield,
  MessageCircle, Star, ArrowRight, Menu, X, Droplet,
  Stethoscope, Zap
} from 'lucide-react';

/* ─── Global Styles ─── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --navy:       #0c1628;
      --navy-mid:   #152040;
      --navy-light: #1e3057;
      --ink:        #0e1117;
      --ink-mid:    #4a5568;
      --ink-light:  #8896a8;
      --paper:      #f7f5f2;
      --surface:    #ffffff;
      --border:     #e2ddd8;
      --teal:       #12998a;
      --teal-soft:  #e6f7f5;
      --teal-deep:  #0d7a6e;
      --gold:       #c9a84c;
      --gold-light: #e8d08a;
      --cream:      #faf8f5;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--surface);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
    }

    /* ── NAVBAR ── */
    .nav-root {
      position: sticky;
      top: 0;
      z-index: 100;
      transition: all 0.3s ease;
    }

    .nav-root.scrolled {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      box-shadow: 0 1px 20px rgba(0,0,0,0.06);
    }

    .nav-root.top { background: transparent; }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 32px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      text-decoration: none;
    }

    .logo-mark {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, var(--teal), var(--teal-deep));
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(18,153,138,0.3);
    }

    .logo-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 500;
      color: var(--navy);
      letter-spacing: 0.3px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-link {
      font-size: 14px;
      font-weight: 500;
      color: var(--ink-mid);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.18s;
      letter-spacing: 0.2px;
    }
    .nav-link:hover, .nav-link.active { color: var(--navy); }

    .nav-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      background: var(--navy);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.2px;
    }
    .nav-cta:hover { background: var(--navy-light); box-shadow: 0 4px 16px rgba(12,22,40,0.25); }

    .nav-mobile-btn {
      display: none;
      padding: 8px;
      background: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      color: var(--ink-mid);
    }

    .mobile-menu {
      background: var(--surface);
      border-top: 1px solid var(--border);
      padding: 20px 32px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mobile-link {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      color: var(--ink-mid);
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s;
    }
    .mobile-link:hover, .mobile-link.active { background: var(--cream); color: var(--navy); }

    /* ── HERO ── */
    .hero-section {
      background: var(--navy);
      position: relative;
      overflow: hidden;
      padding: 120px 32px 100px;
    }

    .hero-bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .hero-bg-glow {
      position: absolute;
      top: -100px; right: -100px;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(18,153,138,0.15), transparent 70%);
      pointer-events: none;
    }

    .hero-bg-glow2 {
      position: absolute;
      bottom: -120px; left: -80px;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%);
      pointer-events: none;
    }

    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      padding: 6px 16px 6px 8px;
      margin-bottom: 32px;
    }

    .hero-badge-dot {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--teal), var(--teal-deep));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-badge span {
      font-size: 12px;
      color: rgba(255,255,255,0.7);
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .hero-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(48px, 7vw, 88px);
      font-weight: 300;
      color: #fff;
      line-height: 1.05;
      letter-spacing: -1px;
      margin-bottom: 12px;
    }

    .hero-title em {
      font-style: italic;
      color: var(--gold-light);
    }

    .hero-subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(20px, 3vw, 32px);
      font-weight: 300;
      color: rgba(255,255,255,0.5);
      margin-bottom: 40px;
      font-style: italic;
    }

    .hero-body {
      font-size: 16px;
      color: rgba(255,255,255,0.55);
      max-width: 600px;
      margin: 0 auto 52px;
      line-height: 1.8;
    }

    .hero-actions {
      display: flex;
      gap: 14px;
      justify-content: center;
      margin-bottom: 64px;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 14px 28px;
      background: var(--teal);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.2px;
      text-decoration: none;
    }
    .btn-primary:hover { background: var(--teal-deep); box-shadow: 0 8px 24px rgba(18,153,138,0.4); transform: translateY(-1px); }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 14px 28px;
      background: transparent;
      color: rgba(255,255,255,0.8);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.06); }

    .hero-trust {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      font-weight: 500;
    }

    /* ── STATS BAR ── */
    .stats-bar {
      background: var(--paper);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
    }

    .stats-bar-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      divide-x: 1px solid var(--border);
    }

    .stat-cell {
      padding: 36px 32px;
      text-align: center;
      border-right: 1px solid var(--border);
    }
    .stat-cell:last-child { border-right: none; }

    .stat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px;
      font-weight: 400;
      color: var(--navy);
      line-height: 1;
      margin-bottom: 6px;
    }

    .stat-lbl {
      font-size: 12px;
      color: var(--ink-light);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }

    /* ── SECTION SHARED ── */
    .section {
      padding: 96px 32px;
    }

    .section-inner {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-eyebrow {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      font-weight: 700;
      color: var(--teal);
      margin-bottom: 16px;
    }

    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 400;
      color: var(--navy);
      line-height: 1.1;
      letter-spacing: -0.5px;
      margin-bottom: 16px;
    }

    .section-title em { font-style: italic; color: var(--teal); }

    .section-body {
      font-size: 15px;
      color: var(--ink-mid);
      line-height: 1.8;
      max-width: 520px;
    }

    /* ── FEATURES ── */
    .features-section { background: var(--cream); }

    .features-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      background: var(--border);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
    }

    .feature-cell {
      background: var(--surface);
      padding: 44px 36px;
      transition: background 0.2s;
    }
    .feature-cell:hover { background: #fefefe; }

    .feature-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .fi-teal   { background: var(--teal-soft); color: var(--teal); }
    .fi-navy   { background: #e8ecf5;          color: var(--navy); }
    .fi-gold   { background: #fdf6e3;          color: #a07c20; }

    .feature-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 500;
      color: var(--navy);
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .feature-body {
      font-size: 14px;
      color: var(--ink-mid);
      line-height: 1.75;
    }

    /* ── TWO-COL ── */
    .two-col-section { background: var(--surface); }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .two-col.reverse { direction: rtl; }
    .two-col.reverse > * { direction: ltr; }

    .benefits-list { display: flex; flex-direction: column; gap: 20px; margin-top: 36px; }

    .benefit-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 20px;
      background: var(--cream);
      border-radius: 14px;
      border: 1px solid var(--border);
      transition: border-color 0.18s;
    }
    .benefit-item:hover { border-color: var(--teal); }

    .benefit-icon {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: var(--teal-soft);
      color: var(--teal);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .benefit-title { font-size: 14px; font-weight: 600; color: var(--navy); margin-bottom: 3px; }
    .benefit-body  { font-size: 13px; color: var(--ink-mid); line-height: 1.6; }

    /* Visual panel */
    .visual-panel {
      background: var(--navy);
      border-radius: 24px;
      padding: 48px 40px;
      position: relative;
      overflow: hidden;
    }

    .visual-panel::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(18,153,138,0.15), transparent 70%);
    }

    .vp-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      color: var(--gold);
      margin-bottom: 12px;
    }

    .vp-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 28px;
      font-weight: 400;
      color: #fff;
      margin-bottom: 32px;
      line-height: 1.2;
    }

    .vp-metric {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      margin-bottom: 10px;
    }

    .vp-metric-left { display: flex; align-items: center; gap: 12px; }
    .vp-metric-dot  { width: 10px; height: 10px; border-radius: 50%; }
    .vp-metric-name { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
    .vp-metric-val  { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #fff; }
    .vp-metric-unit { font-size: 11px; color: rgba(255,255,255,0.3); margin-left: 4px; }

    /* ── HEALTHY LIVING ── */
    .healthy-section { background: var(--cream); }

    .habits-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 56px;
    }

    .habit-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px 24px;
      transition: all 0.2s;
    }
    .habit-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: var(--teal); }

    .habit-number {
      font-family: 'Cormorant Garamond', serif;
      font-size: 56px;
      font-weight: 300;
      color: var(--border);
      line-height: 1;
      margin-bottom: 16px;
    }

    .habit-title { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 10px; }
    .habit-body  { font-size: 13px; color: var(--ink-mid); line-height: 1.7; }

    /* ── TESTIMONIALS ── */
    .testimonials-section { background: var(--navy); }

    .testimonials-section .section-eyebrow { color: var(--gold); }
    .testimonials-section .section-title { color: #fff; }

    .testi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 56px;
    }

    .testi-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 32px;
      transition: background 0.2s;
    }
    .testi-card:hover { background: rgba(255,255,255,0.08); }

    .testi-stars {
      display: flex;
      gap: 3px;
      margin-bottom: 20px;
    }

    .testi-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-weight: 400;
      font-style: italic;
      color: rgba(255,255,255,0.8);
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .testi-author { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
    .testi-role   { font-size: 12px; color: rgba(255,255,255,0.35); }

    /* ── ABOUT PAGE ── */
    .about-hero {
      background: var(--navy);
      padding: 100px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .about-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .about-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }

    .mission-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .mission-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 36px 32px;
      transition: all 0.2s;
    }
    .mission-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.08); transform: translateY(-2px); }

    .mission-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .mission-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 500;
      color: var(--navy);
      margin-bottom: 12px;
    }

    .mission-body { font-size: 14px; color: var(--ink-mid); line-height: 1.8; }

    /* ── CTA BANNER ── */
    .cta-section { background: var(--cream); }

    .cta-banner {
      background: var(--navy);
      border-radius: 28px;
      padding: 72px 64px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .cta-banner::before {
      content: '';
      position: absolute;
      top: -100px; left: 50%;
      transform: translateX(-50%);
      width: 600px; height: 300px;
      background: radial-gradient(ellipse, rgba(18,153,138,0.12), transparent 70%);
      pointer-events: none;
    }

    .cta-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 400;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 16px;
    }

    .cta-title em { font-style: italic; color: var(--gold-light); }

    .cta-body {
      font-size: 15px;
      color: rgba(255,255,255,0.5);
      max-width: 480px;
      margin: 0 auto 40px;
      line-height: 1.8;
    }

    .cta-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* ── FOOTER ── */
    .footer {
      background: var(--navy);
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 64px 32px 32px;
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 48px;
    }

    .footer-brand p {
      font-size: 13px;
      color: rgba(255,255,255,0.35);
      line-height: 1.8;
      margin: 16px 0 24px;
      max-width: 280px;
    }

    .footer-social {
      display: flex;
      gap: 10px;
    }

    .social-btn {
      width: 36px; height: 36px;
      border-radius: 9px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      transition: all 0.18s;
      text-decoration: none;
    }
    .social-btn:hover { background: rgba(18,153,138,0.2); border-color: rgba(18,153,138,0.3); color: var(--teal); }

    .footer-col h5 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: rgba(255,255,255,0.5);
      margin-bottom: 20px;
    }

    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }

    .footer-col li {
      font-size: 13px;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      transition: color 0.15s;
    }
    .footer-col li:hover { color: rgba(255,255,255,0.8); }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .footer-bottom p { font-size: 12px; color: rgba(255,255,255,0.25); }

    .footer-links {
      display: flex;
      gap: 24px;
    }

    .footer-links a {
      font-size: 12px;
      color: rgba(255,255,255,0.25);
      text-decoration: none;
      transition: color 0.15s;
    }
    .footer-links a:hover { color: rgba(255,255,255,0.6); }

    /* ── ARROW ANIM ── */
    .arrow-hover { transition: transform 0.18s; }
    .btn-primary:hover .arrow-hover { transform: translateX(3px); }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .features-grid  { grid-template-columns: 1fr 1fr; }
      .two-col        { grid-template-columns: 1fr; gap: 40px; }
      .two-col.reverse { direction: ltr; }
      .habits-grid    { grid-template-columns: 1fr 1fr; }
      .footer-top     { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .nav-links      { display: none; }
      .nav-mobile-btn { display: flex; }
      .stats-bar-inner { grid-template-columns: 1fr 1fr; }
      .stat-cell      { border-right: none; border-bottom: 1px solid var(--border); }
      .stat-cell:nth-child(2n) { border-right: none; }
      .features-grid  { grid-template-columns: 1fr; }
      .testi-grid     { grid-template-columns: 1fr; }
      .mission-grid   { grid-template-columns: 1fr; }
      .habits-grid    { grid-template-columns: 1fr; }
      .footer-top     { grid-template-columns: 1fr; gap: 32px; }
      .cta-banner     { padding: 48px 28px; }
      .hero-section   { padding: 80px 24px 72px; }
      .section        { padding: 64px 24px; }
    }
  `}</style>
);

/* ─── Helpers ─── */
const NavCTA = ({ children, to }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <button className="nav-cta">{children}</button>
  </Link>
);

/* ─── Main Component ─── */
const DiabetesCareWebsite = () => {
  const [currentPage,     setCurrentPage]     = useState('home');
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [scrolled,        setScrolled]        = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── NAVIGATION ── */
  const Navigation = () => (
    <nav className={`nav-root ${scrolled ? 'scrolled' : 'top'}`}>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => setCurrentPage('home')}>
          <div className="logo-mark">
            <Heart size={18} color="#fff" />
          </div>
          <span className="logo-text">DiabeteCare</span>
        </div>

        <div className="nav-links">
          <button className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>Home</button>
          <button className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={() => setCurrentPage('about')}>About</button>
          <Link to="/doctor-login" style={{ textDecoration: 'none' }}>
            <button className="nav-link">Doctor Login</button>
          </Link>
          <NavCTA to="/patient-login">Patient Login <ArrowRight size={13} /></NavCTA>
        </div>

        <button className="nav-mobile-btn" onClick={() => setMobileMenuOpen(o => !o)}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button className={`mobile-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}>Home</button>
          <button className={`mobile-link ${currentPage === 'about' ? 'active' : ''}`} onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}>About</button>
          <Link to="/patient-login" style={{ textDecoration: 'none' }}>
            <button className="mobile-link active" style={{ background: 'var(--navy)', color: '#fff', marginTop: 8 }}>Patient Login</button>
          </Link>
        </div>
      )}
    </nav>
  );

  /* ── HOME PAGE ── */
  const HomePage = () => (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow2" />
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="hero-badge-dot"><Droplet size={12} color="#fff" /></div>
            <span>Trusted by 10,000+ patients worldwide</span>
          </div>

          <h1 className="hero-title">
            Diabetes Care,<br /><em>Elevated.</em>
          </h1>
          <p className="hero-subtitle">Your partner in lifelong wellness</p>

          <p className="hero-body">
            A supportive platform where patients and healthcare providers collaborate 
            to achieve healthier outcomes — through intelligent monitoring, 
            personalised insights, and continuous care.
          </p>

          <div className="hero-actions">
            <Link to="/patient-login" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">
                Patient Login <ArrowRight size={15} className="arrow-hover" />
              </button>
            </Link>
            <Link to="/doctor-login" style={{ textDecoration: 'none' }}>
              <button className="btn-outline">
                Doctor Login
              </button>
            </Link>
          </div>

          <div className="hero-trust">
            {[
              { icon: Shield, text: 'Secure & Private' },
              { icon: Users,  text: '10,000+ Users' },
              { icon: Star,   text: '4.9 / 5 Rating' },
            ].map((t, i) => (
              <div key={i} className="trust-item">
                <t.icon size={14} color="rgba(255,255,255,0.4)" />
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { num: '10K+', lbl: 'Active Patients' },
            { num: '500+', lbl: 'Healthcare Providers' },
            { num: '1M+',  lbl: 'Glucose Readings' },
            { num: '98%',  lbl: 'Satisfaction Rate' },
          ].map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="section features-section">
        <div className="section-inner">
          <div className="features-header">
            <p className="section-eyebrow">Platform Features</p>
            <h2 className="section-title">Your journey to wellness,<br /><em>simplified</em></h2>
          </div>
          <div className="features-grid">
            {[
              { icon: Activity,    cls: 'fi-teal', title: 'Daily Glucose Tracking',     body: 'Log readings effortlessly and watch patterns emerge. Understanding your glucose levels has never been more intuitive.' },
              { icon: Zap,        cls: 'fi-navy', title: 'Personalised Insights',       body: 'Receive tailored guidance on food, insulin timing, and lifestyle adjustments designed specifically for your needs.' },
              { icon: TrendingUp, cls: 'fi-gold', title: 'Long-term Health Monitoring', body: 'Track your progress over weeks and months. Celebrate improvements and adjust your care plan as your health evolves.' },
            ].map((f, i) => (
              <div key={i} className="feature-cell">
                <div className={`feature-icon ${f.cls}`}><f.icon size={22} /></div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Monitoring */}
      <section className="section two-col-section">
        <div className="section-inner">
          <div className="two-col">
            <div>
              <p className="section-eyebrow">Why It Matters</p>
              <h2 className="section-title">Continuous monitoring<br /><em>changes everything</em></h2>
              <p className="section-body">
                Consistent tracking reveals your unique patterns, helping you and your healthcare team 
                make informed decisions. When you understand how food, activity, stress, and sleep affect 
                your glucose, you gain the power to make changes that lead to real improvement.
              </p>
              <div className="benefits-list">
                {[
                  { title: 'Better Glucose Control',      body: 'See how your choices directly impact your numbers in real time.' },
                  { title: 'Reduced Risk of Complications', body: 'Early pattern detection means early intervention.' },
                  { title: 'Empowered Decision Making',   body: 'Data-backed clarity on what works for your unique body.' },
                ].map((b, i) => (
                  <div key={i} className="benefit-item">
                    <div className="benefit-icon"><CheckCircle size={16} /></div>
                    <div>
                      <p className="benefit-title">{b.title}</p>
                      <p className="benefit-body">{b.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="visual-panel">
              <p className="vp-label">Live Patient Overview</p>
              <p className="vp-title">Real-time health metrics at your fingertips</p>
              {[
                { name: 'Glucose Level',   val: '118',   unit: 'mg/dL', dot: '#4ade80' },
                { name: 'HbA1c (est.)',    val: '6.1',   unit: '%',     dot: '#60a5fa' },
                { name: 'Avg (30 days)',   val: '124',   unit: 'mg/dL', dot: '#c9a84c' },
                { name: 'Appointments',    val: '2',     unit: 'upcoming', dot: '#a78bfa' },
              ].map((m, i) => (
                <div key={i} className="vp-metric">
                  <div className="vp-metric-left">
                    <div className="vp-metric-dot" style={{ background: m.dot }} />
                    <span className="vp-metric-name">{m.name}</span>
                  </div>
                  <div>
                    <span className="vp-metric-val">{m.val}</span>
                    <span className="vp-metric-unit">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Healthy Living */}
      <section className="section healthy-section">
        <div className="section-inner">
          <p className="section-eyebrow">Healthy Living</p>
          <h2 className="section-title">Small habits, <em>lasting wellness</em></h2>
          <div className="habits-grid">
            {[
              { num: '01', icon: Apple,    title: 'Balanced Nutrition',   body: 'Choose whole foods, manage portions, and enjoy meals that fuel your body while keeping glucose stable.' },
              { num: '02', icon: Calendar, title: 'Regular Monitoring',   body: 'Consistent tracking helps you understand your body\'s patterns and catch changes early.' },
              { num: '03', icon: Activity, title: 'Stay Active',          body: 'Movement improves insulin sensitivity. Even a daily walk makes a meaningful difference.' },
              { num: '04', icon: Moon,     title: 'Rest & Reduce Stress', body: 'Quality sleep and stress management support healthy glucose levels and overall wellbeing.' },
            ].map((h, i) => (
              <div key={i} className="habit-card">
                <div className="habit-number">{h.num}</div>
                <h3 className="habit-title">{h.title}</h3>
                <p className="habit-body">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="section-inner">
          <p className="section-eyebrow">Testimonials</p>
          <h2 className="section-title">Trusted by thousands</h2>
          <div className="testi-grid">
            {[
              { name: 'Sarah Johnson',    role: 'Patient',          text: 'DiabeteCare transformed how I manage my diabetes. The daily tracking is simple, and seeing my progress motivates me every single day.' },
              { name: 'Dr. Michael Chen', role: 'Endocrinologist',  text: 'This platform revolutionised how I monitor my patients. Real-time data helps me provide better, more personalised care than ever before.' },
              { name: 'Robert Martinez',  role: 'Patient',          text: 'I feel more in control of my health than ever. The personalised insights have helped me make genuinely better lifestyle choices.' },
            ].map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars">
                  {[...Array(5)].map((_, si) => <Star key={si} size={14} color="#c9a84c" fill="#c9a84c" />)}
                </div>
                <p className="testi-quote">"{t.text}"</p>
                <p className="testi-author">{t.name}</p>
                <p className="testi-role">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="section-inner">
          <div className="cta-banner">
            <p className="section-eyebrow" style={{ color: 'var(--gold)' }}>Get Started</p>
            <h2 className="cta-title">You're not alone<br /><em>on this journey</em></h2>
            <p className="cta-body">
              Connect with your healthcare team, track your progress together, and receive 
              the guidance and support you deserve every step of the way.
            </p>
            <div className="cta-actions">
              <Link to="/patient-login" style={{ textDecoration: 'none' }}>
                <button className="btn-primary">Patient Login <ArrowRight size={14} className="arrow-hover" /></button>
              </Link>
              <Link to="/doctor-login" style={{ textDecoration: 'none' }}>
                <button className="btn-outline">Doctor Login</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  /* ── ABOUT PAGE ── */
  const AboutPage = () => (
    <>
      <section className="about-hero">
        <div className="about-hero-inner">
          <p className="section-eyebrow" style={{ color: 'var(--gold)' }}>About DiabeteCare</p>
          <h1 className="hero-title" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
            Transforming care,<br /><em>one person at a time</em>
          </h1>
          <p className="hero-body" style={{ margin: '20px auto 0' }}>
            We believe living well with diabetes shouldn't be complicated. Our platform brings together 
            compassionate care, smart technology, and genuine human connection.
          </p>
        </div>
      </section>

      {/* Why monitoring */}
      <section className="section two-col-section">
        <div className="section-inner">
          <div className="two-col">
            <div>
              <p className="section-eyebrow">Our Philosophy</p>
              <h2 className="section-title">Why continuous<br /><em>monitoring matters</em></h2>
              <p className="section-body" style={{ marginBottom: 20 }}>
                Diabetes is deeply personal. What works for one person may not work for another. 
                Consistent monitoring reveals unique patterns, helping you and your healthcare team 
                make informed, confident decisions.
              </p>
              <p className="section-body">
                Technology enables this understanding by making tracking effortless and insights clear — 
                so you can focus on living your life, not managing a condition.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: CheckCircle, title: 'Better glucose control',   bg: 'var(--teal-soft)', clr: 'var(--teal)' },
                { icon: Shield,      title: 'Reduced complications',    bg: '#e8ecf5',          clr: 'var(--navy)' },
                { icon: TrendingUp,  title: 'Improved quality of life', bg: '#dcfce7',          clr: '#16a34a' },
                { icon: Users,       title: 'Empowered decisions',      bg: '#fdf6e3',          clr: '#a07c20' },
              ].map((c, i) => (
                <div key={i} style={{ background: c.bg, borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <c.icon size={28} color={c.clr} style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{c.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Who */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">Our Foundation</p>
          <h2 className="section-title" style={{ marginBottom: 48 }}>Built on purpose</h2>
          <div className="mission-grid">
            {[
              { icon: Heart,         bg: 'var(--teal-soft)',  clr: 'var(--teal)', title: 'Our Mission', body: 'Support healthier lives through smart, compassionate diabetes monitoring that puts people first and technology second.' },
              { icon: Eye,           bg: '#e8ecf5',           clr: 'var(--navy)', title: 'Our Vision',  body: 'Make diabetes care simple, consistent, and human-centred so every person can live with confidence and dignity.' },
              { icon: Stethoscope,   bg: '#dcfce7',           clr: '#16a34a',     title: "Who It's For", body: 'Designed for diabetic patients seeking control and clinic doctors committed to providing personalised, proactive care.' },
            ].map((c, i) => (
              <div key={i} className="mission-card">
                <div className="mission-icon" style={{ background: c.bg }}><c.icon size={22} color={c.clr} /></div>
                <h3 className="mission-title">{c.title}</h3>
                <p className="mission-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Living Well */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">Living Well</p>
          <h2 className="section-title" style={{ marginBottom: 48 }}>Three pillars of <em>lasting health</em></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              { icon: Target, grad: 'linear-gradient(135deg,var(--teal),var(--teal-deep))', title: 'Awareness', body: "Understanding your body's signals and patterns is the first step toward positive changes that last." },
              { icon: Award,  grad: 'linear-gradient(135deg,#c9a84c,#a07c20)',              title: 'Discipline', body: 'Consistent daily actions, no matter how small, build the foundation for lasting health and wellbeing.' },
              { icon: Users,  grad: 'linear-gradient(135deg,var(--navy),var(--navy-light))', title: 'Guidance',  body: 'Expert support and personalised advice help you navigate challenges and celebrate progress along the way.' },
            ].map((p, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                  <p.icon size={30} color="#fff" />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 500, color: 'var(--navy)', marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.8 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="section-inner">
          <div className="cta-banner">
            <p className="section-eyebrow" style={{ color: 'var(--gold)' }}>Join Us</p>
            <h2 className="cta-title">Ready to take control<br /><em>of your health?</em></h2>
            <p className="cta-body">
              Join thousands of patients and healthcare providers who trust DiabeteCare 
              for comprehensive, compassionate diabetes management.
            </p>
            <div className="cta-actions">
              <Link to="/patient-login" style={{ textDecoration: 'none' }}>
                <button className="btn-primary">Patient Login <ArrowRight size={14} className="arrow-hover" /></button>
              </Link>
              <Link to="/doctor-login" style={{ textDecoration: 'none' }}>
                <button className="btn-outline">Doctor Login</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  /* ── FOOTER ── */
  const Footer = () => (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="logo-mark"><Heart size={16} color="#fff" /></div>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 500, color: '#fff' }}>DiabeteCare</span>
            </div>
            <p>Empowering healthier lives through compassionate diabetes care and intelligent monitoring technology.</p>
            <div className="footer-social">
              <a href="#" className="social-btn"><MessageCircle size={16} /></a>
              <a href="#" className="social-btn"><Heart size={16} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>For Patients</h5>
            <ul>
              <li>Getting Started</li>
              <li>Track Your Health</li>
              <li>Resources</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>For Doctors</h5>
            <ul>
              <li>Provider Portal</li>
              <li>Patient Management</li>
              <li>Clinical Tools</li>
              <li>Training</li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            <ul>
              <li>Help Centre</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 DiabeteCare. Supporting your journey to wellness.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <Styles />
      <Navigation />
      {currentPage === 'home' ? <HomePage /> : <AboutPage />}
      <Footer />
    </div>
  );
};

export default DiabetesCareWebsite;