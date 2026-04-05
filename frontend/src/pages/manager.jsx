import { useState, useEffect, useRef } from "react";
import { getAgents, getcampagnes, getLeads, deletecampagne, updatecampagne, toggleCampagneStatus, uploadCampagneWithLeads } from "../api/api";
const LEAD_STATUSES = ["OK", "Hors cible", "Answering Machine", "Do Not Call"];

const AVATAR_COLORS = [
  "linear-gradient(135deg,#FF6A00,#EA580C)",
  "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#3B82F6,#2563EB)",
  "linear-gradient(135deg,#EC4899,#DB2777)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
];
const avatarColor = (name) => AVATAR_COLORS[(name || "A").charCodeAt(0) % AVATAR_COLORS.length];
const initials     = (name) => (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

/* ─── CSS ───────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

  .m-wrap {
    --sur:   #FFFFFF;
    --sur2:  #FAFAFB;
    --sur3:  #F3F4F6;
    --bdr:   #E5E7EB;
    --bdr2:  #D1D5DB;
    --acc:   #FF6A00;
    --acc-d: rgba(255, 106, 0, 0.1);
    --acc-g: rgba(255, 106, 0, 0.2);
    --t1:    #111827;
    --t2:    #4B5563;
    --t3:    #6B7280;
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
    color: var(--t1);
  }

  .m-wrap * { color: inherit; }

  /* Tabs */
  .m-tabs { display:flex; border-bottom:2px solid var(--bdr); margin-bottom:30px; gap:5px; }
  .m-tab {
    padding:14px 24px; font-size:15px; font-weight:600; color:var(--t3);
    cursor:pointer; border:none; background:none;
    border-bottom:3px solid transparent; margin-bottom:-2px;
    transition:all .15s;
    display:flex; align-items:center; gap:8px; white-space:nowrap;
  }
  .m-tab:hover { color:var(--t1); background: var(--sur2); }
  .m-tab.active { color:var(--acc); border-bottom-color:var(--acc); font-weight:700; }
  .m-badge {
    font-size:12px; font-weight:700; padding:2px 8px; border-radius:12px;
    background:var(--acc-d); color:var(--acc); line-height:1.5;
  }
  .m-tab.active .m-badge { background:var(--acc); color:#fff; }

  /* Page header */
  .ph { display:flex; align-items:center; justify-content:space-between; margin-bottom:30px; }
  .ph h2 { font-family:'Space Grotesk',sans-serif; font-size:28px; font-weight:700; color:var(--t1); margin:0; }
  .ph p  { font-size:15px; color:var(--t3); margin:5px 0 0 0; font-weight:500; }

  /* KPI */
  .kgrid  { display:grid; gap:20px; margin-bottom:30px; }
  .kgrid4 { grid-template-columns:repeat(4,minmax(0,1fr)); }
  .kgrid3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .kcard {
    background:var(--sur); border:1px solid var(--bdr); border-radius:16px;
    padding:24px; position:relative; overflow:hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition:all 0.2s ease;
  }
  .kcard:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
  .kcard-orb {
    position:absolute; top:-15px; right:-15px;
    width:60px; height:60px; border-radius:50%;
    background:var(--acc-d); pointer-events:none;
  }
  .klabel { font-size:12px; font-weight:700; color:var(--t3); letter-spacing:.05em; text-transform:uppercase; margin:0 0 8px 0; }
  .kval   { font-size:36px; font-weight:700; font-family:'Space Grotesk',sans-serif; line-height:1; margin:0; color:var(--t1); }

  /* Card */
  .card { background:var(--sur); border:1px solid var(--bdr); border-radius:16px; overflow:hidden; margin-bottom:24px; width:100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03); }
  .card-hd {
    padding:18px 24px; border-bottom:1px solid var(--bdr); background: var(--sur2);
    display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
  }
  .card-title { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; color:var(--t1); }

  /* Table */
  .tbl { width:100%; border-collapse:collapse; font-size:15px; }
  .tbl th {
    text-align:left; padding:14px 24px; font-size:12px; font-weight:700;
    color:var(--t3); letter-spacing:.05em; text-transform:uppercase;
    border-bottom:1px solid var(--bdr); white-space:nowrap; background: var(--sur2);
  }
  .tbl td { padding:16px 24px; border-bottom:1px solid var(--bdr); color:var(--t1); vertical-align:middle; background: #fff; }
  .tbl tbody tr:hover td { background: var(--sur2); }
  .tbl-empty { text-align:center !important; padding:50px !important; color:var(--t3) !important; font-size: 16px; }

  /* Badges */
  .bdg {
    display:inline-flex; align-items:center; gap:6px; padding:5px 12px;
    border-radius:10px; font-size:13px; font-weight:700; white-space:nowrap;
  }
  .bdg::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .bdg-g  { background:#DEF7EC; color:#03543F; }
  .bdg-y  { background:#FEF08A; color:#713F12; }
  .bdg-b  { background:#E0F2FE; color:#0369A1; }
  .bdg-r  { background:#FDE8E8; color:#9B1C1C; }
  .bdg-gr { background:#F3F4F6; color:#374151; }
  .bdg-o  { background:#FFEDD5; color:#9A3412; }
  
  /* Buttons */
  .btn {
    padding:8px 16px; font-size:14px; font-weight:600; border-radius:10px;
    cursor:pointer; border:1px solid var(--bdr2); background:#fff;
    color:var(--t2); transition:all .15s; white-space:nowrap;
  }
  .btn:hover { color:var(--t1); border-color:var(--t2); background: var(--sur2); }
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background: linear-gradient(135deg, #FF6A00 0%, #FF2D55 100%); color:#fff; border:none;
    padding:10px 20px; font-size:14px; font-weight:700; border-radius:12px;
    cursor:pointer; transition:all .15s; box-shadow:0 4px 12px rgba(255,106,0,0.2);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(255,106,0,0.3); }
  .btn-danger  { background:#FDE8E8; color:#9B1C1C; border-color:#FBD5D5; }
  .btn-danger:hover  { background:#FBD5D5; }
  .btn-warn    { background:#FEF08A; color:#713F12; border-color:#FDE047; }
  .btn-warn:hover    { background:#FDE047; }
  .btn-info    { background:#E0F2FE; color:#0369A1; border-color:#BAE6FD; }
  .btn-info:hover    { background:#BAE6FD; }
  .btn-success { background:#DEF7EC; color:#03543F; border-color:#BCF0DA; }
  .btn-success:hover { background:#BCF0DA; }
  .arow { display:flex; gap:8px; flex-wrap:wrap; }

  /* Progress */
  .prog { display:flex; align-items:center; gap:10px; min-width:140px; }
  .prog-track { flex:1; height:6px; background:var(--sur3); border-radius:10px; overflow:hidden; }
  .prog-fill  { height:6px; border-radius:10px; background:linear-gradient(90deg,#FF6A00,#FF2D55); }
  .prog-pct   { font-size:13px; font-weight:700; color:var(--acc); min-width:35px; }

  /* Filter bar */
  .fbar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:20px; }
  .fsel, .finput {
    padding:10px 16px; font-size:14px; border:1px solid var(--bdr); border-radius:10px;
    background:#fff; color:var(--t1); outline:none; transition:all .15s;
  }
  .finput::placeholder { color:var(--t3); }
  .fsel:focus, .finput:focus { border-color:var(--acc); box-shadow:0 0 0 3px var(--acc-g); }

  /* Stat bars */
  .sbar { display:flex; align-items:center; gap:15px; margin-bottom:12px; }
  .sbar-lbl { font-size:14px; color:var(--t2); font-weight:600; width:140px; flex-shrink:0; text-align:right; }
  .sbar-track { flex:1; height:8px; background:var(--sur3); border-radius:10px; overflow:hidden; }
  .sbar-fill  { height:8px; border-radius:10px; }
  .sbar-val   { font-size:14px; font-weight:700; min-width:30px; text-align:right; flex-shrink:0; }

  /* Avatar */
  .av    { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
  .av-sm { width:32px; height:32px; border-radius:10px; font-size:12px; }

  /* Modal */
  .overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.4); backdrop-filter:blur(5px);
    display:flex; align-items:center; justify-content:center; z-index:9999;
  }
  .mbox {
    background:#fff; border-radius:20px;
    padding:30px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto;
    box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  }
  .m-title { font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:700; color:var(--t1); margin:0 0 20px 0; }
  .m-foot  { display:flex; gap:10px; justify-content:flex-end; margin-top:25px; padding-top:20px; border-top:1px solid var(--bdr); }

  /* Form */
  .ff { margin-bottom:16px; }
  .fl { display:block; font-size:12px; font-weight:700; color:var(--t3); margin-bottom:6px; letter-spacing:.05em; text-transform:uppercase; }
  .fc {
    width:100%; padding:11px 14px; font-size:15px;
    border:1px solid var(--bdr); border-radius:10px;
    background:#fff; color:var(--t1); outline:none;
    transition:all .15s; box-sizing: border-box;
  }
  .fc:focus { border-color:var(--acc); box-shadow:0 0 0 3px var(--acc-g); }
  .fc::placeholder { color:var(--t3); }
  textarea.fc { resize:vertical; min-height:90px; }
`;

/* ─── ATOMS ─────────────────────────────────────────────────── */
function AgentBadge({ status }) {
  const map = { "En appel": "bdg bdg-g", "En pause": "bdg bdg-y", "Disponible": "bdg bdg-b", "Déconnecté": "bdg bdg-gr" };
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
          <button className="btn-primary" onClick={onSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ─── TAB: AGENTS ────────────────────────────────────────────── */
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
    
    if (editId) {
      // 👇 Payload m-sakker s7i7 m3a assemi el Backend mte3ek!
      const payload = {
        nom: form.name,         // <--- f-el front esmu "name", nrajj3uh "nom" lel backend
        login: form.login,
        mot_de_passe: form.pass,
        statut: form.status     // <--- f-el front esmu "status", nrajj3uh "statut" lel backend
      };

      updateAgent(editId, payload)
        .then(() => {
          // Kif el backend y9oul OK, n-modifiw f-el ecran
          setAgents(agents.map(a => a.id === editId ? { ...a, ...form } : a));
          setShowModal(false);
        })
        .catch(err => {
          console.error("Erreur modification agent:", err);
          alert("Saret moshkla kif jina nmodifiw l-agent!");
        });
        
    } else {
      // Houni nkhalliw l-ajout mte3ek kima ken bed-dabt
      setAgents([...agents, { id: nextId, ...form, duration: "00:00", calls: 0, aht: "00:00" }]); 
      setNextId(n => n + 1); 
      setShowModal(false);
    }
  };

  const act = (id, action) => setAgents(agents.map(ag => {
    if (ag.id !== id) return ag;
    if (action === "ecouter") { alert("🎧 Écoute de " + ag.name + " en cours..."); return ag; }
    return ag;
  }));

  const kpis = [
    { label: "Total agents",  val: agents.length, color: "#111827" },
    { label: "En appel",      val: agents.filter(a => a.status === "En appel").length,  color: "#03543F" },
    { label: "En pause",      val: agents.filter(a => a.status === "En pause").length,  color: "#713F12" },
    { label: "Disponibles",   val: agents.filter(a => a.status === "Disponible").length, color: "#0369A1" },
  ];

  return (
    <>
      <PageHeader title="Gestion des agents" sub={`${agents.length} agent(s) enregistrés`} action={<button className="btn-primary" onClick={openAdd}>+ Ajouter un agent</button>} />
      <div className="kgrid kgrid4">
        {kpis.map(k => (
          <div key={k.label} className="kcard"><div className="kcard-orb" /><p className="klabel">{k.label}</p><p className="kval" style={{ color: k.color }}>{k.val}</p></div>
        ))}
      </div>
      <div className="card">
        <div className="card-hd"><span className="card-title">Comptes agents</span><input className="finput" style={{ width: 250 }} placeholder="🔍  Rechercher un agent…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <table className="tbl">
          <thead><tr><th>Agent</th><th>Statut</th><th>Durée</th><th>Appels</th><th>AHT</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={6} className="tbl-empty">Aucun agent trouvé</td></tr> : filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div className="av" style={{ background: avatarColor(a.name) }}>{initials(a.name)}</div>
                      <div><p style={{ fontWeight:700, fontSize:"15px", margin:0 }}>{a.name}</p><p style={{ fontSize:"13px", color:"var(--t3)", margin:0 }}>@{a.login}</p></div>
                    </div>
                  </td>
                  <td><AgentBadge status={a.status} /></td>
                  <td style={{ fontWeight:"bold" }}>{a.duration}</td>
                  <td style={{ fontWeight:"bold" }}>{a.calls}</td>
                  <td style={{ color:"var(--t3)" }}>{a.aht}</td>
                  <td>
                    <div className="arow">
                      {a.status === "En appel" && <button className="btn btn-info" onClick={() => act(a.id, "ecouter")}>🎧 Écouter</button>}
                      <button className="btn" onClick={() => openEdit(a)}>Modifier</button>
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
            <select className="fc" value={form.status} onChange={e => setForm({...form,status:e.target.value})}><option>Disponible</option><option>En pause</option></select>
          </Field>
        </Modal>
      )}
    </>
  );
}

/* ─── TAB: LEADS ─────────────────────────────────────────────── */
function LeadsTab({ leads, setLeads, campagnes }) {
  const [showModal,setShowModal]       = useState(false);
  const [editId,setEditId]             = useState(null);
  const [filterCamp,setFilterCamp]     = useState("");
  const [filterStatus,setFilterStatus] = useState("");
  const [search,setSearch]             = useState("");
  const [nextId,setNextId]             = useState(7);
  
  const empty = { campId: campagnes[0]?.id||1, nom:"", prenom:"", tel:"", adresse:"", status:"", comment:"" };
  const [form,setForm] = useState(empty);

  const filtered = leads.filter(l =>
    (!filterCamp   || l.campId === parseInt(filterCamp)) && (!filterStatus || l.status === filterStatus) && (!search || `${l.nom} ${l.prenom} ${l.tel}`.toLowerCase().includes(search.toLowerCase()))
  );
  
  const openAdd  = () => { setEditId(null); setForm(empty); setShowModal(true); };
  const openEdit = (l) => { setEditId(l.id); setForm({campId:l.campId,nom:l.nom,prenom:l.prenom,tel:l.tel,adresse:l.adresse,status:l.status||"",comment:l.comment||""}); setShowModal(true); };
 const save = () => {
    if (!form.nom.trim()) return;
    
    // 1. N7adhrou d-data b-el assemi s7a7 mta3 el backend
    const payload = {
      campagne_id: parseInt(form.campId),
      nom: form.nom,
      prenom: form.prenom,
      telephone: form.tel,
      adresse: form.adresse,
      statut: form.status || "",
      commentaire: form.comment || ""
    };

    if (editId) {
      // 2. Itha famma editId m3naha tawa l'opération "Modification"
      updateLead(editId, payload)
        .then(() => {
          // Kif el backend y9oul OK, n-modifiw f-el ecran
          setLeads(leads.map(l => l.id === editId ? { ...l, ...form, campId: parseInt(form.campId) } : l));
          setShowModal(false);
        })
        .catch(err => {
          console.error("Erreur modification lead:", err);
          alert("Erreur modification lead");
        });
        
    } else {
      // 3. Itha ma famash editId m3naha l'opération "Ajout"
      createLead(payload)
        .then((res) => {
          // Nasta3mlou el "id" el jdid li rajja3hou el backend
          setLeads([...leads, { id: res.data.id, ...form, campId: parseInt(form.campId), agent: "" }]);
          setShowModal(false);
        })
        .catch(err => {
          console.error("Erreur création lead:", err);
          alert("Erreur création lead:");
        });
    }
  };

  return (
    <>
      <PageHeader title="Gestion des leads" sub={`${leads.length} lead(s) au total`} action={<button className="btn-primary" onClick={openAdd}>+ Ajouter un lead</button>} />
      <div className="fbar">
        <input className="finput" style={{width:250}} placeholder="🔍  Rechercher par nom, tél…" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="fsel" value={filterCamp} onChange={e=>setFilterCamp(e.target.value)}><option value="">Toutes les campagnes</option>{campagnes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select className="fsel" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="">Tous les statuts</option>{LEAD_STATUSES.map(s=><option key={s}>{s}</option>)}</select>
        <span style={{fontSize:"14px",color:"var(--t3)",fontWeight:"bold"}}>{filtered.length} résultat(s)</span>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>#</th><th>Prospect</th><th>Téléphone</th><th>Adresse</th><th>Statut</th><th>Commentaire</th><th>Campagne</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={8} className="tbl-empty">Aucun lead trouvé</td></tr> : filtered.map(l => {
                const camp = campagnes.find(c=>c.id===l.campId);
                return (
                  <tr key={l.id}>
                    <td style={{color:"var(--t3)",fontWeight:"bold"}}>#{String(l.id).padStart(3,"0")}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="av av-sm" style={{background:avatarColor(l.nom)}}>{initials(l.nom+" "+l.prenom)}</div>
                        <span style={{fontWeight:700}}>{l.nom} {l.prenom}</span>
                      </div>
                    </td>
                    <td style={{fontWeight:"bold"}}>{l.tel}</td>
                    <td style={{fontSize:"14px",color:"var(--t2)",maxWidth:160}}>{l.adresse}</td>
                    <td><LeadBadge status={l.status} /></td>
                    <td style={{fontSize:"14px",color:"var(--t2)",maxWidth:180}}>{l.comment ? <span title={l.comment} style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{l.comment}</span> : <span style={{color:"var(--t3)"}}>—</span>}</td>
                    <td>{camp&&<span className="bdg bdg-o">{camp.name}</span>}</td>
                    <td>
                      <div className="arow">
                        <button className="btn" onClick={()=>openEdit(l)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title={editId?"Modifier le lead":"Ajouter un lead"} onClose={()=>setShowModal(false)} onSave={save}>
          <Field label="Campagne"><select className="fc" value={form.campId} onChange={e=>setForm({...form,campId:e.target.value})}>{campagnes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
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

/* ─── TAB: STATS ─────────────────────────────────────────────── */
function StatsTab({ leads, agents }) {
  const tot  = leads.length;
  const ok   = leads.filter(l=>l.status==="OK").length;
  const hc   = leads.filter(l=>l.status==="Hors cible").length;
  const am   = leads.filter(l=>l.status==="Answering Machine").length;
  const dnc  = leads.filter(l=>l.status==="Do Not Call").length;
  const taux = tot ? Math.round(ok/tot*100) : 0;

  const bars = [ { label:"OK", val:ok, color:"#03543F" }, { label:"Hors cible", val:hc, color:"#9B1C1C" }, { label:"Answering Machine",val:am, color:"#713F12" }, { label:"Do Not Call", val:dnc, color:"#374151" } ];
  const agStats = agents.map(a => {
    const ag=leads.filter(l=>l.agent===a.name);
    const o=ag.filter(l=>l.status==="OK").length;
    return { name:a.name, ok:o, hc:ag.filter(l=>l.status==="Hors cible").length, am:ag.filter(l=>l.status==="Answering Machine").length, dnc:ag.filter(l=>l.status==="Do Not Call").length, tot:ag.length, pct:ag.length?Math.round(o/ag.length*100):0 };
  });

  return (
    <>
      <PageHeader title="Statistiques" sub="Performance globale et par agent" />
      <div className="kgrid kgrid3">
        {[{label:"Total leads", val:tot, color:"#111827"},{label:"Total OK", val:ok, color:"#03543F"},{label:"Taux OK global", val:taux+"%", color:"#FF6A00"}].map(k=>(
          <div key={k.label} className="kcard"><div className="kcard-orb" /><p className="klabel">{k.label}</p><p className="kval" style={{color:k.color}}>{k.val}</p></div>
        ))}
      </div>
      <div className="card">
        <div className="card-hd"><span className="card-title">Répartition des statuts</span></div>
        <div style={{padding:"24px"}}>{bars.map(s=>(
            <div key={s.label} className="sbar"><span className="sbar-lbl">{s.label}</span><div className="sbar-track"><div className="sbar-fill" style={{width:tot?`${Math.round(s.val/tot*100)}%`:"0%",background:s.color}}/></div><span className="sbar-val" style={{color:s.color}}>{s.val}</span></div>
          ))}</div>
      </div>
      <div className="card">
        <div className="card-hd"><span className="card-title">Performance par agent</span></div>
        <table className="tbl">
          <thead><tr><th>Agent</th><th>Total</th><th>OK</th><th>Hors cible</th><th>Ans. Machine</th><th>DNC</th><th style={{minWidth:160}}>Taux OK</th></tr></thead>
          <tbody>
            {agStats.map(s=>(
              <tr key={s.name}>
                <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="av av-sm" style={{background:avatarColor(s.name)}}>{initials(s.name)}</div><span style={{fontWeight:700}}>{s.name}</span></div></td>
                <td style={{color:"var(--t2)", fontWeight:"bold"}}>{s.tot}</td><td><span style={{fontWeight:700,color:"#03543F"}}>{s.ok}</span></td><td><span style={{color:"#9B1C1C", fontWeight:"600"}}>{s.hc}</span></td><td><span style={{color:"#713F12", fontWeight:"600"}}>{s.am}</span></td><td><span style={{color:"var(--t3)"}}>{s.dnc}</span></td><td><Prog val={s.pct}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─── TAB: CAMPAGNES ────────────────────────────────────────── */
function CampagnesTab({ campagnes, setcampagnes }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ name: "", total: "500" });
  const [nextId, setNextId]       = useState(4);
  const fileInputRef              = useRef(null);

  const handleNouvelleCampagneClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Fichier sélectionné :", file.name);
      setShowModal(true);
    }
  };

  const save = async () => {
    if (!form.name.trim() || !form.total) return;
    
    // 1. Nehdu el ficher Excel li t-uploadé
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Brabi selecti ficher Excel s3a!");
      return;
    }

    // 2. N7adrou FormData khater bsh n-ba3thu ficher
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nom", form.name);
    formData.append("total", form.total);

    try {
      // 3. N-ba3thu el ficher lel backend b-el axios
      const response = await uploadCampagneWithLeads(formData);
      
      // Axios y-7ott el data toul fi response.data 🎯
      const data = response.data; 

      // F-el Axios n-thabtu b-el status 200 walla 201
      if (response.status === 200 || response.status === 201) {
        
        // 4. Kif kol chay yetssab f-el base, n-zidou el campagne f-el ecran
        setcampagnes([...campagnes, { 
          id: data.campagne.id, 
          name: form.name, 
          status: "Active", 
          total: parseInt(form.total), 
          traite: 0 
        }]);
        
        alert(`Campagne mrigla! El backend sab ${data.leadsInserted} leads f-el base.`);
        
        // N-ragg3u el form b-el fariqh
        setForm({ name: "", total: "500" });
        setShowModal(false);
        fileInputRef.current.value = "";
      } else {
        alert("Ghalta mel backend: " + (data.error || "Moshkla f-el upload"));
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Saret moshkla f-el upload mta3 el ficher!");
    }
  };
  
const toggle = async (id) => {
    // 1. N-lawju 3la el campagne f-el ecran tawa
    const campagne = campagnes.find(c => c.id === id);
    if (!campagne) return;

    // 2. N-7adhru el statut jdid (kanet Active twalli En pause, w l-3aks)
    const newStatus = campagne.status === "Active" ? "En pause" : "Active";

    try {
      // 3. N-kallmu el backend b-el Axios (khadem-ha b-updatecampagne walla axios toul)
      // Nota: Itha 3andek updatecampagne f-el api.jsx zida hna, ken l-a3ks m-rakka b-axios toul hakka:
const response = await toggleCampagneStatus(id, { statut: newStatus });
      if (response.status === 200) {
        // 4. Kif tetbaddel f-el base, n-baddlouha f-el ecran f-el blassa 🎯
        setcampagnes(campagnes.map(c => 
          c.id === id ? { ...c, status: newStatus } : c
        ));
      }
    } catch (err) {
      console.error("Erreur toggle statut:", err);
      alert("Saret moshkla ma7abbetsh tetbaddel el pause!");
    }
  };
  const del = async (id) => {
    if (!window.confirm("Sure t7eb tfasakh el campagne hathi wel leads mte3ha el kol?")) return;

    try {
      // 1. N-ba3thu requête delete lel backend b-el Axios
      const response = await deletecampagne(id);

      if (response.status === 200 || response.data.success) {
        // 2. Kif tt-fasakh f-el backend, n-na77uha mel frontend f-el blassa 🎯
        setcampagnes(campagnes.filter(c => c.id !== id));
        alert("Campagne t-farkset mrigla mel base w leads mte3ha!");
      }
    } catch (err) {
      console.error("Erreur delete campagne:", err);
      alert("Saret moshkla ma7abbetsh tetfasakh!");
    }
  };  
  const active = campagnes.filter(c=>c.status==="Active").length;

  return (
    <>
      <PageHeader 
        title="campagnes" 
        sub={`${campagnes.length} campagne(s) · ${active} active(s)`}
        action={
          <>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".xlsx, .xls" onChange={handleFileChange} />
            <button className="btn-primary" onClick={handleNouvelleCampagneClick}>+ Nouvelle campagne</button>
          </>
        } 
      />
        
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Campagne</th><th>Statut</th><th>Total</th><th>Traités</th><th>Restants</th><th style={{minWidth:180}}>Progression</th><th>Actions</th></tr></thead>
          <tbody>
            {campagnes.length===0 ? <tr><td colSpan={7} className="tbl-empty">Aucune campagne configurée</td></tr> : campagnes.map(c=>{
                const pct=c.total?Math.round(c.traite/c.total*100):0;
                return (
                  <tr key={c.id}>
                    <td style={{fontWeight:700, fontSize:"16px"}}>{c.name}</td>
                    <td><span className={`bdg ${c.status==="Active"?"bdg-g":"bdg-y"}`}>{c.status}</span></td>
                    <td style={{color:"var(--t2)", fontWeight:"bold"}}>{c.total}</td><td style={{fontWeight:700}}>{c.traite}</td><td><span style={{fontWeight:700,color:"var(--acc)"}}>{c.total-c.traite}</span></td><td><Prog val={pct}/></td>
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
        <Modal title="Configurer la nouvelle campagne" onClose={()=> { setShowModal(false); fileInputRef.current.value = ""; }} onSave={save}>
          <Field label="Nom de la campagne"><input className="fc" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: Campagne Été 2025"/></Field>
          <Field label="Leads dans le fichier (Estimation)"><input className="fc" type="number" value={form.total} onChange={e=>setForm({...form,total:e.target.value})} placeholder="500" min="1"/></Field>
        </Modal>
      )}
    </>
  );
}

/* ─── ROOT COMPONENT ─────────────────────────────────────────── */
const TABS = [ { id:"agents", label:"Agents", icon:"👥" }, { id:"leads", label:"Leads", icon:"📋" }, { id:"stats", label:"Statistiques", icon:"📊" }, { id:"campagnes", label:"Campagnes", icon:"🎯" } ];

export default function Manager() {
  const [tab, setTab]             = useState("agents");
  const [agents, setAgents]       = useState([]);
  const [leads, setLeads]         = useState([]);
  const [campagnes, setcampagnes] = useState([]);
  const [loading, setLoading]     = useState(true);

  // ─── Mapping DB → Frontend ───────────────────────────
  const mapAgent = (a) => ({
    id:       a.id,
    name:     a.nom,
    login:    a.login,
    pass:     a.mot_de_passe,
    status:   a.statut,
    duration: a.duration || "00:00",
    calls:    a.calls    || 0,
    aht:      a.aht      || "00:00",
  });

  const mapCampaign = (c) => ({
    id:     c.id,
    name:   c.nom,
    status: c.statut,
    total:  c.total  || 0,
    traite: c.traite || 0,
  });

  const mapLead = (l) => ({
    id:      l.id,
    campId:  l.campagne_id,
    nom:     l.nom,
    prenom:  l.prenom,
    tel:     l.telephone,
    adresse: l.adresse,
    status:  l.statut   || "",
    comment: l.commentaire || "",
    agent:   l.agent_name  || "",
  });

  // ─── Load data from backend ───────────────────────────
  useEffect(() => {
    Promise.all([getAgents(), getcampagnes(), getLeads()])
      .then(([a, c, l]) => {
        setAgents(a.data.map(mapAgent));
        setcampagnes(c.data.map(mapCampaign));
        setLeads(l.data.map(mapLead));
      })
      .catch(err => console.error("Erreur chargement:", err))
      .finally(() => setLoading(false));
  }, []);

  const counts = { agents: agents.length, leads: leads.length, stats: null, campagnes: campagnes.length };

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"sans-serif", fontSize:18, color:"#6B7280" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div className="m-wrap" style={{ padding: "30px", boxSizing: "border-box" }}>
      <style>{CSS}</style>

      {/* TABS */}
      <div className="m-tabs">
        {TABS.map(t => (
          <button 
            key={t.id} 
            className={`m-tab ${tab === t.id ? "active" : ""}`} 
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            {t.label}
            {counts[t.id] !== null && <span className="m-badge">{counts[t.id]}</span>}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {tab === "agents"    && <AgentsTab agents={agents} setAgents={setAgents} />}
      {tab === "leads"     && <LeadsTab leads={leads} setLeads={setLeads} campagnes={campagnes} />}
      {tab === "stats"     && <StatsTab leads={leads} agents={agents} />}
      {tab === "campagnes" && <CampagnesTab campagnes={campagnes} setcampagnes={setcampagnes} />}
    </div>
  );
}