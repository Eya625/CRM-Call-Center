import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/manager", label: "Manager", icon: IconGrid },
  { to: "/admin", label: "Admin", icon: IconUser },
];

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="10" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <path d="M8 22 L16 9 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M11.5 17.5 L20.5 17.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function Layout() {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const pageTitle = NAV_LINKS.find(l => location.pathname.startsWith(l.to))?.label || "CRM";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0C0C0E",
      fontFamily: "'Cabinet Grotesk', 'DM Sans', 'Segoe UI', sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Playfair+Display:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0C0C0E;
          --surface: #141416;
          --surface2: #1A1A1E;
          --surface3: #222228;
          --border: rgba(255,255,255,0.06);
          --border-hover: rgba(255,255,255,0.12);
          --accent: #F97316;
          --accent-dim: rgba(249,115,22,0.15);
          --accent-glow: rgba(249,115,22,0.25);
          --text-1: #F4F4F5;
          --text-2: #A1A1AA;
          --text-3: #52525B;
          --green: #10B981;
          --red: #EF4444;
          --yellow: #F59E0B;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 2px; }

        /* Nav link */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-2);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          position: relative;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .nav-item:hover { color: var(--text-1); background: rgba(255,255,255,0.05); }
        .nav-item.active { color: var(--accent); background: var(--accent-dim); }
        .nav-item.active .nav-dot {
          opacity: 1;
          transform: scale(1);
        }
        .nav-dot {
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%) scale(0.5);
          width: 18px;
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
        }

        /* Icon btn */
        .icon-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-2);
          transition: all 0.15s;
          position: relative;
        }
        .icon-btn:hover { border-color: var(--border-hover); color: var(--text-1); background: var(--surface3); }

        /* Avatar */
        .avatar {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #F97316, #EA580C);
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 700; color: white;
          cursor: pointer;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px rgba(249,115,22,0.2);
          transition: box-shadow 0.2s;
        }
        .avatar:hover { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px rgba(249,115,22,0.4); }

        /* Search bar */
        .search-wrap {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: border-color 0.15s, box-shadow 0.15s;
          cursor: text;
          width: 200px;
        }
        .search-wrap.focused {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
          width: 240px;
        }
        .search-wrap input {
          background: none; border: none; outline: none;
          font-size: 13px; color: var(--text-1);
          width: 100%; font-family: 'DM Sans', sans-serif;
        }
        .search-wrap input::placeholder { color: var(--text-3); }

        /* Page fade */
        .page-enter {
          animation: pageIn 0.3s cubic-bezier(.22,.68,0,1.2) both;
        }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Table styles */
        .crm-table { width: 100%; font-size: 13.5px; border-collapse: collapse; font-family: 'DM Sans', sans-serif; }
        .crm-table th {
          text-align: left; padding: 11px 18px;
          font-size: 11px; font-weight: 600; color: var(--text-3);
          letter-spacing: 0.08em; text-transform: uppercase;
          border-bottom: 1px solid var(--border);
        }
        .crm-table td { padding: 13px 18px; border-bottom: 1px solid var(--border); color: var(--text-1); vertical-align: middle; }
        .crm-table tbody tr { transition: background 0.12s; }
        .crm-table tbody tr:hover td { background: rgba(255,255,255,0.025); }
        .crm-table tbody tr:last-child td { border-bottom: none; }

        /* KPI */
        .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-bottom: 24px; }
        .kpi-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.15s, transform 0.15s;
          cursor: default;
        }
        .kpi-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: var(--accent-dim);
          transform: translate(30px, -30px);
          pointer-events: none;
        }
        .kpi-label { font-size: 11px; font-weight: 600; color: var(--text-3); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 10px; }
        .kpi-value { font-size: 30px; font-weight: 700; color: var(--text-1); line-height: 1; font-family: 'Playfair Display', Georgia, serif; }
        .kpi-trend { font-size: 11.5px; margin-top: 8px; display: flex; align-items: center; gap: 4px; }

        /* Badges */
        .badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
        }
        .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; display: block; }
        .badge-green  { background: rgba(16,185,129,0.12); color: #34D399; }
        .badge-orange { background: rgba(249,115,22,0.12); color: #FB923C; }
        .badge-yellow { background: rgba(245,158,11,0.12); color: #FCD34D; }
        .badge-red    { background: rgba(239,68,68,0.12); color: #F87171; }
        .badge-gray   { background: rgba(161,161,170,0.12); color: #A1A1AA; }

        /* Progress */
        .progress-wrap { display: flex; align-items: center; gap: 9px; }
        .progress-track { flex: 1; height: 4px; background: var(--surface3); border-radius: 10px; overflow: hidden; }
        .progress-fill {
          height: 4px; border-radius: 10px;
          background: linear-gradient(90deg, #F97316, #FF6B35);
          transition: width 0.5s cubic-bezier(.22,.68,0,1);
        }

        /* Btns */
        .btn {
          padding: 7px 14px; font-size: 12.5px; font-weight: 500;
          border-radius: 9px; cursor: pointer;
          border: 1px solid var(--border);
          background: var(--surface2); color: var(--text-2);
          transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .btn:hover { border-color: var(--border-hover); color: var(--text-1); background: var(--surface3); }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--accent); color: white; border: none;
          padding: 9px 18px; font-size: 13px; font-weight: 600;
          border-radius: 10px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          box-shadow: 0 4px 16px var(--accent-glow);
        }
        .btn-primary:hover { background: #EA580C; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(249,115,22,0.4); }
        .btn-primary:active { transform: translateY(0); }

        /* Card */
        .crm-card {
          background: var(--surface);
          border-radius: 16px;
          border: 1px solid var(--border);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .crm-card-header {
          padding: 15px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .crm-card-title {
          font-size: 14px; font-weight: 700; color: var(--text-1);
          font-family: 'Playfair Display', Georgia, serif;
        }

        /* Filter */
        .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 18px; }
        .crm-select {
          padding: 7px 12px; font-size: 13px;
          border: 1px solid var(--border); border-radius: 9px;
          background: var(--surface2); color: var(--text-1);
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.15s;
          cursor: pointer;
        }
        .crm-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

        /* Avatar sm */
        .avatar-sm {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9.5px; font-weight: 700; color: white;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        /* Tabs */
        .page-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
        .page-tab {
          padding: 9px 16px; font-size: 13px; font-weight: 500;
          color: var(--text-3); cursor: pointer; border: none;
          background: none; border-bottom: 2px solid transparent;
          margin-bottom: -1px; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .page-tab:hover { color: var(--text-2); }
        .page-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 200; animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal-box {
          background: var(--surface); border-radius: 20px;
          padding: 28px; width: 100%; max-width: 440px;
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          animation: slideUp 0.22s cubic-bezier(.22,.68,0,1.2);
        }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        .modal-title { font-size: 17px; font-weight: 700; color: var(--text-1); font-family: 'Playfair Display', Georgia, serif; margin-bottom: 20px; }
        .modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }
        .form-field { margin-bottom: 14px; }
        .form-label { display: block; font-size: 11.5px; font-weight: 600; color: var(--text-3); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }
        .form-control {
          width: 100%; padding: 10px 13px; font-size: 13.5px;
          border: 1px solid var(--border); border-radius: 10px;
          background: var(--surface2); color: var(--text-1);
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-control:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
        .form-control::placeholder { color: var(--text-3); }
        textarea.form-control { resize: vertical; min-height: 80px; }

        /* Notif dot */
        .notif-pip {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); border: 1.5px solid var(--surface);
        }

        /* Divider */
        .vdivider { width: 1px; height: 22px; background: var(--border); }

        /* Stagger animation children */
        .stagger > * { animation: pageIn 0.35s cubic-bezier(.22,.68,0,1.2) both; }
        .stagger > *:nth-child(1) { animation-delay: 0.04s; }
        .stagger > *:nth-child(2) { animation-delay: 0.08s; }
        .stagger > *:nth-child(3) { animation-delay: 0.12s; }
        .stagger > *:nth-child(4) { animation-delay: 0.16s; }
        .stagger > *:nth-child(5) { animation-delay: 0.2s; }
      `}</style>

      {/* ── TOP NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        background: "rgba(20,20,22,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <IconLogo />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#F4F4F5",
              letterSpacing: "-0.01em",
            }}>
              CRM<span style={{ color: "#F97316" }}>Pro</span>
            </span>
            <span style={{ fontSize: "10px", color: "rgba(161,161,170,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Dashboard
            </span>
          </div>
        </div>

        {/* Search + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            className={`search-wrap ${searchFocused ? "focused" : ""}`}
            style={{ transition: "width 0.25s cubic-bezier(.22,.68,0,1), border-color 0.15s, box-shadow 0.15s" }}
          >
            <IconSearch />
            <input
              placeholder="Rechercher..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchFocused && (
              <span style={{ fontSize: "10px", color: "rgba(161,161,170,0.4)", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>⌘K</span>
            )}
          </div>

          <div style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.06)", margin: "0 6px" }} />

          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <Icon />
              {label}
              <span className="nav-dot" />
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="icon-btn" aria-label="Paramètres">
            <IconSettings />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <div className="notif-pip" />
            <IconBell />
          </button>
          <div className="vdivider" />
          <div className="avatar">MG</div>
          <div style={{ lineHeight: 1.3 }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#F4F4F5" }}>Manager</p>
            <p style={{ fontSize: "10.5px", color: "#10B981", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              En ligne
            </p>
          </div>
        </div>
      </nav>

      {/* ── BREADCRUMB ──────────────────────────────────────────── */}
      <div style={{
        background: "rgba(20,20,22,0.6)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        padding: "8px 32px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{ fontSize: "11.5px", color: "#52525B" }}>CRMPro</span>
        <span style={{ fontSize: "11.5px", color: "#3F3F46" }}>
          <IconChevron />
        </span>
        <span style={{
          fontSize: "11.5px",
          fontWeight: 600,
          color: "#F97316",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}>
          {pageTitle}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#10B981",
            boxShadow: "0 0 6px rgba(16,185,129,0.5)",
            display: "inline-block",
          }} />
          <span style={{ fontSize: "11px", color: "#52525B" }}>Système opérationnel</span>
        </div>
      </div>

      {/* ── PAGE CONTENT ─────────────────────────────────────────── */}
      <main
        key={location.pathname}
        className="page-enter"
        style={{ padding: "30px 32px", maxWidth: "1400px", width: "100%", margin: "0 auto", flex: 1 }}
      >
        <Outlet />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPORTS UTILITAIRES — utilisables dans les pages filles
──────────────────────────────────────────────── */

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "26px" }}>
      <div>
        <h1 style={{
          fontSize: "24px", fontWeight: 700, color: "#F4F4F5",
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: "-0.01em", marginBottom: "4px",
        }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "13px", color: "#71717A" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({ label, value, trend, trendUp, color = "#F97316" }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color }}>{value}</div>
      {trend && (
        <div className="kpi-trend" style={{ color: trendUp ? "#34D399" : "#F87171" }}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  );
}

export function Badge({ children, variant = "gray" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function ProgressBar({ value }) {
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span style={{ fontSize: "11.5px", color: "#71717A", minWidth: "30px" }}>{value}%</span>
    </div>
  );
}

export function CrmCard({ title, action, children }) {
  return (
    <div className="crm-card">
      <div className="crm-card-header">
        <span className="crm-card-title">{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}