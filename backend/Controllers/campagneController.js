import CampagneModel from "../Models/campagneModel.js";

const CampagneController = {

  getAll: async (req, res) => {
    try {
      const campagnes = await CampagneModel.getAll();
      res.json(campagnes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const campagne = await CampagneModel.getById(req.params.id);
      res.json(campagne);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { nom } = req.body;
      const campagne = await CampagneModel.create(nom);
      res.json(campagne);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { statut } = req.body;
      const campagne = await CampagneModel.updateStatus(
        req.params.id,
        statut
      );
      res.json(campagne);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default CampagneController;