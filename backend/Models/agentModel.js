import pool from "../Config/db.js";

const AgentModel = {

  // récupérer tous les agents
  getAll: async () => {
    const result = await pool.query("SELECT * FROM agents");
    return result.rows;
  },

  // login agent
  login: async (login, mot_de_passe) => {
    const result = await pool.query(
      "SELECT * FROM agents WHERE login = $1 AND mot_de_passe = $2",
      [login, mot_de_passe]
    );
    return result.rows[0];
  },

  // changer statut
  updateStatus: async (id, statut) => {
    const result = await pool.query(
      "UPDATE agents SET statut = $1 WHERE id = $2 RETURNING *",
      [statut, id]
    );
    return result.rows[0];
  }

};

export default AgentModel;