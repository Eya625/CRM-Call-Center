import express from "express";
import AgentController from "../Controllers/agentController.js";

const router = express.Router();

router.get("/", AgentController.getAll);
router.post("/login", AgentController.login);
router.put("/:id/status", AgentController.updateStatus);

export default router;