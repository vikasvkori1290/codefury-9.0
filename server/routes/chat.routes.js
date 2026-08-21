import express from "express";
import { chatWithModel } from "../controllers/chat.controller.js";
const router = express.Router();
router.post("/", chatWithModel);
export default router;
