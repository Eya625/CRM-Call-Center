import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./Config/db.js";
import leadRoutes from "./Routes/leadRoutes.js";
import campagneRoutes from "./Routes/campagneRoutes.js";
import agentRoutes from "./Routes/agentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route test serveur
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Test DB
app.get("/test-db", async (req, res) => {
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

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userQuery.rows.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const user = userQuery.rows[0];

    if (user.password !== password) return res.status(401).json({ error: "Invalid email or password" });

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

app.use("/api/leads", leadRoutes);
app.use("/api/campagnes", campagneRoutes);
app.use("/api/agents", agentRoutes);


//  IMPORTANT : utiliser httpServer.listen, pas app.listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});