import pool from "../Config/db.js";

const CampagneModel = {

  // récupérer toutes les campagnes
  getAll: async () => {
    const result = await pool.query("SELECT * FROM campagnes ORDER BY id DESC");
    return result.rows;
  },

  // récupérer une campagne par ID
  getById: async (id) => {
    const result = await pool.query(
      "SELECT * FROM campagnes WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  // créer une campagne
  create: async (nom) => {
    const result = await pool.query(
      "INSERT INTO campagnes (nom) VALUES ($1) RETURNING *",
      [nom]
    );
    return result.rows[0];
  },

  // changer statut (Active / Inactive)
  updateStatus: async (id, statut) => {
    const result = await pool.query(
      "UPDATE campagnes SET statut = $1 WHERE id = $2 RETURNING *",
      [statut, id]
    );
    return result.rows[0];
  }

};

export default CampagneModel;