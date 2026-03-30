import { useState } from "react";

/* ─── DATA ─────────────────────────────────────────────────── */
const initialAgents = [
  { id: 1, name: "Agent Ali",   login: "ali",   pass: "1234", status: "En appel",   duration: "05:23", calls: 12, aht: "04:10" },
  { id: 2, name: "Agent Sarra", login: "sarra", pass: "1234", status: "Disponible", duration: "00:45", calls: 8,  aht: "03:50" },
  { id: 3, name: "Agent Mehdi", login: "mehdi", pass: "1234", status: "En pause",   duration: "02:10", calls: 5,  aht: "05:00" },
  { id: 4, name: "Agent Ines",  login: "ines",  pass: "1234", status: "En appel",   duration: "07:33", calls: 15, aht: "04:30" },
];
const initialCampaigns = [
  { id: 1, name: "Campagne Été 2025", status: "Active",   total: 500, traite: 188 },
  { id: 2, name: "Relance Clients",   status: "En pause", total: 200, traite: 111 },
  { id: 3, name: "Nouveaux Leads",    status: "Active",   total: 150, traite: 0   },
];
const initialLeads = [
  { id: 1, campId: 1, nom: "Benali",   prenom: "Mohamed", tel: "0612345678", adresse: "12 rue Habib Bourguiba, Tunis", status: "OK",               comment: "Intéressé, rappeler lundi", agent: "Agent Ali"   },
  { id: 2, campId: 1, nom: "Chahed",   prenom: "Fatma",   tel: "0698765432", adresse: "5 av. de Carthage, Sfax",      status: "Hors cible",        comment: "Trop jeune",               agent: "Agent Sarra" },
  { id: 3, campId: 2, nom: "Trabelsi", prenom: "Karim",   tel: "0623456789", adresse: "8 rue Ibn Khaldoun, Sousse",   status: "Answering Machine", comment: "Pas répondu x2",           agent: "Agent Ali"   },
  { id: 4, campId: 1, nom: "Riahi",    prenom: "Leila",   tel: "0634567890", adresse: "3 rue de la Liberté, Bizerte", status: "OK",               comment: "Très intéressée",          agent: "Agent Ines"  },
  { id: 5, campId: 3, nom: "Hamdi",    prenom: "Sami",    tel: "0645678901", adresse: "17 rue des Roses, Nabeul",     status: "Do Not Call",      comment: "Ne pas rappeler",          agent: "Agent Mehdi" },
  { id: 6, campId: 2, nom: "Miled",    prenom: "Amira",   tel: "0656789012", adresse: "22 av. Habib Thameur, Tunis",  status: "OK",               comment: "Rendez-vous pris",         agent: "Agent Sarra" },
];
const LEAD_STATUSES = ["OK", "Hors cible", "Answering Machine", "Do Not Call"];

const AVATAR_COLORS = [
  "linear-gradient(135deg,#F97316,#EA580C)",
  "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#3B82F6,#2563EB)",
  "linear-gradient(135deg,#EC4899,#DB2777)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
];
const avatarColor = (name) => AVATAR_COLORS[(name || "A").charCodeAt(0) % AVATAR_COLORS.length];
const initials    = (name) => (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

/* ─── CSS ───────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Syne:wght@600;700&display=swap');

  .m-wrap {
    --sur:   #1E1E22;
    --sur2:  #26262C;
    --sur3:  #2E2E36;
    --bdr:   rgba(255,255,255,0.07);
    --bdr2:  rgba(255,255,255,0.13);
    --acc:   #F97316;
    --acc-d: rgba(249,115,22,0.11);
    --acc-g: rgba(249,115,22,0.22);
    --t1:    #EBEBEB;
    --t2:    #9898A6;
    --t3:    #58586A;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
  }

  /* Tabs */
  .m-tabs { display:flex; border-bottom:1px solid var(--bdr); margin-bottom:28px; gap:0; }
  .m-tab {
    padding:11px 20px; font-size:13.5px; font-weight:500; color:var(--t3);
    cursor:pointer; border:none; background:none;
    border-bottom:2px solid transparent; margin-bottom:-1px;
    transition:color .15s, border-color .15s;
    font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; gap:7px; white-space:nowrap;
  }
  .m-tab:hover { color:var(--t2); }
  .m-tab.active { color:var(--acc); border-bottom-color:var(--acc); font-weight:600; }
  .m-badge {
    font-size:10px; font-weight:700; padding:2px 7px; border-radius:20px;
    background:var(--acc-d); color:var(--acc); line-height:1.5;
    transition:background .15s, color .15s;
  }
  .m-tab.active .m-badge { background:var(--acc); color:#fff; }

  /* Page header */
  .ph { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .ph h2 { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:var(--t1); }
  .ph p  { font-size:12.5px; color:var(--t3); margin-top:3px; }

  /* KPI */
  .kgrid  { display:grid; gap:14px; margin-bottom:22px; }
  .kgrid4 { grid-template-columns:repeat(4,minmax(0,1fr)); }
  .kgrid3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .kcard {
    background:var(--sur); border:1px solid var(--bdr); border-radius:14px;
    padding:20px 22px; position:relative; overflow:hidden;
    transition:border-color .18s, transform .18s;
    animation:fadeUp .32s ease both;
  }
  .kcard:hover { border-color:var(--bdr2); transform:translateY(-2px); }
  .kcard-orb {
    position:absolute; top:-18px; right:-18px;
    width:64px; height:64px; border-radius:50%;
    background:var(--acc-d); pointer-events:none;
  }
  .klabel { font-size:10.5px; font-weight:600; color:var(--t3); letter-spacing:.07em; text-transform:uppercase; margin-bottom:10px; }
  .kval   { font-size:28px; font-weight:700; font-family:'Syne',sans-serif; line-height:1; }
  .ktrend { font-size:11.5px; margin-top:7px; }

  /* Card */
  .card { background:var(--sur); border:1px solid var(--bdr); border-radius:14px; overflow:hidden; margin-bottom:18px; width:100%; }
  .card-hd {
    padding:14px 20px; border-bottom:1px solid var(--bdr);
    display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
  }
  .card-title { font-family:'Syne',sans-serif; font-size:13.5px; font-weight:700; color:var(--t1); }

  /* Table */
  .tbl { width:100%; border-collapse:collapse; font-size:13px; }
  .tbl th {
    text-align:left; padding:11px 18px; font-size:10.5px; font-weight:600;
    color:var(--t3); letter-spacing:.07em; text-transform:uppercase;
    border-bottom:1px solid var(--bdr); white-space:nowrap;
  }
  .tbl td { padding:13px 18px; border-bottom:1px solid var(--bdr); color:var(--t1); vertical-align:middle; }
  .tbl tbody tr { transition:background .1s; }
  .tbl tbody tr:hover td { background:rgba(255,255,255,0.018); }
  .tbl tbody tr:last-child td { border-bottom:none; }
  .tbl-empty { text-align:center !important; padding:40px !important; color:var(--t3) !important; }

  /* Badges */
  .bdg {
    display:inline-flex; align-items:center; gap:5px; padding:3px 10px;
    border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap;
  }
  .bdg::before { content:''; width:5px; height:5px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .bdg-g  { background:rgba(16,185,129,.12);  color:#34D399; }
  .bdg-y  { background:rgba(251,191,36,.12);  color:#FBBF24; }
  .bdg-b  { background:rgba(96,165,250,.12);  color:#60A5FA; }
  .bdg-r  { background:rgba(248,113,113,.12); color:#F87171; }
  .bdg-gr { background:rgba(113,113,122,.12); color:#71717A; }
  .bdg-o  { background:rgba(249,115,22,.12);  color:#FB923C; }
  .bdg-pulse::before { animation:dotpulse 1.3s ease-in-out infinite; }
  @keyframes dotpulse { 0%,100%{opacity:1} 50%{opacity:.25} }

  /* Buttons */
  .btn {
    padding:6px 13px; font-size:12px; font-weight:500; border-radius:8px;
    cursor:pointer; border:1px solid var(--bdr2); background:var(--sur2);
    color:var(--t2); font-family:'DM Sans',sans-serif;
    transition:all .14s; white-space:nowrap;
  }
  .btn:hover { color:var(--t1); background:var(--sur3); border-color:rgba(255,255,255,.2); }
  .btn-primary {
    display:inline-flex; align-items:center; gap:6px;
    background:var(--acc); color:#fff; border:none;
    padding:9px 18px; font-size:13px; font-weight:600; border-radius:10px;
    cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all .15s; box-shadow:0 3px 14px var(--acc-g);
  }
  .btn-primary:hover { background:#EA580C; transform:translateY(-1px); box-shadow:0 5px 20px rgba(249,115,22,.38); }
  .btn-danger  { background:rgba(239,68,68,.1);  color:#F87171; border-color:rgba(239,68,68,.2); }
  .btn-danger:hover  { background:rgba(239,68,68,.18); }
  .btn-warn    { background:rgba(245,158,11,.1); color:#FBBF24; border-color:rgba(245,158,11,.2); }
  .btn-warn:hover    { background:rgba(245,158,11,.18); }
  .btn-info    { background:rgba(96,165,250,.1); color:#60A5FA; border-color:rgba(96,165,250,.2); }
  .btn-info:hover    { background:rgba(96,165,250,.18); }
  .btn-success { background:rgba(16,185,129,.1); color:#34D399; border-color:rgba(16,185,129,.2); }
  .btn-success:hover { background:rgba(16,185,129,.18); }
  .arow { display:flex; gap:6px; flex-wrap:wrap; }

  /* Progress */
  .prog { display:flex; align-items:center; gap:9px; min-width:140px; }
  .prog-track { flex:1; height:4px; background:var(--sur3); border-radius:10px; overflow:hidden; }
  .prog-fill  { height:4px; border-radius:10px; background:linear-gradient(90deg,#F97316,#FF6835); transition:width .5s cubic-bezier(.22,.68,0,1); }
  .prog-pct   { font-size:11.5px; font-weight:700; color:var(--acc); min-width:34px; }

  /* Filter bar */
  .fbar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:16px; }
  .fsel, .finput {
    padding:7px 12px; font-size:12.5px; border:1px solid var(--bdr); border-radius:9px;
    background:var(--sur2); color:var(--t1); font-family:'DM Sans',sans-serif;
    outline:none; transition:border-color .15s, box-shadow .15s;
  }
  .fsel { cursor:pointer; }
  .fsel option, .finput option { background:#26262C; }
  .finput::placeholder { color:var(--t3); }
  .fsel:focus, .finput:focus { border-color:var(--acc); box-shadow:0 0 0 3px var(--acc-g); }

  /* Stat bars */
  .sbar { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
  .sbar-lbl { font-size:12.5px; color:var(--t2); width:130px; flex-shrink:0; text-align:right; }
  .sbar-track { flex:1; height:6px; background:var(--sur3); border-radius:10px; overflow:hidden; }
  .sbar-fill  { height:6px; border-radius:10px; transition:width .6s cubic-bezier(.22,.68,0,1); }
  .sbar-val   { font-size:12px; font-weight:600; min-width:24px; text-align:right; flex-shrink:0; }

  /* Avatar */
  .av    { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; font-family:'DM Sans',sans-serif; letter-spacing:.04em; flex-shrink:0; }
  .av-sm { width:28px; height:28px; border-radius:8px; font-size:9.5px; }

  /* Modal */
  .overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.72); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center; z-index:9999;
    animation:fadeIn .15s ease;
  }
  .mbox {
    background:#1E1E22; border:1px solid rgba(255,255,255,.1); border-radius:18px;
    padding:28px; width:100%; max-width:460px; max-height:90vh; overflow-y:auto;
    box-shadow:0 28px 70px rgba(0,0,0,.75);
    animation:slideUp .2s cubic-bezier(.22,.68,0,1.2);
  }
  .m-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:var(--t1); margin-bottom:20px; }
  .m-foot  { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; padding-top:16px; border-top:1px solid var(--bdr); }

  /* Form */
  .ff { margin-bottom:14px; }
  .fl { display:block; font-size:10.5px; font-weight:600; color:var(--t3); margin-bottom:6px; letter-spacing:.05em; text-transform:uppercase; }
  .fc {
    width:100%; padding:10px 13px; font-size:13.5px;
    border:1px solid var(--bdr); border-radius:10px;
    background:var(--sur2); color:var(--t1);
    font-family:'DM Sans',sans-serif; outline:none;
    transition:border-color .15s, box-shadow .15s;
  }
  .fc:focus { border-color:var(--acc); box-shadow:0 0 0 3px var(--acc-g); }
  .fc::placeholder { color:var(--t3); }
  .fc option { background:#26262C; }
  textarea.fc { resize:vertical; min-height:80px; }

  /* Anims */
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .s1{animation-delay:.05s} .s2{animation-delay:.10s} .s3{animation-delay:.15s} .s4{animation-delay:.20s}
`;

/* ─── ATOMS ─────────────────────────────────────────────────── */
function AgentBadge({ status }) {
  const map = {
    "En appel":   "bdg bdg-g bdg-pulse",
    "En pause":   "bdg bdg-y",
    "Disponible": "bdg bdg-b",
    "Déconnecté": "bdg bdg-gr",
  };
  return <span className={map[status] || "bdg bdg-gr"}>{status}</span>;
}
function LeadBadge({ status }) {
  const map = { "OK": "bdg bdg-g", "Hors cible": "bdg bdg-r", "Answering Machine": "bdg bdg-y", "Do Not Call": "bdg bdg-gr" };
  return <span className={map[status] || "bdg bdg-gr"}>{status || "—"}</span>;
}
function Prog({ val }) {
  return (
    <div className="prog">
      <div className="prog-track"><div className="prog-fill" style={{ width: `${Math.min(val, 100)}%` }} /></div>
      <span className="prog-pct">{val}%</span>
    </div>
  );
}
function PageHeader({ title, sub, action }) {
  return (
    <div className="ph">
      <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
      {action}
    </div>
  );
}
function Field({ label, children }) {
  return <div className="ff"><label className="fl">{label}</label>{children}</div>;
}
function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mbox">
        <p className="m-title">{title}</p>
        {children}
        <div className="m-foot">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={onSave}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AGENTS ─────────────────────────────────────────────────── */
function AgentsTab({ agents, setAgents }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState({ name: "", login: "", pass: "", status: "Disponible" });
  const [nextId, setNextId]       = useState(5);
  const [search, setSearch]       = useState("");

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.login.toLowerCase().includes(search.toLowerCase())
  );
  const openAdd  = () => { setEditId(null); setForm({ name: "", login: "", pass: "", status: "Disponible" }); setShowModal(true); };
  const openEdit = (a) => { setEditId(a.id); setForm({ name: a.name, login: a.login, pass: a.pass, status: ["En appel","Déconnecté"].includes(a.status) ? "Disponible" : a.status }); setShowModal(true); };
  const save = () => {
    if (!form.name.trim()) return;
    if (editId) setAgents(agents.map(a => a.id === editId ? { ...a, ...form } : a));
    else { setAgents([...agents, { id: nextId, ...form, duration: "00:00", calls: 0, aht: "00:00" }]); setNextId(n => n + 1); }
    setShowModal(false);
  };
  const del = (id) => { if (!window.confirm("Supprimer cet agent ?")) return; setAgents(agents.filter(a => a.id !== id)); };
  const act = (id, a) => setAgents(agents.map(ag => {
    if (ag.id !== id) return ag;
    if (a === "pause")       return { ...ag, status: "En pause" };
    if (a === "reprendre")   return { ...ag, status: "Disponible" };
    if (a === "deconnecter") return { ...ag, status: "Déconnecté" };
    if (a === "ecouter")     { alert("🎧 Écoute de " + ag.name + " en cours..."); return ag; }
    return ag;
  }));

  const kpis = [
    { label: "Total agents",  val: agents.length,                                      color: "var(--t1)",  del: "s1" },
    { label: "En appel",      val: agents.filter(a => a.status === "En appel").length,  color: "#34D399",    del: "s2" },
    { label: "En pause",      val: agents.filter(a => a.status === "En pause").length,  color: "#FBBF24",    del: "s3" },
    { label: "Disponibles",   val: agents.filter(a => a.status === "Disponible").length, color: "#60A5FA",   del: "s4" },
  ];

  return (
    <>
      <PageHeader title="Gestion des agents" sub={`${agents.length} agent(s) enregistrés`}
        action={<button className="btn-primary" onClick={openAdd}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>Ajouter un agent</button>} />
      <div className="kgrid kgrid4">
        {kpis.map(k => (
          <div key={k.label} className={`kcard ${k.del}`}>
            <div className="kcard-orb" /><p className="klabel">{k.label}</p>
            <p className="kval" style={{ color: k.color }}>{k.val}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-hd">
          <span className="card-title">Comptes agents</span>
          <input className="finput" style={{ width: 210 }} placeholder="🔍  Rechercher un agent…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="tbl">
          <thead><tr><th>Agent</th><th>Statut</th><th>Durée</th><th>Appels</th><th>AHT</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={6} className="tbl-empty">Aucun agent trouvé</td></tr>
              : filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                      <div className="av" style={{ background: avatarColor(a.name) }}>{initials(a.name)}</div>
                      <div>
                        <p style={{ fontWeight:600, fontSize:"13.5px", color:"var(--t1)" }}>{a.name}</p>
                        <p style={{ fontSize:"11.5px", color:"var(--t3)" }}>{a.login}</p>
                      </div>
                    </div>
                  </td>
                  <td><AgentBadge status={a.status} /></td>
                  <td style={{ color:"var(--t2)", fontFamily:"monospace", fontSize:"12.5px" }}>{a.duration}</td>
                  <td><span style={{ fontWeight:700, color:"var(--t1)" }}>{a.calls}</span></td>
                  <td style={{ color:"var(--t2)", fontFamily:"monospace", fontSize:"12.5px" }}>{a.aht}</td>
                  <td>
                    <div className="arow">
                      {a.status === "En appel"                       && <button className="btn btn-info"    onClick={() => act(a.id,"ecouter")}>🎧 Écouter</button>}
                      {!["En pause","Déconnecté"].includes(a.status)  && <button className="btn btn-warn"    onClick={() => act(a.id,"pause")}>Pause</button>}
                      {a.status === "En pause"                        && <button className="btn btn-success" onClick={() => act(a.id,"reprendre")}>Reprendre</button>}
                      {a.status !== "Déconnecté"                      && <button className="btn btn-danger"  onClick={() => act(a.id,"deconnecter")}>Déconnecter</button>}
                      <button className="btn" onClick={() => openEdit(a)}>Modifier</button>
                      <button className="btn btn-danger" onClick={() => del(a.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title={editId ? "Modifier le compte" : "Ajouter un agent"} onClose={() => setShowModal(false)} onSave={save}>
          <Field label="Nom complet"><input className="fc" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Agent Nom" /></Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Login"><input className="fc" value={form.login} onChange={e => setForm({...form,login:e.target.value})} placeholder="agent.nom" /></Field>
            <Field label="Mot de passe"><input className="fc" type="password" value={form.pass} onChange={e => setForm({...form,pass:e.target.value})} placeholder="••••••" /></Field>
          </div>
          <Field label="Statut initial">
            <select className="fc" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
              <option>Disponible</option><option>En pause</option>
            </select>
          </Field>
        </Modal>
      )}
    </>
  );
}

/* ─── LEADS ──────────────────────────────────────────────────── */
function LeadsTab({ leads, setLeads, campaigns }) {
  const [showModal,setShowModal]       = useState(false);
  const [editId,setEditId]             = useState(null);
  const [filterCamp,setFilterCamp]     = useState("");
  const [filterStatus,setFilterStatus] = useState("");
  const [search,setSearch]             = useState("");
  const [nextId,setNextId]             = useState(7);
  const empty = { campId: campaigns[0]?.id||1, nom:"", prenom:"", tel:"", adresse:"", status:"", comment:"" };
  const [form,setForm] = useState(empty);

  const filtered = leads.filter(l =>
    (!filterCamp   || l.campId === parseInt(filterCamp)) &&
    (!filterStatus || l.status === filterStatus) &&
    (!search || `${l.nom} ${l.prenom} ${l.tel}`.toLowerCase().includes(search.toLowerCase()))
  );
  const openAdd  = () => { setEditId(null); setForm(empty); setShowModal(true); };
  const openEdit = (l) => { setEditId(l.id); setForm({campId:l.campId,nom:l.nom,prenom:l.prenom,tel:l.tel,adresse:l.adresse,status:l.status||"",comment:l.comment||""}); setShowModal(true); };
  const save = () => {
    if (!form.nom.trim()) return;
    if (editId) setLeads(leads.map(l => l.id===editId ? {...l,...form,campId:parseInt(form.campId)} : l));
    else { setLeads([...leads,{id:nextId,...form,campId:parseInt(form.campId),agent:""}]); setNextId(n=>n+1); }
    setShowModal(false);
  };
  const del = (id) => { if (!window.confirm("Supprimer ce lead ?")) return; setLeads(leads.filter(l=>l.id!==id)); };

  return (
    <>
      <PageHeader title="Gestion des leads" sub={`${leads.length} lead(s) au total`}
        action={<button className="btn-primary" onClick={openAdd}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>Ajouter un lead</button>} />
      <div className="fbar">
        <input className="finput" style={{width:200}} placeholder="🔍  Nom, téléphone…" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="fsel" value={filterCamp} onChange={e=>setFilterCamp(e.target.value)}>
          <option value="">Toutes les campagnes</option>
          {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="fsel" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {LEAD_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <span style={{fontSize:"12px",color:"var(--t3)"}}>{filtered.length} résultat(s)</span>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>#</th><th>Prospect</th><th>Téléphone</th><th>Adresse</th><th>Statut</th><th>Commentaire</th><th>Campagne</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} className="tbl-empty">Aucun lead trouvé</td></tr>
              : filtered.map(l => {
                const camp = campaigns.find(c=>c.id===l.campId);
                return (
                  <tr key={l.id}>
                    <td style={{color:"var(--t3)",fontSize:"11px",fontFamily:"monospace"}}>#{String(l.id).padStart(3,"0")}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div className="av av-sm" style={{background:avatarColor(l.nom)}}>{initials(l.nom+" "+l.prenom)}</div>
                        <span style={{fontWeight:600}}>{l.nom} {l.prenom}</span>
                      </div>
                    </td>
                    <td style={{color:"var(--t2)",fontFamily:"monospace",fontSize:"12.5px"}}>{l.tel}</td>
                    <td style={{fontSize:"12px",color:"var(--t3)",maxWidth:160}}>{l.adresse}</td>
                    <td><LeadBadge status={l.status} /></td>
                    <td style={{fontSize:"12px",color:"var(--t2)",maxWidth:180}}>
                      {l.comment ? <span title={l.comment} style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{l.comment}</span> : <span style={{color:"var(--t3)"}}>—</span>}
                    </td>
                    <td>{camp&&<span className="bdg bdg-o">{camp.name}</span>}</td>
                    <td><div className="arow"><button className="btn" onClick={()=>openEdit(l)}>Modifier</button><button className="btn btn-danger" onClick={()=>del(l.id)}>✕</button></div></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title={editId?"Modifier le lead":"Ajouter un lead"} onClose={()=>setShowModal(false)} onSave={save}>
          <Field label="Campagne"><select className="fc" value={form.campId} onChange={e=>setForm({...form,campId:e.target.value})}>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Nom"><input className="fc" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom"/></Field>
            <Field label="Prénom"><input className="fc" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></Field>
          </div>
          <Field label="Téléphone"><input className="fc" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="06xxxxxxxx"/></Field>
          <Field label="Adresse"><input className="fc" value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})} placeholder="Adresse complète"/></Field>
          <Field label="Statut"><select className="fc" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="">— Non traité —</option>{LEAD_STATUSES.map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="Commentaire"><textarea className="fc" value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} placeholder="Notes sur ce prospect…"/></Field>
        </Modal>
      )}
    </>
  );
}

/* ─── STATS ──────────────────────────────────────────────────── */
function StatsTab({ leads, agents }) {
  const tot  = leads.length;
  const ok   = leads.filter(l=>l.status==="OK").length;
  const hc   = leads.filter(l=>l.status==="Hors cible").length;
  const am   = leads.filter(l=>l.status==="Answering Machine").length;
  const dnc  = leads.filter(l=>l.status==="Do Not Call").length;
  const taux = tot ? Math.round(ok/tot*100) : 0;

  const bars = [
    { label:"OK",               val:ok,  color:"#34D399", fill:"rgba(16,185,129,.5)" },
    { label:"Hors cible",       val:hc,  color:"#F87171", fill:"rgba(248,113,113,.5)" },
    { label:"Answering Machine",val:am,  color:"#FBBF24", fill:"rgba(251,191,36,.5)" },
    { label:"Do Not Call",      val:dnc, color:"#71717A", fill:"rgba(113,113,122,.5)" },
  ];
  const agStats = agents.map(a => {
    const ag=leads.filter(l=>l.agent===a.name);
    const o=ag.filter(l=>l.status==="OK").length;
    return { name:a.name, ok:o, hc:ag.filter(l=>l.status==="Hors cible").length, am:ag.filter(l=>l.status==="Answering Machine").length, dnc:ag.filter(l=>l.status==="Do Not Call").length, tot:ag.length, pct:ag.length?Math.round(o/ag.length*100):0 };
  });

  return (
    <>
      <PageHeader title="Statistiques" sub="Performance globale et par agent" />
      <div className="kgrid kgrid3">
        {[
          {label:"Total leads",    val:tot,       color:"var(--t1)", del:"s1"},
          {label:"Total OK",       val:ok,        color:"#34D399",   del:"s2"},
          {label:"Taux OK global", val:taux+"%",  color:"var(--acc)", del:"s3"},
        ].map(k=>(
          <div key={k.label} className={`kcard ${k.del}`}>
            <div className="kcard-orb" /><p className="klabel">{k.label}</p>
            <p className="kval" style={{color:k.color}}>{k.val}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-hd"><span className="card-title">Répartition des statuts</span></div>
        <div style={{padding:"20px 24px"}}>
          {bars.map(s=>(
            <div key={s.label} className="sbar">
              <span className="sbar-lbl">{s.label}</span>
              <div className="sbar-track"><div className="sbar-fill" style={{width:tot?`${Math.round(s.val/tot*100)}%`:"0%",background:s.fill}}/></div>
              <span className="sbar-val" style={{color:s.color}}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-hd"><span className="card-title">Performance par agent</span></div>
        <table className="tbl">
          <thead><tr><th>Agent</th><th>Total</th><th>OK</th><th>Hors cible</th><th>Ans. Machine</th><th>DNC</th><th style={{minWidth:160}}>Taux OK</th></tr></thead>
          <tbody>
            {agStats.map(s=>(
              <tr key={s.name}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div className="av av-sm" style={{background:avatarColor(s.name)}}>{initials(s.name)}</div>
                    <span style={{fontWeight:600}}>{s.name}</span>
                  </div>
                </td>
                <td style={{color:"var(--t2)"}}>{s.tot}</td>
                <td><span style={{fontWeight:700,color:"#34D399"}}>{s.ok}</span></td>
                <td><span style={{color:"#F87171"}}>{s.hc}</span></td>
                <td><span style={{color:"#FBBF24"}}>{s.am}</span></td>
                <td><span style={{color:"var(--t3)"}}>{s.dnc}</span></td>
                <td><Prog val={s.pct}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─── CAMPAGNES ──────────────────────────────────────────────── */
function CampagnesTab({ campaigns, setCampaigns }) {
  const [showModal,setShowModal] = useState(false);
  const [form,setForm]           = useState({name:"",total:""});
  const [nextId,setNextId]       = useState(4);

  const save = () => {
    if (!form.name.trim()||!form.total) return;
    setCampaigns([...campaigns,{id:nextId,name:form.name,status:"Active",total:parseInt(form.total),traite:0}]);
    setNextId(n=>n+1); setForm({name:"",total:""}); setShowModal(false);
  };
  const toggle = (id) => setCampaigns(campaigns.map(c=>c.id===id?{...c,status:c.status==="Active"?"En pause":"Active"}:c));
  const del    = (id) => { if(!window.confirm("Supprimer cette campagne ?"))return; setCampaigns(campaigns.filter(c=>c.id!==id)); };
  const active = campaigns.filter(c=>c.status==="Active").length;

  return (
    <>
      <PageHeader title="Campagnes" sub={`${campaigns.length} campagne(s) · ${active} active(s)`}
        action={<button className="btn-primary" onClick={()=>setShowModal(true)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>Nouvelle campagne</button>} />
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Campagne</th><th>Statut</th><th>Total</th><th>Traités</th><th>Restants</th><th style={{minWidth:180}}>Progression</th><th>Actions</th></tr></thead>
          <tbody>
            {campaigns.length===0
              ? <tr><td colSpan={7} className="tbl-empty">Aucune campagne configurée</td></tr>
              : campaigns.map(c=>{
                const pct=c.total?Math.round(c.traite/c.total*100):0;
                return (
                  <tr key={c.id}>
                    <td style={{fontWeight:600}}>{c.name}</td>
                    <td><span className={`bdg ${c.status==="Active"?"bdg-g":"bdg-y"}`}>{c.status}</span></td>
                    <td style={{color:"var(--t2)"}}>{c.total}</td>
                    <td style={{fontWeight:600}}>{c.traite}</td>
                    <td><span style={{fontWeight:700,color:"var(--acc)"}}>{c.total-c.traite}</span></td>
                    <td><Prog val={pct}/></td>
                    <td><div className="arow">
                      <button className={`btn ${c.status==="Active"?"btn-warn":"btn-success"}`} onClick={()=>toggle(c.id)}>{c.status==="Active"?"Pause":"Activer"}</button>
                      <button className="btn btn-danger" onClick={()=>del(c.id)}>✕</button>
                    </div></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Nouvelle campagne" onClose={()=>setShowModal(false)} onSave={save}>
          <Field label="Nom de la campagne"><input className="fc" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: Campagne Été 2025"/></Field>
          <Field label="Nombre de leads total"><input className="fc" type="number" value={form.total} onChange={e=>setForm({...form,total:e.target.value})} placeholder="500" min="1"/></Field>
        </Modal>
      )}
    </>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
const TABS = [
  { id:"agents",    label:"Agents",       icon:"👥" },
  { id:"leads",     label:"Leads",        icon:"📋" },
  { id:"stats",     label:"Statistiques", icon:"📊" },
  { id:"campagnes", label:"Campagnes",    icon:"🎯" },
];

export default function Manager() {
  const [tab,setTab]             = useState("agents");
  const [agents,setAgents]       = useState(initialAgents);
  const [leads,setLeads]         = useState(initialLeads);
  const [campaigns,setCampaigns] = useState(initialCampaigns);
  const counts = { agents:agents.length, leads:leads.length, stats:null, campagnes:campaigns.length };

  return (
    <div className="m-wrap">
      <style>{CSS}</style>
      <div className="m-tabs">
        {TABS.map(t=>(
          <button key={t.id} className={`m-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
            <span style={{fontSize:14}}>{t.icon}</span>
            {t.label}
            {counts[t.id]!=null && <span className="m-badge">{counts[t.id]}</span>}
          </button>
        ))}
      </div>
      {tab==="agents"    && <AgentsTab    agents={agents}       setAgents={setAgents}/>}
      {tab==="leads"     && <LeadsTab     leads={leads}         setLeads={setLeads}    campaigns={campaigns} agents={agents}/>}
      {tab==="stats"     && <StatsTab     leads={leads}         agents={agents}/>}
      {tab==="campagnes" && <CampagnesTab campaigns={campaigns} setCampaigns={setCampaigns}/>}
    </div>
  );
}