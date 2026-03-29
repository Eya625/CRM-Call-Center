import { useState } from "react";

const initialUsers = [
  { id: 1, name: "Ali Ben Salem", username: "agent.ali", role: "Agent", campaign: "Campagne Été 2025", status: "Actif" },
  { id: 2, name: "Sarra Mani", username: "agent.sarra", role: "Agent", campaign: "Relance Clients", status: "Actif" },
  { id: 3, name: "Mehdi Trabelsi", username: "agent.mehdi", role: "Agent", campaign: "Campagne Été 2025", status: "Inactif" },
  { id: 4, name: "Ines Chabbi", username: "manager.ines", role: "Manager", campaign: "Tous", status: "Actif" },
];

const initialCampaigns = [
  { id: 1, name: "Campagne Été 2025", type: "Predictive", status: "Active", numero: "0700000001", agents: 2 },
  { id: 2, name: "Relance Clients", type: "Progressive", status: "En pause", numero: "0700000002", agents: 1 },
  { id: 3, name: "Nouveaux Leads", type: "Preview", status: "Active", numero: "0700000003", agents: 0 },
];

const pauseCodes = ["Pause café", "Pause déjeuner", "Formation", "Réunion", "Problème technique"];
const dispositionCodes = ["OK", "Hors cible", "Answering Machine", "Do Not Call", "Rappel", "Fax"];

const roleColor = (role) => {
  if (role === "Admin") return "bg-purple-100 text-purple-800";
  if (role === "Manager") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
};

const statusColor = (status) => {
  if (status === "Actif" || status === "Active") return "bg-green-100 text-green-800";
  return "bg-red-100 text-red-800";
};

export default function admin() {
  const [activeTab, setActiveTab] = useState("utilisateurs");
  const [users, setUsers] = useState(initialUsers);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", username: "", role: "Agent", campaign: "", status: "Actif" });
  const [newCampaign, setNewCampaign] = useState({ name: "", type: "Preview", numero: "", status: "Active" });

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));
  const deleteCampaign = (id) => setCampaigns(prev => prev.filter(c => c.id !== id));

  const addUser = () => {
    if (!newUser.name || !newUser.username) return;
    setUsers(prev => [...prev, { ...newUser, id: Date.now() }]);
    setNewUser({ name: "", username: "", role: "Agent", campaign: "", status: "Actif" });
    setShowAddUser(false);
  };

  const addCampaign = () => {
    if (!newCampaign.name || !newCampaign.numero) return;
    setCampaigns(prev => [...prev, { ...newCampaign, id: Date.now(), agents: 0 }]);
    setNewCampaign({ name: "", type: "Preview", numero: "", status: "Active" });
    setShowAddCampaign(false);
  };

  const toggleCampaignStatus = (id) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "Active" ? "En pause" : "Active" } : c
    ));
  };

  const inputClass = "bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 w-full";
  const selectClass = "bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 w-full";

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex gap-6">
          {["utilisateurs", "campagnes", "configuration", "rapports"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 capitalize transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">

        {/* Utilisateurs */}
        {activeTab === "utilisateurs" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-white">{users.length} utilisateur(s)</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                + Ajouter utilisateur
              </button>
            </div>

            {/* Formulaire ajout user */}
            {showAddUser && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3">
                <h3 className="font-semibold text-white">Nouvel utilisateur</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Nom complet</label>
                    <input className={inputClass} placeholder="Ex: Ali Ben Salem" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Username</label>
                    <input className={inputClass} placeholder="Ex: agent.ali" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Rôle</label>
                    <select className={selectClass} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                      <option>Agent</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Campagne</label>
                    <select className={selectClass} value={newUser.campaign} onChange={e => setNewUser({...newUser, campaign: e.target.value})}>
                      <option value="">Aucune</option>
                      {campaigns.map(c => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addUser} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors">Confirmer</button>
                  <button onClick={() => setShowAddUser(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">Annuler</button>
                </div>
              </div>
            )}

            {/* Tableau users */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left px-5 py-3">Nom</th>
                    <th className="text-left px-5 py-3">Username</th>
                    <th className="text-left px-5 py-3">Rôle</th>
                    <th className="text-left px-5 py-3">Campagne</th>
                    <th className="text-left px-5 py-3">Statut</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-5 py-4 font-medium">{user.name}</td>
                      <td className="px-5 py-4 text-gray-300">{user.username}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{user.campaign || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors">
                            Modifier
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Campagnes */}
        {activeTab === "campagnes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-white">{campaigns.length} campagne(s)</h2>
              <button
                onClick={() => setShowAddCampaign(!showAddCampaign)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                + Nouvelle campagne
              </button>
            </div>

            {/* Formulaire ajout campagne */}
            {showAddCampaign && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3">
                <h3 className="font-semibold text-white">Nouvelle campagne</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Nom campagne</label>
                    <input className={inputClass} placeholder="Ex: Campagne Printemps" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Numéro appelant</label>
                    <input className={inputClass} placeholder="Ex: 0700000001" value={newCampaign.numero} onChange={e => setNewCampaign({...newCampaign, numero: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Type dialer</label>
                    <select className={selectClass} value={newCampaign.type} onChange={e => setNewCampaign({...newCampaign, type: e.target.value})}>
                      <option>Preview</option>
                      <option>Progressive</option>
                      <option>Predictive</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Statut initial</label>
                    <select className={selectClass} value={newCampaign.status} onChange={e => setNewCampaign({...newCampaign, status: e.target.value})}>
                      <option>Active</option>
                      <option>En pause</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addCampaign} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors">Confirmer</button>
                  <button onClick={() => setShowAddCampaign(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">Annuler</button>
                </div>
              </div>
            )}

            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left px-5 py-3">Campagne</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Numéro</th>
                    <th className="text-left px-5 py-3">Agents</th>
                    <th className="text-left px-5 py-3">Statut</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(camp => (
                    <tr key={camp.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-5 py-4 font-medium">{camp.name}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {camp.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{camp.numero}</td>
                      <td className="px-5 py-4 text-gray-300">{camp.agents}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(camp.status)}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleCampaignStatus(camp.id)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              camp.status === "Active" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {camp.status === "Active" ? "Pause" : "Activer"}
                          </button>
                          <button
                            onClick={() => deleteCampaign(camp.id)}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Configuration */}
        {activeTab === "configuration" && (
          <div className="grid grid-cols-2 gap-6">

            {/* Pause codes */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="font-semibold text-white mb-4">Codes de pause</h2>
              <div className="space-y-2">
                {pauseCodes.map((code, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                    <span className="text-sm text-white">{code}</span>
                    <button className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2" placeholder="Nouveau code..." />
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">Ajouter</button>
              </div>
            </div>

            {/* Disposition codes */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="font-semibold text-white mb-4">Codes disposition</h2>
              <div className="space-y-2">
                {dispositionCodes.map((code, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                    <span className="text-sm text-white">{code}</span>
                    <button className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2" placeholder="Nouveau code..." />
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">Ajouter</button>
              </div>
            </div>

            {/* Config SIP */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 col-span-2">
              <h2 className="font-semibold text-white mb-4">Configuration SIP / Asterisk</h2>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Host</label>
                  <input className={inputClass} defaultValue="192.168.1.100" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Port</label>
                  <input className={inputClass} defaultValue="5038" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Username AMI</label>
                  <input className={inputClass} defaultValue="admin" />
                </div>
              </div>
              <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* Rapports */}
        {activeTab === "rapports" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total appels", value: "1,248", sub: "ce mois" },
                { label: "Total OK", value: "387", sub: "conversions" },
                { label: "Taux OK global", value: "31%", sub: "performance" },
                { label: "Agents actifs", value: "4", sub: "aujourd'hui" },
                { label: "Campagnes actives", value: "2", sub: "en cours" },
                { label: "Heures travaillées", value: "128h", sub: "ce mois" },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="font-semibold text-white mb-4">Exporter les données</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm transition-colors">
                  Export CDR (CSV)
                </button>
                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm transition-colors">
                  Rapport agents (Excel)
                </button>
                <button className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-sm transition-colors">
                  Rapport campagnes (PDF)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}