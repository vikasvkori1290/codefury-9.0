import mongoose from "mongoose";
import ModelListing from "../models/ModelListing.model.js";
import BenchmarkJob from "../models/BenchmarkJob.model.js";
import { addBenchmarkJob } from "../config/queue.js";
import jobStore from "../services/jobStore.js";
import { runCommand } from "../services/command.service.js";
import { encryptCredential, redactSecret } from "../services/credential.service.js";

const withoutCredential = (model) => {
  if (!model) return null;
  const safe = typeof model.toObject === "function" ? model.toObject() : { ...model };
  delete safe.apiKeyEncrypted;
  return safe;
};

/**
 * @desc Register a new AI Model (JSON, Modelfile/GGUF upload, or API Key) and trigger benchmark job
 * @route POST /api/models/register
 * @access Public
 */
export const registerModel = async (req, res, next) => {
  try {
    const {
      modelName,
      name,
      creator = "@anonymous_creator",
      category = "General",
      pricing,
      pricingPer1kTokens,
      provider = "ollama_local",
      apiKey,
      apiProvider,
      endpoint,
    } = req.body;

    const finalModelName = modelName || name;
    if (!finalModelName || !finalModelName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Model name ('modelName') is required.",
      });
    }

    const uploadedFile = req.file;
    let finalProvider = provider;
    let uploadedFilePath = null;
    const isApiModel = Boolean(apiKey) || provider === "custom_api";
    if (isApiModel && !apiKey?.trim()) {
      return res.status(400).json({ success: false, message: "An API key is required for remote model benchmarking." });
    }
    const encryptedApiKey = apiKey ? encryptCredential(apiKey.trim()) : null;

    if (uploadedFile) {
      finalProvider = "modelfile_upload";
      uploadedFilePath = uploadedFile.path;

      try {
        console.log(`[Ollama] Creating model '${finalModelName.trim()}'...`);
        await runCommand("ollama", ["create", finalModelName.trim(), "-f", uploadedFilePath], { timeoutMs: 10 * 60 * 1000 });
      } catch (ollamaErr) {
        console.warn("Ollama create unavailable or failed:", ollamaErr.message);
      }
    } else if (isApiModel) {
      finalProvider = "custom_api";
    }

    const isMongooseConnected = mongoose.connection.readyState === 1;
    let modelListing = null;
    let benchmarkJob = null;
    const fallbackId = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const jobFallbackId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (isMongooseConnected) {
      try {
        modelListing = await ModelListing.create({
          name: finalModelName.trim(),
          creator: creator.trim(),
          provider: finalProvider,
          category: category.trim(),
          pricingPer1kTokens: Number(pricing || pricingPer1kTokens) || 0.00015,
          uploadedFilePath,
          apiProvider: apiProvider || "openai",
          modelIdentifier: finalModelName.trim(),
          endpoint: endpoint || null,
          apiKeyEncrypted: encryptedApiKey,
          credentialStatus: isApiModel ? "pending" : "not_required",
        });

        benchmarkJob = await BenchmarkJob.create({
          modelListingId: modelListing._id,
          modelName: modelListing.name,
          status: "queued",
          progress: 0,
          logs: [`[${new Date().toISOString()}] Benchmark job queued for model '${modelListing.name}' via ${finalProvider}.`],
        });

        modelListing.latestBenchmark = benchmarkJob._id;
        await modelListing.save();
      } catch (dbErr) {
        console.warn("MongoDB write fallback:", dbErr.message);
      }
    }

    if (!modelListing || !benchmarkJob) {
      modelListing = {
        _id: fallbackId,
        name: finalModelName.trim(),
        creator: creator.trim(),
        provider: finalProvider,
        category: category.trim(),
        pricingPer1kTokens: Number(pricing || pricingPer1kTokens) || 0.00015,
        uploadedFilePath,
        apiProvider: apiProvider || "openai",
        modelIdentifier: finalModelName.trim(),
        endpoint: endpoint || null,
        apiKeyEncrypted: encryptedApiKey,
        credentialStatus: isApiModel ? "pending" : "not_required",
        latestBenchmark: jobFallbackId,
        createdAt: new Date().toISOString(),
      };

      benchmarkJob = {
        _id: jobFallbackId,
        modelListingId: fallbackId,
        modelName: modelListing.name,
        status: "queued",
        progress: 0,
        logs: [`[${new Date().toISOString()}] Benchmark job queued for model '${modelListing.name}' via ${finalProvider}.`],
        createdAt: new Date().toISOString(),
      };
    }

    const jobIdStr = (benchmarkJob._id || jobFallbackId).toString();
    const modelIdStr = (modelListing._id || fallbackId).toString();

    // Persist to jobStore
    jobStore.setJob(jobIdStr, benchmarkJob);
    jobStore.setModel(modelIdStr, modelListing);

    // Dispatch to BullMQ Queue / Promptfoo Runner
    await addBenchmarkJob({
      jobId: jobIdStr,
      modelName: modelListing.name,
    });

    const safeModel = { ...modelListing };
    delete safeModel.apiKeyEncrypted;

    return res.status(201).json({
      success: true,
      message: "Model registered and benchmark queued successfully.",
      jobId: jobIdStr,
      modelId: modelIdStr,
      model: safeModel,
    });
  } catch (error) {
    next(new Error(redactSecret(error.message)));
  }
};

/**
 * @desc Get status, progress, logs, and metrics of a Benchmark Job
 * @route GET /api/benchmark/status/:jobId
 * @access Public
 */
export const getBenchmarkStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const isMongooseConnected = mongoose.connection.readyState === 1;

    let job = null;
    if (isMongooseConnected && mongoose.Types.ObjectId.isValid(jobId)) {
      job = await BenchmarkJob.findById(jobId).populate("modelListingId").catch(() => null);
    }

    if (!job) {
      job = jobStore.getJob(jobId);
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Benchmark job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      jobId: job._id,
      modelName: job.modelName,
      status: job.status,
      progress: job.progress,
      metrics: job.metrics || null,
      logs: job.logs || [],
      error: job.error || null,
      model: withoutCredential(job.modelListingId),
      updatedAt: job.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc List all registered marketplace models with benchmark history
 * @route GET /api/models
 * @access Public
 */
export const listModels = async (req, res, next) => {
  try {
    const isMongooseConnected = mongoose.connection.readyState === 1;
    let models = [];

    if (isMongooseConnected) {
      models = await ModelListing.find().select("-apiKeyEncrypted")
        .populate("latestBenchmark")
        .sort({ createdAt: -1 })
        .catch(() => []);
    }

    if (models.length === 0) {
      models = jobStore.getAllModels();
    }

    return res.status(200).json({
      success: true,
      count: models.length,
      models: models.map(withoutCredential),
    });
  } catch (error) {
    next(error);
  }
};
