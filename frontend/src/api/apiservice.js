import axios from "axios";

// instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* =========================
   AGENTS API
========================= */
export const getAgents = async () => {
  const res = await api.get("/agents");
  return res.data;
};

export const createAgent = async (data) => {
  const res = await api.post("/agents", data);
  return res.data;
};

export const updateAgent = async (id, data) => {
  const res = await api.put(`/agents/${id}`, data);
  return res.data;
};

export const deleteAgent = async (id) => {
  const res = await api.delete(`/agents/${id}`);
  return res.data;
};


/* =========================
   LEADS API
========================= */
export const getLeads = async () => {
  const res = await api.get("/leads");
  return res.data;
};

export const createLead = async (data) => {
  const res = await api.post("/leads", data);
  return res.data;
};

export const updateLead = async (id, data) => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};

export const deleteLead = async (id) => {
  const res = await api.delete(`/leads/${id}`);
  return res.data;
};


/* =========================
   CAMPAGNES API
========================= */
export const getCampaigns = async () => {
  const res = await api.get("/campagnes");
  return res.data;
};

export const createCampaign = async (data) => {
  const res = await api.post("/campagnes", data);
  return res.data;
};

export const updateCampaign = async (id, data) => {
  const res = await api.put(`/campagnes/${id}`, data);
  return res.data;
};

export const deleteCampaign = async (id) => {
  const res = await api.delete(`/campagnes/${id}`);
  return res.data;
};

export default api;