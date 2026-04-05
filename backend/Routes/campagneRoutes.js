import express from "express";
import CampagneController from "../Controllers/campagneController.js";

const router = express.Router();

router.get("/", CampagneController.getAll);
router.get("/:id", CampagneController.getOne);
router.post("/", CampagneController.create);
router.put("/:id/status", CampagneController.updateStatus);

export default router;