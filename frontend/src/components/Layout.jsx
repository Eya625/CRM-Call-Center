import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, memo } from "react";

/* ─── CONSTANTS & CONFIG ─────────────────────────────────── */
const PAGE_LABELS = {
  "/manager": "Manager",
  "/admin": "Admin",
  "/dashboard": "Dashboard",
  "/agents": "Agents",
  "/campaigns": "Campagnes",
  "/reports": "Rapports",
};

// L'ADN d'origine respecté mais transcendé
const LOGO_GRADIENT = "linear-gradient(135deg, #FF1361 0%, #9B51E0 50%, #00F0FF 100%)"; 
const PINK_GLOW = "#FF1361";

const NOTIFICATIONS_DATA = [
  { bg: "rgba(255,19,97,0.08)", label: "Appel manqué", sub: "Client #4821 — il y a 3 min", icon: "📞" },
  { bg: "rgba(0,240,255,0.1)", label: "Rapport prêt", sub: "Campagne Été 2026 — il y a 12 min", icon: "📊" },
  { bg: "rgba(155,81,224,0.08)", label: "Objectif atteint", sub: "Agent Karim: 98% satisfaction", icon: "✅" },
];

/* ─── ICONS (Memoized with Premium Stroke) ─────────────────── */
const IcoSearch = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
));

const IcoBell = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
));

const IcoSettings = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
));

const IcoChevron = memo(() => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
));

/* ─── LIVE CLOCK ─────────────────────────────────────────── */
function LiveClock() {
  const [t, setT] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const p = (n) => String(n).padStart(2, "0");

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "12px", color: "#0F172A",
      padding: "8px 16px", borderRadius: "30px",
      background: "rgba(255, 255, 255, 0.75)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      letterSpacing: "0.05em",
      boxShadow: "0 10px 20px -5px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
      backdropFilter: "blur(20px)",
      fontWeight: "700"
    }}>
      {p(t.getHours())}
      <span style={{ color: "#9B51E0", margin: "0 2px", animation: "pulseDot 1s infinite" }}>:</span>
      {p(t.getMinutes())}
      <span style={{ color: "#9B51E0", margin: "0 2px", animation: "pulseDot 1s infinite" }}>:</span>
      <span style={{ opacity: 0.5 }}>{p(t.getSeconds())}</span>
    </div>
  );
}

/* ─── STYLES (Futuristic Glassmorphism) ───────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:      #F4F7FC; 
      --surface: rgba(255, 255, 255, 0.85);
      --text:    #0F172A;
      --muted:   #64748B;
      --pink:    #FF1361;
      --purple:  #9B51E0;
      --cyan:    #00F0FF;
      --grad:    linear-gradient(135deg, #FF1361, #9B51E0, #00F0FF);
    }

    body {
      background-color: var(--bg);
      overflow-x: hidden;
      color: var(--text);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(155, 81, 224, 0.15); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(155, 81, 224, 0.3); }

    @keyframes pageIn   { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes notifIn  { from { opacity: 0; transform: translateY(-15px) scale(0.95); } to { opacity: 1; transform: none; } }
    @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

    .page-in { animation: pageIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

    /* Barre de recherche "Floating" */
    .search-box {
      display: flex; align-items: center; gap: 12px;
      background: rgba(255, 255, 255, 0.7); 
      border: 1px solid rgba(226, 232, 240, 0.6);
      padding: 0 18px; border-radius: 30px; width: 300px; height: 44px;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.02);
      backdrop-filter: blur(10px);
    }
    .search-box.focused { 
      border-color: rgba(155, 81, 224, 0.4); 
      background: #FFFFFF;
      width: 400px; 
      box-shadow: 0 20px 25px -5px rgba(155, 81, 224, 0.05), 0 0 0 4px rgba(155, 81, 224, 0.02);
    }
    .search-box input {
      background: none; border: none; outline: none; width: 100%;
      font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text); font-weight: 600;
    }
    .search-box input::placeholder { color: #94A3B8; }

    /* Boutons de la Navbar Capsule */
    .i-btn {
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(226, 232, 240, 0.6);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #475569; position: relative;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.02);
    }
    .i-btn:hover { 
      border-color: #9B51E0; 
      color: #9B51E0;
      transform: translateY(-3px);
      box-shadow: 0 15px 20px -5px rgba(155, 81, 224, 0.15);
    }
    .i-btn:active { transform: translateY(0px); }

    /* Panneau de notifications Cyber */
    .notif-panel {
      position: absolute; top: calc(100% + 12px); right: 0; width: 380px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 24px; 
      box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1);
      animation: notifIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; z-index: 300; overflow: hidden;
    }
    .notif-item {
      display: flex; align-items: flex-start; gap: 16px;
      padding: 18px 24px; border-bottom: 1px solid rgba(241, 245, 249, 0.8);
      cursor: pointer; transition: all 0.3s;
    }
    .notif-item:hover { background: rgba(255, 255, 255, 0.5); transform: translateX(5px); }

    /* Badges unifiés Capsule */
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 30px;
      font-size: 11px; font-weight: 800;
      letter-spacing: 0.05em; text-transform: uppercase;
    }
    .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .badge-pink   { background: rgba(255,19,97,0.06);  color: #FF1361; border: 1px solid rgba(255,19,97,0.1); }
    .badge-purple { background: rgba(155,81,224,0.06); color: #9B51E0; border: 1px solid rgba(155,81,224,0.1); }
    .badge-cyan   { background: rgba(0,240,255,0.1);  color: #00B4D8; border: 1px solid rgba(0,240,255,0.2); }

    /* Cartes KPI Acrylic "Waw" */
    .kpi-card {
      background: var(--surface); 
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 24px; padding: 36px;
      position: relative; overflow: hidden;
      backdrop-filter: blur(15px);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6);
    }
    .kpi-card:hover { 
      border-color: rgba(155, 81, 224, 0.3); 
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 30px 40px -15px rgba(155, 81, 224, 0.08);
    }
    .kpi-card::before {
      content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
      opacity: 0; transition: opacity 0.6s; pointer-events: none;
    }
    .kpi-card:hover::before { opacity: 1; }
    
    .kpi-label { font-size: 11px; font-weight: 900; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 16px; }
    .kpi-value { font-size: 40px; font-weight: 900; color: var(--text); line-height: 1; font-family: 'JetBrains Mono', monospace; letter-spacing: -0.05em; }
    
    /* CRM Cards */
    .crm-card { 
      background: var(--surface); 
      border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.7); 
      backdrop-filter: blur(15px);
      overflow: hidden; margin-bottom: 32px;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.02);
      transition: all 0.5s ease;
    }
    .crm-card:hover {
      box-shadow: 0 30px 50px -20px rgba(0,0,0,0.05);
      border-color: rgba(0, 240, 255, 0.2);
    }
    .crm-card-header { padding: 28px 36px; border-bottom: 1px solid rgba(241, 245, 249, 0.8); display: flex; align-items: center; justify-content: space-between; }
    .crm-card-title { font-size: 16px; font-weight: 900; color: var(--text); letter-spacing: -0.02em; }

    /* Profil Capsule */
    .user-profile-btn {
      display: flex; align-items: center; gap: 14px;
      padding: 6px 6px 6px 20px; border-radius: 30px;
      background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(226, 232, 240, 0.6);
      cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.02);
      backdrop-filter: blur(10px);
    }
    .user-profile-btn:hover {
      border-color: #00F0FF;
      background: #FFFFFF;
      transform: translateY(-3px);
      box-shadow: 0 15px 20px -5px rgba(0, 240, 255, 0.1);
    }
  `}</style>
);

/* ─── MAIN LAYOUT ────────────────────────────────────────── */
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
      background: "#F4F7FC",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: "#0F172A",
      position: "relative",
      overflow: "hidden"
    }}>
      
      <GlobalStyles />

      {/* ── AMBIENT GLOW BACKDROPS (The "Innovante" touch) ────── */}
      <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", background: "rgba(255, 19, 97, 0.08)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none", animation: "floating 8s infinite ease-in-out" }} />
      <div style={{ position: "absolute", bottom: "-100px", right: "-100px", width: "500px", height: "500px", background: "rgba(0, 240, 255, 0.08)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none", animation: "floating 10s infinite ease-in-out reverse" }} />

      {/* ── Navbar Premium Capsule ────────────────────────────── */}
      <nav style={{
        height: "80px",
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyBetween: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        
        {/* Left — Logo Matching Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: LOGO_GRADIENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: "900", color: "white", letterSpacing: "1px",
            flexShrink: 0,
            boxShadow: `0 12px 24px -6px rgba(155, 81, 224, 0.5), inset 0 0 0 1px rgba(255,255,255,0.3)`,
          }}>
            TCC
          </div>

          <div>
            <div style={{ fontSize: "17px", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.03em" }}>
              TCC{" "}
              <span style={{ background: LOGO_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                NEXUS
              </span>
            </div>
            <div style={{ fontSize: "9px", color: "#94A3B8", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px" }}>
              Connect · Manage · Grow
            </div>
          </div>
        </div>

        {/* Center — search */}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <div className={`search-box ${searchFocused ? "focused" : ""}`}>
            <IcoSearch />
            <input
              placeholder="Rechercher avec l'intelligence Nexus..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <LiveClock />

          <button className="i-btn" title="Paramètres"><IcoSettings /></button>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              className="i-btn"
              onClick={() => setNotifOpen((o) => !o)}
            >
              <div style={{
                position: "absolute", top: "11px", right: "11px",
                width: "6px", height: "6px", borderRadius: "50%",
                background: PINK_GLOW,
                boxShadow: `0 0 8px ${PINK_GLOW}`,
              }} />
              <IcoBell />
            </button>

            {notifOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setNotifOpen(false)} />
                <div className="notif-panel">
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(241, 245, 249, 0.8)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#0F172A" }}>Centre de Contrôle</span>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: PINK_GLOW, cursor: "pointer", letterSpacing: "0.05em" }}>MARQUER LU</span>
                  </div>
                  {NOTIFICATIONS_DATA.map((n, i) => (
                    <div key={i} className="notif-item">
                      <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                        {n.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>{n.label}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", fontWeight: "500" }}>{n.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User pill */}
          <div className="user-profile-btn">
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>
              A. Dabbebi
            </span>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: LOGO_GRADIENT,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "900", color: "white", flexShrink: 0,
              boxShadow: `0 4px 10px rgba(155, 81, 224, 0.3)`,
            }}>
              AD
            </div>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb Bar Cyber ───────────────────────────────── */}
      <div style={{
        height: "48px",
        background: "rgba(255, 255, 255, 0.3)",
        borderBottom: "1px solid rgba(241, 245, 249, 0.6)",
        padding: "0 40px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <span style={{ fontSize: "11px", fontWeight: "900", color: "#94A3B8", letterSpacing: "0.1em" }}>NEXUS</span>
        <IcoChevron />
        <span style={{
          fontSize: "11px", fontWeight: "900",
          background: LOGO_GRADIENT,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "0.1em"
        }}>
          {pageTitle.toUpperCase()}
        </span>
      </div>

      {/* ── Main content (Vibrant background radial gradients) ─ */}
      <main
        key={location.pathname}
        className="page-in"
        style={{
          padding: "40px",
          flex: 1,
          position: "relative",
          zIndex: 1
        }}
      >
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(241, 245, 249, 0.6)",
        padding: "24px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 1
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "7px",
            background: LOGO_GRADIENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: "900", color: "white",
          }}>T</div>
          <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "800", letterSpacing: "0.02em" }}>
            TCC Nexus
          </span>
        </div>
        <div>
          <span style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700" }}>
            © 2026 TCC Nexus · ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ─── EXPORTED SHARED COMPONENTS ─────────────────────── */

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
      <div>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.04em", marginBottom: "6px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "14px", color: "#64748B", fontWeight: "600", letterSpacing: "-0.01em" }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({ label, value, trend, trendUp }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {trend && (
        <div style={{ marginTop: "16px" }}>
          <span className={`badge ${trendUp ? "badge-cyan" : "badge-pink"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        </div>
      )}
    </div>
  );
}

export function Badge({ children, variant = "purple" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function CrmCard({ title, action, children }) {
  return (
    <div className="crm-card">
      <div className="crm-card-header">
        <span className="crm-card-title">{title}</span>
        {action}
      </div>
      <div style={{ padding: "36px" }}>
        {children}
      </div>
    </div>
  );
}