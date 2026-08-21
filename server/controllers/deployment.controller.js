import crypto from "crypto";
import mongoose from "mongoose";
import ModelListing from "../models/ModelListing.model.js";
import Deployment from "../models/Deployment.model.js";
import { runModelInference } from "../services/modelProviders.service.js";

const hashKey = (key) => crypto.createHash("sha256").update(key).digest("hex");
const modelId = (model) => model?._id?.toString() || model?.id?.toString();

const getModel = async (id) => {
  if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(id)) return null;
  return ModelListing.findById(id).catch(() => null);
};

export const deployModel = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "MongoDB is unavailable." });
    const requestedModelId = req.body.modelId || req.body.modelListingId;
    if (!requestedModelId) return res.status(400).json({ success: false, message: "modelId is required" });
    const model = await getModel(requestedModelId);
    if (!model) return res.status(404).json({ success: false, message: "Model not found" });
    const key = `mhub_live_${crypto.randomBytes(18).toString("hex")}`;
    const deployment = {
      modelListingId: modelId(model),
      keyHash: hashKey(key),
      keyPrefix: key.slice(0, 18),
      active: true,
      createdAt: new Date().toISOString(),
    };
    await Deployment.create(deployment);
    return res.status(201).json({ success: true, modelId: modelId(model), apiKey: key, keyPrefix: deployment.keyPrefix, message: "Deployment created. Store this API key securely; it will not be shown again." });
  } catch (error) { next(error); }
};

const findDeployment = async (key) => {
  const keyHash = hashKey(key);
  if (mongoose.connection.readyState !== 1) return null;
  return Deployment.findOne({ keyHash, active: true }).catch(() => null);
};

export const proxyPredict = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "");
    if (!key || !key.startsWith("mhub_live_")) return res.status(401).json({ success: false, message: "A valid ModelHub API key is required" });
    const deployment = await findDeployment(key);
    if (!deployment) return res.status(401).json({ success: false, message: "Invalid or inactive API key" });
    const prompt = req.body.prompt || req.body.input;
    if (typeof prompt !== "string" || !prompt.trim()) return res.status(400).json({ success: false, message: "prompt (or input) is required" });
    const model = await getModel(deployment.modelListingId.toString());
    if (!model) return res.status(404).json({ success: false, message: "Deployed model no longer exists" });
    const inference = await runModelInference({ model, prompt: prompt.trim() });
    return res.json({ success: true, ...inference });
  } catch (error) { next(error); }
};
