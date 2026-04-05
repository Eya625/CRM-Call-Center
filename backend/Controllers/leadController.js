import LeadModel from "../Models/leadModel.js";

const LeadController = {

  getAll: async (req, res) => {
    try {
      const leads = await LeadModel.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getNext: async (req, res) => {
    try {
      const lead = await LeadModel.getNextLead();
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedLead = await LeadModel.updateLead(id, req.body);
      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

export default LeadController;