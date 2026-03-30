import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/* ══════════════════════════════════════
   ICONS
══════════════════════════════════════ */
const IconHeadset = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconChevron = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const IconActivity = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconTarget = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

/* ══════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════ */
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(t.getHours()).padStart(2, "0");
  const m = String(t.getMinutes()).padStart(2, "0");
  const s = String(t.getSeconds()).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "20px", fontWeight: 400,
        color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1,
      }}>
        <span>{h}</span>
        <span style={{ color: "#F97316", animation: "colonBlink 1s step-end infinite" }}>:</span>
        <span>{m}</span>
        <span style={{ color: "#F97316", animation: "colonBlink 1s step-end infinite" }}>:</span>
        <span style={{ color: "#94A3B8", fontSize: "15px" }}>{s}</span>
      </div>
      <div style={{
        fontSize: "9px", fontWeight: 800, color: "#F97316",
        letterSpacing: "0.12em", textTransform: "uppercase",
        marginTop: "3px", fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        Real-Time Data
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   PAGE LABELS
══════════════════════════════════════ */
const PAGE_LABELS = {
  "/manager": "Manager",
  "/admin": "Admin",
  "/dashboard": "Dashboard",
  "/agents": "Agents",
  "/campaigns": "Campagnes",
  "/reports": "Rapports",
};

/* ══════════════════════════════════════
   LAYOUT
══════════════════════════════════════ */
export default function Layout() {
  const location = useLocation();
  const [searchVal, setSearchVal] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pageTitle =
    PAGE_LABELS[location.pathname] ||
    Object.entries(PAGE_LABELS).find(([k]) => location.pathname.startsWith(k))?.[1] ||
    "Dashboard";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#F8FAFC",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: "#0F172A",
      backgroundImage: "radial-gradient(at 0% 0%, rgba(249,115,22,0.04) 0%, transparent 50%)",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,100;1,9..144,300;1,9..144,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --accent: #F97316;
          --accent-b: #EA580C;
          --ink: #0F172A;
          --ink2: #334155;
          --ink3: #64748B;
          --ink4: #94A3B8;
          --ink5: #CBD5E1;
          --surface: #FFFFFF;
          --surface2: #F8FAFC;
          --surface3: #F1F5F9;
          --border: #E2E8F0;
          --green: #10B981;
          --radius: 12px;
          --radius-sm: 8px;
          --radius-lg: 16px;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }

        @keyframes colonBlink  { 0%,49%{opacity:1} 50%,100%{opacity:0.2} }
        @keyframes pulseDot    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.25);opacity:.7} }
        @keyframes pageIn      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes accentLine  { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes notifIn     { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes slideUp     { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }

        .page-in { animation: pageIn 0.35s cubic-bezier(.22,.68,0,1.2) both; }

        .search-box {
          display: flex; align-items: center; gap: 9px;
          background: #F1F5F9; border: 1px solid #E2E8F0;
          padding: 9px 16px; border-radius: 100px; width: 280px;
          transition: all 0.22s;
        }
        .search-box.focused {
          background: white; border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12); width: 320px;
        }
        .search-box input {
          background: none; border: none; outline: none; width: 100%;
          font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink);
        }
        .search-box input::placeholder { color: var(--ink5); }

        .i-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: #F8FAFC; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--ink3); position: relative;
          transition: all 0.15s; flex-shrink: 0;
        }
        .i-btn:hover { background: white; border-color: #CBD5E1; color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,0.07); transform: translateY(-1px); }
        .i-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(249,115,22,0.06); }

        .notif-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 316px; background: white;
          border: 1px solid var(--border); border-radius: 16px;
          box-shadow: 0 20px 56px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);
          animation: notifIn 0.2s cubic-bezier(.22,.68,0,1.2) both;
          z-index: 300; overflow: hidden;
        }
        .notif-item {
          display: flex; align-items: flex-start; gap: 11px;
          padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.04);
          cursor: pointer; transition: background 0.1s;
        }
        .notif-item:hover { background: #F8FAFC; }
        .notif-item:last-child { border-bottom: none; }

        .crm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .crm-table th {
          text-align: left; padding: 10px 16px;
          font-size: 9.5px; font-weight: 800; color: var(--ink4);
          letter-spacing: 0.12em; text-transform: uppercase;
          border-bottom: 1px solid var(--border); background: #FAFAFA;
        }
        .crm-table td { padding: 13px 16px; border-bottom: 1px solid rgba(0,0,0,0.04); color: var(--ink); vertical-align: middle; }
        .crm-table tbody tr { transition: background 0.1s; }
        .crm-table tbody tr:hover td { background: rgba(249,115,22,0.025); }
        .crm-table tbody tr:last-child td { border-bottom: none; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; margin-bottom: 28px; }
        .kpi-card {
          background: white; border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px 22px;
          position: relative; overflow: hidden;
          transition: all 0.2s; cursor: default;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .kpi-card:hover { border-color: rgba(249,115,22,0.2); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(249,115,22,0.07), 0 2px 8px rgba(0,0,0,0.04); }
        .kpi-label { font-size: 9.5px; font-weight: 800; color: var(--ink4); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .kpi-value { font-size: 38px; font-weight: 700; color: var(--ink); line-height: 1; font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.03em; }
        .kpi-trend { font-size: 11px; margin-top: 11px; display: flex; align-items: center; gap: 6px; }

        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; }
        .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
        .badge-green  { background: rgba(16,185,129,0.08);  color: #059669; border: 1px solid rgba(16,185,129,0.15); }
        .badge-orange { background: rgba(249,115,22,0.08);  color: #C2530A; border: 1px solid rgba(249,115,22,0.15); }
        .badge-yellow { background: rgba(217,119,6,0.08);   color: #D97706; border: 1px solid rgba(217,119,6,0.15); }
        .badge-red    { background: rgba(220,38,38,0.08);   color: #DC2626; border: 1px solid rgba(220,38,38,0.15); }
        .badge-gray   { background: rgba(0,0,0,0.04);       color: #64748B; border: 1px solid rgba(0,0,0,0.07); }
        .badge-blue   { background: rgba(37,99,235,0.08);   color: #2563EB; border: 1px solid rgba(37,99,235,0.14); }

        .progress-wrap { display: flex; align-items: center; gap: 10px; }
        .progress-track { flex: 1; height: 5px; background: var(--surface3); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 5px; border-radius: 10px; background: linear-gradient(90deg, #F97316, #FDBA74); transition: width 0.6s cubic-bezier(.22,.68,0,1); }

        .btn { padding: 7px 15px; font-size: 12.5px; font-weight: 600; border-radius: var(--radius-sm); cursor: pointer; border: 1px solid var(--border); background: white; color: var(--ink2); transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; display: inline-flex; align-items: center; gap: 6px; }
        .btn:hover { border-color: #CBD5E1; color: var(--ink); background: var(--surface3); transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .btn-primary { display: inline-flex; align-items: center; gap: 7px; background: var(--accent); color: white; border: none; padding: 10px 24px; font-size: 13px; font-weight: 700; border-radius: 100px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; box-shadow: 0 4px 16px rgba(249,115,22,0.3); }
        .btn-primary:hover { background: var(--accent-b); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,0.38); }
        .btn-primary:active { transform: translateY(0); }

        .btn-dark { display: inline-flex; align-items: center; gap: 7px; background: var(--ink); color: white; border: none; padding: 10px 24px; font-size: 13px; font-weight: 700; border-radius: 100px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; box-shadow: 0 4px 14px rgba(15,23,42,0.18); }
        .btn-dark:hover { background: #1E293B; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.25); }

        .crm-card { background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); transition: box-shadow 0.2s; }
        .crm-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
        .crm-card-header { padding: 15px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: #FAFAFA; }
        .crm-card-title { font-size: 13.5px; font-weight: 700; color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; }

        .crm-select { padding: 7px 13px; font-size: 12.5px; border: 1px solid var(--border); border-radius: 100px; background: white; color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.15s; cursor: pointer; font-weight: 500; }
        .crm-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }

        .page-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
        .page-tab { padding: 10px 17px; font-size: 13px; font-weight: 600; color: var(--ink4); cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .page-tab:hover { color: var(--ink3); }
        .page-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 200; animation: fadeIn 0.15s ease; }
        .modal-box { background: white; border-radius: 20px; padding: 30px; width: 100%; max-width: 460px; border: 1px solid var(--border); box-shadow: 0 32px 80px rgba(0,0,0,0.14); animation: slideUp 0.24s cubic-bezier(.22,.68,0,1.2); }
        .modal-title { font-size: 20px; font-weight: 700; font-family: 'Fraunces', Georgia, serif; color: var(--ink); margin-bottom: 22px; letter-spacing: -0.02em; }
        .modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--border); }
        .form-field { margin-bottom: 15px; }
        .form-label { display: block; font-size: 10px; font-weight: 800; color: var(--ink4); margin-bottom: 7px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif; }
        .form-control { width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface3); color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.15s; }
        .form-control:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(249,115,22,0.12); background: white; }
        .form-control::placeholder { color: var(--ink5); }

        .stagger > * { animation: pageIn 0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .stagger > *:nth-child(1) { animation-delay: 0.04s; }
        .stagger > *:nth-child(2) { animation-delay: 0.08s; }
        .stagger > *:nth-child(3) { animation-delay: 0.12s; }
        .stagger > *:nth-child(4) { animation-delay: 0.16s; }
        .stagger > *:nth-child(5) { animation-delay: 0.20s; }
      `}</style>

      {/* ══════════════════════════════════════
          TOP NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        height: "76px",
        background: "rgba(255,255,255,0.93)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}>
        {/* Accent bottom line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, #F97316 0%, #FDBA74 50%, transparent 100%)",
          transformOrigin: "left",
          animation: "accentLine 1s cubic-bezier(.22,.68,0,1) forwards",
        }} />

        {/* LEFT — Brand + pills */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Logo mark */}
          <div style={{
            width: "44px", height: "44px", borderRadius: "13px",
            background: "#0F172A",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "rgba(255,255,255,0.05)" }} />
            <IconHeadset />
          </div>

          {/* Wordmark */}
          <div style={{ paddingLeft: "18px", marginLeft: "18px", borderLeft: "1px solid #E2E8F0" }}>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "22px", fontWeight: 700,
              color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1,
            }}>
              VICI<span style={{ color: "#F97316", fontStyle: "italic", fontWeight: 100 }}>Elite</span>
            </div>
            <div style={{
              fontSize: "9px", fontWeight: 800, color: "#94A3B8",
              letterSpacing: "0.2em", textTransform: "uppercase",
              marginTop: "4px", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Call Center</div>
          </div>

          {/* Separator */}
          <div style={{ width: "1px", height: "28px", background: "#E2E8F0", margin: "0 20px" }} />

          {/* Stat pills */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              
              { icon: <IconTarget />, value: "02", label: "campagnes", bg: "rgba(249,115,22,0.1)" },
            ].map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                padding: "5px 12px 5px 8px", borderRadius: "100px",
              }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "6px",
                  background: p.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{p.icon}</div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 500, color: "#0F172A", lineHeight: 1 }}>{p.value}</div>
                  <div style={{ fontSize: "9px", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>{p.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Search */}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <div className={`search-box ${searchFocused ? "focused" : ""}`}>
            <IconSearch />
            <input
              placeholder="Rechercher clients, agents, campagnes…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchFocused && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px", color: "#CBD5E1",
                background: "#F1F5F9", padding: "2px 7px",
                borderRadius: "5px", border: "1px solid #E2E8F0",
                flexShrink: 0,
              }}>⌘K</span>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* System badge */}
          <div style={{
            background: "#F1F5F9", border: "1px solid #E2E8F0",
            padding: "5px 13px", borderRadius: "100px",
            display: "flex", alignItems: "center", gap: "7px",
            fontSize: "10px", fontWeight: 800, color: "#475569",
            letterSpacing: "0.05em", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#10B981", boxShadow: "0 0 0 3px rgba(16,185,129,0.18)",
              animation: "pulseDot 2s infinite", flexShrink: 0,
            }} />
            SYSTEM LIVE
          </div>

          <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />

          <LiveClock />

          <button className="i-btn" title="Paramètres"><IconSettings /></button>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              className={`i-btn ${notifOpen ? "active" : ""}`}
              onClick={() => setNotifOpen(o => !o)}
            >
              <div style={{
                position: "absolute", top: "-3px", right: "-3px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#F97316", border: "2px solid white",
              }} />
              <IconBell />
            </button>

            {notifOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setNotifOpen(false)} />
                <div className="notif-panel">
                  <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifications</span>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#F97316", cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tout marquer</span>
                  </div>
                  {[
                    { bg: "#FEF2F2", label: "Appel manqué", sub: "Client #4821 — il y a 3 min", icon: "📞" },
                    { bg: "#FFF7ED", label: "Rapport prêt", sub: "Campagne Été 2025 — il y a 12 min", icon: "📊" },
                    { bg: "#F0FDF4", label: "Objectif atteint", sub: "Agent Karim: 98% satisfaction", icon: "✅" },
                  ].map((n, i) => (
                    <div key={i} className="notif-item">
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{n.icon}</div>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n.label}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n.sub}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "11px 16px", textAlign: "center", background: "#FAFAFA", borderTop: "1px solid #E2E8F0" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>Voir toutes →</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User pill */}
          <div style={{
            background: "#0F172A", color: "white",
            padding: "5px 5px 5px 16px", borderRadius: "100px",
            display: "flex", alignItems: "center", gap: "11px",
            boxShadow: "0 8px 20px rgba(15,23,42,0.15)",
          }}>
            <span style={{ fontSize: "12.5px", fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>A. Dabbebi</span>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, #F97316, #FB923C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 800, color: "white",
              letterSpacing: "0.05em", flexShrink: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>AD</div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          SUBBAR
      ══════════════════════════════════════ */}
      <div style={{
        height: "38px",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.055)",
        padding: "0 48px",
        display: "flex", alignItems: "center", gap: "7px",
      }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.04em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>VICIElite</span>
        <IconChevron />
        <span style={{ fontSize: "11px", fontWeight: 800, color: "#F97316", letterSpacing: "0.04em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pageTitle}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 0 2px rgba(16,185,129,0.2)" }} />
            <span style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Système opérationnel</span>
          </div>
          <div style={{ height: "13px", width: "1px", background: "#E2E8F0" }} />
          <div style={{ height: "13px", width: "1px", background: "#E2E8F0" }} />
          <span style={{ fontSize: "9px", fontWeight: 800, color: "#CBD5E1", letterSpacing: "0.12em", textTransform: "uppercase", background: "#F1F5F9", padding: "2px 8px", borderRadius: "20px", border: "1px solid #E2E8F0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>v1.0.0</span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════════ */}
      <main
        key={location.pathname}
        className="page-in"
        style={{
          padding: "36px 48px", flex: 1,
          background: "#F8FAFC",
          backgroundImage: "radial-gradient(at 100% 0%, rgba(249,115,22,0.025) 0%, transparent 50%)",
        }}
      >
        <Outlet />
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{
        background: "#0F172A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "16px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #F97316, #EA580C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconHeadset />
          </div>
          <span style={{ fontSize: "12px", color: "#334155", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>VICIElite — Control Center Platform</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {["Support", "Documentation", "Changelog"].map((link, i) => (
            <span key={i}
              style={{ fontSize: "11px", color: "#1E293B", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "#F97316"}
              onMouseLeave={e => e.target.style.color = "#1E293B"}
            >{link}</span>
          ))}
          <div style={{ height: "12px", width: "1px", background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontSize: "11px", color: "#1E293B", fontFamily: "'JetBrains Mono', monospace" }}>© 2025 VICIElite</span>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════
   EXPORTED COMPONENTS
══════════════════════════════════════ */

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
      <div>
        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "30px", fontWeight: 700,
          color: "#0F172A", letterSpacing: "-0.03em",
          marginBottom: "5px", lineHeight: 1.15,
        }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: "13.5px", color: "#64748B", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({ label, value, trend, trendUp, color = "#0F172A" }) {
  return (
    <div className="kpi-card">
      <div style={{
        position: "absolute", top: "16px", right: "18px",
        width: "8px", height: "8px", borderRadius: "50%",
        background: trendUp ? "#10B981" : "#F97316",
        boxShadow: `0 0 0 3px ${trendUp ? "rgba(16,185,129,0.15)" : "rgba(249,115,22,0.15)"}`,
      }} />
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color }}>{value}</div>
      {trend && (
        <div className="kpi-trend">
          <span style={{
            background: trendUp ? "rgba(16,185,129,0.08)" : "rgba(220,38,38,0.08)",
            color: trendUp ? "#059669" : "#DC2626",
            padding: "2px 9px", borderRadius: "100px",
            fontSize: "11px", fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            border: `1px solid ${trendUp ? "rgba(16,185,129,0.15)" : "rgba(220,38,38,0.15)"}`,
          }}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
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
      <span style={{ fontSize: "11px", color: "#94A3B8", minWidth: "34px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{value}%</span>
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