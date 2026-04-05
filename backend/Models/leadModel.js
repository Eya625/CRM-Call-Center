import pool from "../Config/db.js";

const LeadModel = {

  // récupérer tous les leads
  getAllLeads: async () => {
    const result = await pool.query("SELECT * FROM leads");
    return result.rows;
  },

  // récupérer lead non traité
  getNextLead: async () => {
    const result = await pool.query(
      "SELECT * FROM leads WHERE statut = 'Non traité' LIMIT 1"
    );
    return result.rows[0];
  },

  // update lead après appel
  updateLead: async (id, data) => {
    const { statut, commentaire, agent_name, duree } = data;

    const result = await pool.query(
      `UPDATE leads 
       SET statut = $1, commentaire = $2, agent_name = $3, duree = $4
       WHERE id = $5 RETURNING *`,
      [statut, commentaire, agent_name, duree, id]
    );

    return result.rows[0];
  }

};

export default LeadModel;