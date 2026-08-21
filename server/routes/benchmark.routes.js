import express from "express";
import { runBenchmark, getAvailableModels } from "../controllers/benchmark.controller.js";
import { getBenchmarkStatus } from "../controllers/model.controller.js";

const router = express.Router();

// POST /api/benchmark - Multi-model parallel inference dispatcher
router.post("/", runBenchmark);

// GET /api/benchmark/models - Available models specifications
router.get("/models", getAvailableModels);

// GET /api/benchmark/status/:jobId & /api/benchmark/job/:jobId - Track status, progress %, logs, and metrics of a Benchmark Job
router.get("/status/:jobId", getBenchmarkStatus);
router.get("/job/:jobId", getBenchmarkStatus);
router.get("/:jobId", getBenchmarkStatus);

export default router;
