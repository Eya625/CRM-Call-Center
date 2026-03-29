import { useState } from "react";

const initialAgents = [
  { id: 1, name: "Agent Ali", login: "ali", pass: "1234", status: "En appel", duration: "05:23", calls: 12, aht: "04:10" },
  { id: 2, name: "Agent Sarra", login: "sarra", pass: "1234", status: "Disponible", duration: "00:45", calls: 8, aht: "03:50" },
  { id: 3, name: "Agent Mehdi", login: "mehdi", pass: "1234", status: "En pause", duration: "02:10", calls: 5, aht: "05:00" },
  { id: 4, name: "Agent Ines", login: "ines", pass: "1234", status: "En appel", duration: "07:33", calls: 15, aht: "04:30" },
];
const initialCampaigns = [
  { id: 1, name: "Campagne Été 2025", status: "Active", total: 500, traite: 188 },
  { id: 2, name: "Relance Clients", status: "En pause", total: 200, traite: 111 },
  { id: 3, name: "Nouveaux Leads", status: "Active", total: 150, traite: 0 },
];
const initialLeads = [
  { id: 1, campId: 1, nom: "Benali", prenom: "Mohamed", tel: "0612345678", adresse: "12 rue Habib Bourguiba, Tunis", status: "OK", comment: "Intéressé, rappeler lundi", agent: "Agent Ali" },
  { id: 2, campId: 1, nom: "Chahed", prenom: "Fatma", tel: "0698765432", adresse: "5 av. de Carthage, Sfax", status: "Hors cible", comment: "Trop jeune", agent: "Agent Sarra" },
  { id: 3, campId: 2, nom: "Trabelsi", prenom: "Karim", tel: "0623456789", adresse: "8 rue Ibn Khaldoun, Sousse", status: "Answering Machine", comment: "Pas répondu x2", agent: "Agent Ali" },
  { id: 4, campId: 1, nom: "Riahi", prenom: "Leila", tel: "0634567890", adresse: "3 rue de la Liberté, Bizerte", status: "OK", comment: "Très intéressée", agent: "Agent Ines" },
  { id: 5, campId: 3, nom: "Hamdi", prenom: "Sami", tel: "0645678901", adresse: "17 rue des Roses, Nabeul", status: "Do Not Call", comment: "Ne pas rappeler", agent: "Agent Mehdi" },
  { id: 6, campId: 2, nom: "Miled", prenom: "Amira", tel: "0656789012", adresse: "22 av. Habib Thameur, Tunis", status: "OK", comment: "Rendez-vous pris", agent: "Agent Sarra" },
];
const LEAD_STATUSES = ["OK", "Hors cible", "Answering Machine", "Do Not Call"];

function StatusBadge({ status }) {
  const map = { "En appel":"badge badge-green","En pause":"badge badge-yellow","Disponible":"badge badge-blue","Déconnecté":"badge badge-gray" };
  return <span className={map[status]||"badge badge-gray"}>{status}</span>;
}
function DispBadge({ status }) {
  const map = { "OK":"badge badge-green","Hors cible":"badge badge-red","Answering Machine":"badge badge-yellow","Do Not Call":"badge badge-gray" };
  return <span className={map[status]||"badge badge-gray"}>{status||"—"}</span>;
}
function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className="modal-title">{title}</p>
        {children}
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={onSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return <div className="form-field"><label className="form-label">{label}</label>{children}</div>;
}
function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"24px"}}>
      <div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"22px",fontWeight:700,color:"#111",lineHeight:1.2}}>{title}</h2>
        {subtitle && <p style={{fontSize:"13px",color:"#9B9B9B",marginTop:"4px"}}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AgentsTab({ agents, setAgents }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name:"", login:"", pass:"", status:"Disponible" });
  const [nextId, setNextId] = useState(5);

  const openAdd = () => { setEditId(null); setForm({name:"",login:"",pass:"",status:"Disponible"}); setShowModal(true); };
  const openEdit = (a) => { setEditId(a.id); setForm({name:a.name,login:a.login,pass:a.pass,status:["En appel","Déconnecté"].includes(a.status)?"Disponible":a.status}); setShowModal(true); };
  const save = () => {
    if (!form.name.trim()) return;
    if (editId) setAgents(agents.map(a=>a.id===editId?{...a,...form}:a));
    else { setAgents([...agents,{id:nextId,...form,duration:"00:00",calls:0,aht:"00:00"}]); setNextId(n=>n+1); }
    setShowModal(false);
  };
  const del = (id) => { if(!window.confirm("Supprimer cet agent ?"))return; setAgents(agents.filter(a=>a.id!==id)); };
  const action = (id, act) => setAgents(agents.map(a=>{
    if(a.id!==id)return a;
    if(act==="pause")return{...a,status:"En pause"};
    if(act==="reprendre")return{...a,status:"Disponible"};
    if(act==="deconnecter")return{...a,status:"Déconnecté"};
    if(act==="ecouter"){alert("Écoute de "+a.name+" en cours...");return a;}
    return a;
  }));

  const kpis=[
    {label:"Total agents",value:agents.length,color:"#111",accent:"#F97316"},
    {label:"En appel",value:agents.filter(a=>a.status==="En appel").length,color:"#059669",accent:"#059669"},
    {label:"En pause",value:agents.filter(a=>a.status==="En pause").length,color:"#D97706",accent:"#D97706"},
    {label:"Disponibles",value:agents.filter(a=>a.status==="Disponible").length,color:"#F97316",accent:"#F97316"},
  ];

  return (
    <div>
      <PageHeader title="Gestion des agents" subtitle={agents.length+" agent(s) enregistrés"} action={<button className="btn-primary" onClick={openAdd}>+ Ajouter un agent</button>} />
      <div className="kpi-grid">
        {kpis.map(k=>(
          <div key={k.label} className="kpi-card" style={{borderLeft:"3px solid "+k.accent}}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value" style={{color:k.color}}>{k.value}</p>
          </div>
        ))}
      </div>
      <div className="crm-card">
        <div className="crm-card-header"><span className="crm-card-title">Comptes agents</span></div>
        <table className="crm-table">
          <thead><tr><th>Agent</th><th>Statut</th><th>Durée</th><th>Appels</th><th>AHT</th><th>Actions</th></tr></thead>
          <tbody>
            {agents.map(a=>(
              <tr key={a.id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"32px",height:"32px",borderRadius:"9px",background:a.status==="En appel"?"#ECFDF5":"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:a.status==="En appel"?"#059669":"#9B9B9B",fontFamily:"'Syne',sans-serif"}}>
                      {a.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <p style={{fontWeight:600,fontSize:"13.5px"}}>{a.name}</p>
                      <p style={{fontSize:"11.5px",color:"#9B9B9B"}}>{a.login}</p>
                    </div>
                  </div>
                </td>
                <td><StatusBadge status={a.status}/></td>
                <td style={{color:"#6B7280"}}>{a.duration}</td>
                <td style={{fontWeight:600}}>{a.calls}</td>
                <td style={{color:"#6B7280"}}>{a.aht}</td>
                <td>
                  <div className="action-row">
                    {a.status==="En appel"&&<button className="btn btn-info" onClick={()=>action(a.id,"ecouter")}>Écouter</button>}
                    {!["En pause","Déconnecté"].includes(a.status)&&<button className="btn btn-warning" onClick={()=>action(a.id,"pause")}>Pause</button>}
                    {a.status==="En pause"&&<button className="btn btn-info" onClick={()=>action(a.id,"reprendre")}>Reprendre</button>}
                    {a.status!=="Déconnecté"&&<button className="btn btn-danger" onClick={()=>action(a.id,"deconnecter")}>Déconnecter</button>}
                    <button className="btn" onClick={()=>openEdit(a)}>Modifier</button>
                    <button className="btn btn-danger" onClick={()=>del(a.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal&&(
        <Modal title={editId?"Modifier le compte":"Ajouter un agent"} onClose={()=>setShowModal(false)} onSave={save}>
          <Field label="Nom complet"><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Agent Nom"/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <Field label="Login"><input className="form-control" value={form.login} onChange={e=>setForm({...form,login:e.target.value})} placeholder="agent.nom"/></Field>
            <Field label="Mot de passe"><input className="form-control" type="password" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} placeholder="••••••"/></Field>
          </div>
          <Field label="Statut initial">
            <select className="form-control" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option>Disponible</option><option>En pause</option>
            </select>
          </Field>
        </Modal>
      )}
    </div>
  );
}

function LeadsTab({ leads, setLeads, campaigns }) {
  const [showModal,setShowModal]=useState(false);
  const [editId,setEditId]=useState(null);
  const [filterCamp,setFilterCamp]=useState("");
  const [filterStatus,setFilterStatus]=useState("");
  const [nextId,setNextId]=useState(7);
  const empty={campId:campaigns[0]?.id||1,nom:"",prenom:"",tel:"",adresse:"",status:"",comment:""};
  const [form,setForm]=useState(empty);

  const filtered=leads.filter(l=>(!filterCamp||l.campId===parseInt(filterCamp))&&(!filterStatus||l.status===filterStatus));
  const openAdd=()=>{setEditId(null);setForm(empty);setShowModal(true);};
  const openEdit=(l)=>{setEditId(l.id);setForm({campId:l.campId,nom:l.nom,prenom:l.prenom,tel:l.tel,adresse:l.adresse,status:l.status||"",comment:l.comment||""});setShowModal(true);};
  const save=()=>{
    if(!form.nom.trim())return;
    if(editId)setLeads(leads.map(l=>l.id===editId?{...l,...form,campId:parseInt(form.campId)}:l));
    else{setLeads([...leads,{id:nextId,...form,campId:parseInt(form.campId),agent:""}]);setNextId(n=>n+1);}
    setShowModal(false);
  };
  const del=(id)=>{if(!window.confirm("Supprimer ce lead ?"))return;setLeads(leads.filter(l=>l.id!==id));};

  return (
    <div>
      <PageHeader title="Gestion des leads" subtitle={leads.length+" lead(s) au total"} action={<button className="btn-primary" onClick={openAdd}>+ Ajouter un lead</button>}/>
      <div className="filter-bar">
        <select className="crm-select" value={filterCamp} onChange={e=>setFilterCamp(e.target.value)}>
          <option value="">Toutes les campagnes</option>
          {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="crm-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {LEAD_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <span style={{fontSize:"13px",color:"#9B9B9B"}}>{filtered.length} résultat(s)</span>
      </div>
      <div className="crm-card">
        <table className="crm-table">
          <thead><tr><th>#</th><th>Nom</th><th>Téléphone</th><th>Adresse</th><th>Statut</th><th>Commentaire</th><th>Campagne</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length===0?(<tr><td colSpan={8} style={{textAlign:"center",padding:"32px",color:"#9B9B9B"}}>Aucun lead trouvé</td></tr>)
            :filtered.map(l=>{
              const camp=campaigns.find(c=>c.id===l.campId);
              return(
                <tr key={l.id}>
                  <td style={{color:"#9B9B9B",fontSize:"12px"}}>#{l.id}</td>
                  <td><p style={{fontWeight:600}}>{l.nom} {l.prenom}</p></td>
                  <td style={{color:"#374151"}}>{l.tel}</td>
                  <td style={{fontSize:"12.5px",color:"#6B7280",maxWidth:"160px"}}>{l.adresse}</td>
                  <td><DispBadge status={l.status}/></td>
                  <td style={{fontSize:"12.5px",color:"#6B7280",maxWidth:"160px"}}>{l.comment}</td>
                  <td>{camp&&<span className="badge badge-orange">{camp.name}</span>}</td>
                  <td><div className="action-row"><button className="btn" onClick={()=>openEdit(l)}>Modifier</button><button className="btn btn-danger" onClick={()=>del(l.id)}>Supprimer</button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal&&(
        <Modal title={editId?"Modifier le lead":"Ajouter un lead"} onClose={()=>setShowModal(false)} onSave={save}>
          <Field label="Campagne"><select className="form-control" value={form.campId} onChange={e=>setForm({...form,campId:e.target.value})}>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <Field label="Nom"><input className="form-control" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom"/></Field>
            <Field label="Prénom"><input className="form-control" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></Field>
          </div>
          <Field label="Téléphone"><input className="form-control" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="06xxxxxxxx"/></Field>
          <Field label="Adresse"><input className="form-control" value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})} placeholder="Adresse complète"/></Field>
          <Field label="Statut"><select className="form-control" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="">— Non traité —</option>{LEAD_STATUSES.map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="Commentaire"><textarea className="form-control" value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} placeholder="Notes..."/></Field>
        </Modal>
      )}
    </div>
  );
}

function StatsTab({ leads, agents }) {
  const tot=leads.length, ok=leads.filter(l=>l.status==="OK").length;
  const taux=tot?Math.round(ok/tot*100):0;
  const stats=agents.map(a=>{
    const ag=leads.filter(l=>l.agent===a.name);
    const o=ag.filter(l=>l.status==="OK").length;
    return{name:a.name,ok:o,hc:ag.filter(l=>l.status==="Hors cible").length,am:ag.filter(l=>l.status==="Answering Machine").length,dnc:ag.filter(l=>l.status==="Do Not Call").length,tot:ag.length,pct:ag.length?Math.round(o/ag.length*100):0};
  });
  return (
    <div>
      <PageHeader title="Statistiques" subtitle="Performance globale et par agent"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"14px",marginBottom:"22px"}}>
        {[{label:"Total leads",value:tot,color:"#111",accent:"#F97316"},{label:"Total OK",value:ok,color:"#059669",accent:"#059669"},{label:"Taux OK global",value:taux+"%",color:"#F97316",accent:"#F97316"}].map(k=>(
          <div key={k.label} className="kpi-card" style={{borderLeft:"3px solid "+k.accent}}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value" style={{color:k.color}}>{k.value}</p>
          </div>
        ))}
      </div>
      <div className="crm-card">
        <div className="crm-card-header"><span className="crm-card-title">Performance par agent</span></div>
        <table className="crm-table">
          <thead><tr><th>Agent</th><th>Total</th><th>OK</th><th>Hors cible</th><th>Ans. Machine</th><th>DNC</th><th>Taux OK</th></tr></thead>
          <tbody>
            {stats.map(s=>(
              <tr key={s.name}>
                <td style={{fontWeight:600}}>{s.name}</td>
                <td>{s.tot}</td>
                <td style={{fontWeight:700,color:"#059669"}}>{s.ok}</td>
                <td style={{color:"#DC2626"}}>{s.hc}</td>
                <td style={{color:"#D97706"}}>{s.am}</td>
                <td style={{color:"#6B7280"}}>{s.dnc}</td>
                <td><div className="progress-wrap"><div className="progress-track"><div className="progress-fill" style={{width:s.pct+"%"}}/></div><span style={{fontSize:"12px",fontWeight:600,color:"#F97316",minWidth:"36px"}}>{s.pct}%</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CampagnesTab({ campaigns, setCampaigns }) {
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({name:"",total:""});
  const [nextId,setNextId]=useState(4);
  const save=()=>{
    if(!form.name.trim()||!form.total)return;
    setCampaigns([...campaigns,{id:nextId,name:form.name,status:"Active",total:parseInt(form.total),traite:0}]);
    setNextId(n=>n+1);setForm({name:"",total:""});setShowModal(false);
  };
  const toggle=(id)=>setCampaigns(campaigns.map(c=>c.id===id?{...c,status:c.status==="Active"?"En pause":"Active"}:c));
  const del=(id)=>{if(!window.confirm("Supprimer cette campagne ?"))return;setCampaigns(campaigns.filter(c=>c.id!==id));};
  return (
    <div>
      <PageHeader title="Campagnes" subtitle={campaigns.length+" campagne(s) configurées"} action={<button className="btn-primary" onClick={()=>setShowModal(true)}>+ Nouvelle campagne</button>}/>
      <div className="crm-card">
        <table className="crm-table">
          <thead><tr><th>Campagne</th><th>Statut</th><th>Leads total</th><th>Restants</th><th>Progression</th><th>Actions</th></tr></thead>
          <tbody>
            {campaigns.length===0?(<tr><td colSpan={6} style={{textAlign:"center",padding:"32px",color:"#9B9B9B"}}>Aucune campagne</td></tr>)
            :campaigns.map(c=>{
              const pct=c.total?Math.round(c.traite/c.total*100):0;
              return(
                <tr key={c.id}>
                  <td style={{fontWeight:600}}>{c.name}</td>
                  <td><span className={"badge "+(c.status==="Active"?"badge-green":"badge-yellow")}>{c.status}</span></td>
                  <td>{c.total}</td>
                  <td style={{fontWeight:600,color:"#F97316"}}>{c.total-c.traite}</td>
                  <td style={{minWidth:"160px"}}><div className="progress-wrap"><div className="progress-track"><div className="progress-fill" style={{width:pct+"%"}}/></div><span style={{fontSize:"12px",fontWeight:600,color:"#F97316",minWidth:"36px"}}>{pct}%</span></div></td>
                  <td><div className="action-row"><button className={"btn "+(c.status==="Active"?"btn-warning":"btn-info")} onClick={()=>toggle(c.id)}>{c.status==="Active"?"Pause":"Activer"}</button><button className="btn btn-danger" onClick={()=>del(c.id)}>Supprimer</button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal&&(
        <Modal title="Nouvelle campagne" onClose={()=>setShowModal(false)} onSave={save}>
          <Field label="Nom de la campagne"><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: Campagne Été 2025"/></Field>
          <Field label="Nombre de leads total"><input className="form-control" type="number" value={form.total} onChange={e=>setForm({...form,total:e.target.value})} placeholder="500"/></Field>
        </Modal>
      )}
    </div>
  );
}

export default function Manager() {
  const [tab,setTab]=useState("agents");
  const [agents,setAgents]=useState(initialAgents);
  const [leads,setLeads]=useState(initialLeads);
  const [campaigns,setCampaigns]=useState(initialCampaigns);
  const TABS=[{id:"agents",label:"Agents"},{id:"leads",label:"Leads"},{id:"stats",label:"Statistiques"},{id:"campagnes",label:"Campagnes"}];
  return (
    <div>
      <div className="page-tabs">
        {TABS.map(t=><button key={t.id} className={"page-tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>
      {tab==="agents"&&<AgentsTab agents={agents} setAgents={setAgents}/>}
      {tab==="leads"&&<LeadsTab leads={leads} setLeads={setLeads} campaigns={campaigns} agents={agents}/>}
      {tab==="stats"&&<StatsTab leads={leads} agents={agents}/>}
      {tab==="campagnes"&&<CampagnesTab campaigns={campaigns} setCampaigns={setCampaigns}/>}
    </div>
  );
}