import express from "express";
import { registerModel, listModels } from "../controllers/model.controller.js";
import { uploadModelFiles } from "../middleware/upload.middleware.js";

const router = express.Router();

// POST /api/models/register - Accepts JSON or Multipart Modelfile / GGUF
router.post("/register", uploadModelFiles.single("file"), registerModel);

// GET /api/models - List all models with benchmark history
router.get("/", listModels);

export default router;
