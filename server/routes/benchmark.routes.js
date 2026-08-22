import express from "express";
import { runBenchmark, getAvailableModels } from "../controllers/benchmark.controller.js";
import { getBenchmarkStatus } from "../controllers/model.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/benchmark - Multi-model parallel inference dispatcher (Protected)
router.post("/", protect, runBenchmark);

// GET /api/benchmark/models - Available models specifications (Public)
router.get("/models", getAvailableModels);

// GET /api/benchmark/status/:jobId - Track benchmark status & telemetry (Protected)
router.get("/status/:jobId", protect, getBenchmarkStatus);
router.get("/job/:jobId", protect, getBenchmarkStatus);
router.get("/:jobId", protect, getBenchmarkStatus);

export default router;

