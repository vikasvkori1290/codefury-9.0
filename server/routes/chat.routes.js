import express from "express";
import { chatWithModel } from "../controllers/chat.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/chat - Playground model chat (Protected)
router.post("/", protect, chatWithModel);

export default router;
