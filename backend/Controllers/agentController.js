import AgentModel from "../Models/agentModel.js";

const AgentController = {

  getAll: async (req, res) => {
    try {
      const agents = await AgentModel.getAll();
      res.json(agents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { login, mot_de_passe } = req.body;

      const agent = await AgentModel.login(login, mot_de_passe);

      if (!agent) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(agent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { statut } = req.body;
      const agent = await AgentModel.updateStatus(
        req.params.id,
        statut
      );
      res.json(agent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default AgentController;