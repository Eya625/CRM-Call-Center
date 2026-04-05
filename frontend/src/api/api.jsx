import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// ─── AGENTS ───────────────────────────────────────────
export const getAgents   = ()          => API.get("/api/agents");
export const createAgent = (data)      => API.post("/api/agents", data);
export const updateAgent = (id, data)  => API.put(`/api/agents/${id}`, data);
export const deleteAgent = (id)        => API.delete(`/api/agents/${id}`);

// ─── CAMPAGNES ────────────────────────────────────────
export const getcampagnes   = ()          => API.get("/api/campagnes");
export const createcampagne = (data)      => API.post("/api/campagnes", data);
export const updatecampagne = (id, data)  => API.put(`/api/campagnes/${id}`, data);
export const deletecampagne = (id)        => API.delete(`/api/campagnes/${id}`);

// Zid hathi f-el api.jsx bsh n-kallmu el route el jdida 🎯
export const toggleCampagneStatus = (id, data) => API.put(`/api/campagnes/${id}/status`, data);

// ⚠️ ZID HATHI JDI-DA M-RAGGLE SEHLA LEL UPLOAD 🎯
export const uploadCampagneWithLeads = (formData) => 
  API.post("/api/campagnes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });


// ─── LEADS ────────────────────────────────────────────
export const getLeads   = ()          => API.get("/api/leads");
export const createLead = (data)      => API.post("/api/leads", data);
export const updateLead = (id, data)  => API.put(`/api/leads/${id}`, data);
export const deleteLead = (id)        => API.delete(`/api/leads/${id}`);