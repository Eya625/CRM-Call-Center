import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./Config/db.js";
import leadRoutes from "./Routes/leadRoutes.js";
import campagneRoutes from "./Routes/campagneRoutes.js";
import agentRoutes from "./Routes/agentRoutes.js";
import multer from "multer";
import * as xlsx from "xlsx";
import ami, { pingAmi, originateCall } from "./amiConnection.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// -------------------- HTTP SERVER + SOCKET.IO --------------------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
// Socket.IO connection
io.on("connection", (socket) => {
  console.log("⚡ Frontend connected via Socket.IO");
});



// Route test serveur
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Test DB
app.get("/db-crm", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- LOGIN ROUTE --------------------
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userQuery.rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = userQuery.rows[0];

    if (user.password !== password)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB ERROR:", err);
  } else {
    console.log("DB CONNECTED:", res.rows[0]);
  }
});
// routes principales
app.use("/api/leads", leadRoutes);
app.use("/api/campagnes", campagneRoutes);
app.use("/api/agents", agentRoutes);



// ════════════════════════════════════════
//  AGENTS
// ════════════════════════════════════════
app.get("/api/agents", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM agents ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/agents", async (req, res) => {
  const { nom, login, mot_de_passe, statut } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO agents (nom, login, mot_de_passe, statut) VALUES ($1,$2,$3,$4) RETURNING *",
      [nom, login, mot_de_passe, statut || "Disponible"],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/agents/:id", async (req, res) => {
  const { nom, login, mot_de_passe, statut } = req.body;
  try {
    const result = await pool.query(
      `UPDATE agents SET nom=$1, login=$2, mot_de_passe=$3, statut=$4 WHERE id=$5 RETURNING *`,
      [nom, login, mot_de_passe, statut, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/agents/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM agents WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════
//   CAMPAGNES
// ════════════════════════════════════════

// 1. GET ALL
app.get("/api/campagnes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campagnes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE CAMPAGNE (MANUAL)
app.post("/api/campagnes", async (req, res) => {
  const { nom, statut } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO campagnes (nom, statut) VALUES ($1,$2) RETURNING *",
      [nom, statut || "Active"],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE CAMPAGNE
app.delete("/api/campagnes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM leads WHERE campagne_id = $1", [id]);
    const result = await pool.query(
      "DELETE FROM campagnes WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campagne introuvable!" });
    }
    res.json({ success: true, message: "Campagne wel leads mte3ha t-farksu!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. TOGGLE STATUT (STATUS)
app.put("/api/campagnes/:id/status", async (req, res) => {
  const { id } = req.params;
  const statut = req.body.statut || req.body.status;

  if (!statut) {
    return res
      .status(400)
      .json({ error: "Brabi ab3ath el statut (Active walla En pause)!" });
  }

  try {
    const result = await pool.query(
      "UPDATE campagnes SET statut = $1 WHERE id = $2 RETURNING *",
      [statut, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campagne introuvable!" });
    }
    res.json({ success: true, campagne: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. UPDATE KOL CHAY (Nom w Statut)
app.put("/api/campagnes/:id", async (req, res) => {
  const { nom, statut } = req.body;
  try {
    const result = await pool.query(
      "UPDATE campagnes SET nom=$1, statut=$2 WHERE id=$3 RETURNING *",
      [nom, statut, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. UPLOAD EXCEL
app.post("/api/campagnes/upload", upload.single("file"), async (req, res) => {
  const { nom } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "Famas ficher Excel!" });

  try {
    const campResult = await pool.query(
      "INSERT INTO campagnes (nom, statut) VALUES ($1, $2) RETURNING *",
      [nom, "Active"],
    );
    const newCampagne = campResult.rows[0];
    const campagneId = newCampagne.id;

    const workbook = xlsx.read(file.buffer, { type: "buffer" });

    let allLeads = [];

    // ✅ Yaqra KOL sheets
    for (let sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      // ✅ Skip sheets farghine
      if (data.length === 0) continue;
      allLeads = allLeads.concat(data);
    }

    const leadsData = allLeads;
    let leadsInserted = 0;

    for (let row of leadsData) {
      const normalizedRow = {};
      for (let key in row) {
        if (row[key] !== undefined && row[key] !== null) {
          normalizedRow[key.toLowerCase().trim()] = row[key];
        }
      }

      // ✅ Skip header rows (eli fiha "telephone" kkalima mch numero)
      if (
        String(normalizedRow.telephone || "")
          .toLowerCase()
          .trim() === "telephone"
      )
        continue;

      const nom_lead =
        normalizedRow.nom ||
        normalizedRow.name ||
        normalizedRow["nom prospect"] ||
        normalizedRow["client"] ||
        "";
      const prenom = normalizedRow.prenom || normalizedRow.firstname || "";
      const telephone =
        normalizedRow.telephone ||
        normalizedRow.tel ||
        normalizedRow.phone ||
        normalizedRow["num telephone"] ||
        normalizedRow["numéro"] ||
        "";
      const adresse =
        normalizedRow.adresse ||
        normalizedRow.address ||
        normalizedRow["adresse complète"] ||
        "";

      // ✅ Skip ken ma famash telephone
      if (!telephone || String(telephone).trim() === "") continue;

      // ✅ Check duplicate f KOL el table (msh ken nefs campagne)
      const checkLead = await pool.query(
        "SELECT id FROM leads WHERE telephone = $1",
        [String(telephone).trim()],
      );

      if (checkLead.rows.length === 0) {
        await pool.query(
          `INSERT INTO leads (campagne_id, nom, prenom, telephone, adresse, statut, commentaire) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            campagneId,
            String(nom_lead).trim(),
            String(prenom).trim(),
            String(telephone).trim(),
            String(adresse).trim(),
            "Non traité",
            "",
          ],
        );
        leadsInserted++;
      }
    }

    res.json({
      message: "Campagne et leads créés avec succès !",
      campagne: newCampagne,
      leadsInserted: leadsInserted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════
//  LEADS
// ════════════════════════════════════════
app.get("/api/leads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/leads", async (req, res) => {
  const {
    campagne_id,
    nom,
    prenom,
    telephone,
    adresse,
    statut,
    commentaire,
    agent_name,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO leads (campagne_id,nom,prenom,telephone,adresse,statut,commentaire,agent_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        campagne_id,
        nom,
        prenom,
        telephone,
        adresse,
        statut || null,
        commentaire || "",
        agent_name || "",
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/leads/:id", async (req, res) => {
  const {
    campagne_id,
    nom,
    prenom,
    telephone,
    adresse,
    statut,
    commentaire,
    agent_name,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE leads SET campagne_id=$1,nom=$2,prenom=$3,telephone=$4,
       adresse=$5,statut=$6,commentaire=$7,agent_name=$8 WHERE id=$9 RETURNING *`,
      [
        campagne_id,
        nom,
        prenom,
        telephone,
        adresse,
        statut,
        commentaire,
        agent_name,
        req.params.id,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM leads WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════
//   START-CALLING
// ════════════════════════════════════════

// -------------------- CALL CENTER --------------------
// Ping AMI au démarrage
setTimeout(() => pingAmi(), 2000);

// -------------------- START-CALLING --------------------
app.post("/start-calling", async (req, res) => {
  try {
    const { agentId } = req.body;

    const leadsResult = await pool.query(
      "SELECT * FROM leads WHERE statut='Non traité' ORDER BY id"
    );
    const leads = leadsResult.rows;

    if (!leads || leads.length === 0) return res.json({ message: "Aucun lead à appeler" });

    const firstLead = leads[0];
    if (!firstLead.telephone)
      return res.status(400).json({ error: "Lead sans téléphone" });

    const agentExt = "agent";
    const phoneNumber = firstLead.telephone;

    console.log("📞 Calling:", phoneNumber);

    // Originate call via AMI
    await originateCall({
      fromExt: agentExt,
      toExt: phoneNumber,
      context: "internal",
      callerId: "AutoDialer",
    });

    // Notifier le frontend via Socket.IO
    io.emit("incomingCall", { number: phoneNumber });

    res.json({ message: "Call triggered", phoneNumber });
  } catch (err) {
    console.error("🔥 ERROR /start-calling:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});