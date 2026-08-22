import express from "express";
import { registerModel, listModels, compareDecision } from "../controllers/model.controller.js";
import { uploadModelFiles } from "../middleware/upload.middleware.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/models/register - Accepts JSON or Multipart Modelfile / GGUF (Protected)
router.post("/register", protect, uploadModelFiles.single("file"), registerModel);

// GET /api/models - List all models with benchmark history (Public)
router.get("/", listModels);

// POST /api/models/compare-decision - Run multi-criteria decision algorithm (Protected)
router.post("/compare-decision", protect, compareDecision);

export default router;

