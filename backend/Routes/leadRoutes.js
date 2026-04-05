import express from "express";
import LeadController from "../Controllers/leadController.js";

const router = express.Router();

router.get("/", LeadController.getAll);
router.get("/next", LeadController.getNext);
router.put("/:id", LeadController.update);

export default router;