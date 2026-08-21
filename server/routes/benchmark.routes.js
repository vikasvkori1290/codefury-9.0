import express from "express";
import { runBenchmark, getAvailableModels } from "../controllers/benchmark.controller.js";

const router = express.Router();

// POST /api/benchmark - Parallel Multi-Model Dispatcher
router.post("/", runBenchmark);

// GET /api/benchmark/models - Available Models Catalog
router.get("/models", getAvailableModels);

export default router;
