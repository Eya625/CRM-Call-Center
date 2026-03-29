import { useState } from "react";

const agents = [
  { id: 1, name: "Agent Ali", status: "En appel", duration: "05:23", calls: 12, aht: "04:10" },
  { id: 2, name: "Agent Sarra", status: "Disponible", duration: "00:45", calls: 8, aht: "03:50" },
  { id: 3, name: "Agent Mehdi", status: "En pause", duration: "02:10", calls: 5, aht: "05:00" },
  { id: 4, name: "Agent Ines", status: "En appel", duration: "07:33", calls: 15, aht: "04:30" },
];

const statusColor = (status) => {
  if (status === "En appel") return "bg-green-100 text-green-800";
  if (status === "En pause") return "bg-yellow-100 text-yellow-800";
  return "bg-blue-100 text-blue-800";
};

export default function manager() {
  const [activeTab, setActiveTab] = useState("wallboard");

  const total = agents.length;
  const enAppel = agents.filter(a => a.status === "En appel").length;
  const enPause = agents.filter(a => a.status === "En pause").length;
  const disponible = agents.filter(a => a.status === "Disponible").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Manager Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex gap-6">
          {["wallboard", "statistiques", "campagnes"].map(tab => (
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

        {/* Wallboard Tab */}
        {activeTab === "wallboard" && (
          <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total agents", value: total, color: "text-white" },
                { label: "En appel", value: enAppel, color: "text-green-400" },
                { label: "En pause", value: enPause, color: "text-yellow-400" },
                { label: "Disponibles", value: disponible, color: "text-blue-400" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">{kpi.label}</p>
                  <p className={`text-4xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Agents Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="font-semibold text-white">Agents en temps réel</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left px-5 py-3">Nom</th>
                    <th className="text-left px-5 py-3">Statut</th>
                    <th className="text-left px-5 py-3">Durée</th>
                    <th className="text-left px-5 py-3">Appels</th>
                    <th className="text-left px-5 py-3">AHT</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map(agent => (
                    <tr key={agent.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-5 py-4 font-medium">{agent.name}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{agent.duration}</td>
                      <td className="px-5 py-4 text-gray-300">{agent.calls}</td>
                      <td className="px-5 py-4 text-gray-300">{agent.aht}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Écouter
                          </button>
                          <button className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors">
                            Pause
                          </button>
                          <button className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                            Déconnecter
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

        {/* Statistiques Tab */}
        {activeTab === "statistiques" && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total appels", value: "248", sub: "aujourd'hui" },
              { label: "Taux de contact", value: "67%", sub: "moyenne" },
              { label: "Taux abandon", value: "4.2%", sub: "aujourd'hui" },
              { label: "AHT moyen", value: "04:22", sub: "min:sec" },
              { label: "ASA moyen", value: "00:18", sub: "min:sec" },
              { label: "Appels réussis", value: "166", sub: "aujourd'hui" },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Campagnes Tab */}
        {activeTab === "campagnes" && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="font-semibold text-white">Campagnes actives</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                + Nouvelle campagne
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left px-5 py-3">Campagne</th>
                  <th className="text-left px-5 py-3">Statut</th>
                  <th className="text-left px-5 py-3">Leads total</th>
                  <th className="text-left px-5 py-3">Restants</th>
                  <th className="text-left px-5 py-3">Progression</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Campagne Été 2025", status: "Active", total: 500, restants: 312 },
                  { name: "Relance Clients", status: "En pause", total: 200, restants: 89 },
                  { name: "Nouveaux Leads", status: "Active", total: 150, restants: 150 },
                ].map((camp, i) => {
                  const progress = Math.round(((camp.total - camp.restants) / camp.total) * 100);
                  return (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-5 py-4 font-medium">{camp.name}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          camp.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{camp.total}</td>
                      <td className="px-5 py-4 text-gray-300">{camp.restants}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-xs">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          camp.status === "Active"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}>
                          {camp.status === "Active" ? "Pause" : "Activer"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}