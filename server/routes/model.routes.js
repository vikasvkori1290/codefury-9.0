import express from "express";
import { registerModel, listModels, compareDecision } from "../controllers/model.controller.js";
import { uploadModelFiles } from "../middleware/upload.middleware.js";

const router = express.Router();

// POST /api/models/register - Accepts JSON or Multipart Modelfile / GGUF
router.post("/register", uploadModelFiles.single("file"), registerModel);

// GET /api/models - List all models with benchmark history
router.get("/", listModels);

// POST /api/models/compare-decision - Run multi-criteria decision algorithm
router.post("/compare-decision", compareDecision);

export default router;

