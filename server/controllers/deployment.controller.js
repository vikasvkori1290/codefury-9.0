import crypto from "crypto";
import mongoose from "mongoose";
import ModelListing from "../models/ModelListing.model.js";
import Deployment from "../models/Deployment.model.js";
import { runModelInference } from "../services/modelProviders.service.js";

const hashKey = (key) => crypto.createHash("sha256").update(key).digest("hex");
const modelId = (model) => model?._id?.toString() || model?.id?.toString() || model?.name;

const getModel = async (idOrName) => {
  if (!idOrName) return null;
  if (mongoose.connection.readyState === 1) {
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      const byId = await ModelListing.findById(idOrName).catch(() => null);
      if (byId) return byId;
    }
    const byName = await ModelListing.findOne({
      $or: [
        { name: idOrName },
        { modelIdentifier: idOrName },
        { "metadata.displayName": idOrName },
      ],
    }).catch(() => null);
    if (byName) return byName;
  }
  // Fallback descriptor for static/frontier/remote models
  return {
    _id: idOrName,
    name: idOrName,
    provider: "forge",
    status: "active",
  };
};

export const deployModel = async (req, res, next) => {
  try {
    const requestedModelId = req.body.modelId || req.body.modelListingId || req.body.name || req.body.model_id;
    if (!requestedModelId) return res.status(400).json({ success: false, message: "modelId is required" });
    
    const model = await getModel(requestedModelId);
    const key = `forge_live_${crypto.randomBytes(18).toString("hex")}`;
    const keyPrefix = key.slice(0, 18);

    if (mongoose.connection.readyState === 1 && model && model._id && mongoose.Types.ObjectId.isValid(model._id)) {
      try {
        await Deployment.create({
          modelListingId: model._id,
          keyHash: hashKey(key),
          keyPrefix,
          active: true,
          createdAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn("[Deployment] Failed to save deployment record to Mongo:", dbErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      modelId: modelId(model) || requestedModelId,
      apiKey: key,
      keyPrefix,
      message: "Deployment created. Store this API key securely; it will not be shown again.",
    });
  } catch (error) { next(error); }
};

const findDeployment = async (key) => {
  const keyHash = hashKey(key);
  if (mongoose.connection.readyState !== 1) return null;
  return Deployment.findOne({ keyHash, active: true }).catch(() => null);
};

export const proxyPredict = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"] || 
                req.body.apiKey ||
                (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "");

    let deployment = null;
    if (key && (key.startsWith("forge_live_") || key.startsWith("mhub_live_"))) {
      deployment = await findDeployment(key);
    }

    const modelTarget = deployment?.modelListingId?.toString() || req.body.model || "forge-v1";
    const model = await getModel(modelTarget);

    const prompt = req.body.prompt || req.body.input;
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "prompt (or input) is required" });
    }

    const inference = await runModelInference({ model: model || { name: modelTarget, provider: "forge" }, prompt: prompt.trim() });
    return res.json({ success: true, ...inference });
  } catch (error) { next(error); }
};
