import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import ModelListing from "../models/ModelListing.model.js";
import BenchmarkJob from "../models/BenchmarkJob.model.js";
import Deployment from "../models/Deployment.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.join(__dirname, "..", "data_store.json");
const store = JSON.parse(fs.readFileSync(storePath, "utf8"));

await connectDB();
if (mongoose.connection.readyState !== 1) throw new Error("MongoDB connection is required for migration.");

const modelIds = new Map();
for (const [legacyId, source] of Object.entries(store.models || {})) {
  const model = await ModelListing.findOneAndUpdate(
    { legacyId },
    {
      $setOnInsert: {
        legacyId,
        name: source.name,
        creator: source.creator,
        provider: source.provider,
        category: source.category,
        pricingPer1kTokens: source.pricingPer1kTokens,
        uploadedFilePath: source.uploadedFilePath || null,
        createdAt: source.createdAt || new Date(),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, timestamps: false },
  );
  modelIds.set(legacyId, model._id);
}

const jobIds = new Map();
for (const [legacyId, source] of Object.entries(store.jobs || {})) {
  const modelListingId = modelIds.get(String(source.modelListingId));
  if (!modelListingId) continue;
  const job = await BenchmarkJob.findOneAndUpdate(
    { legacyId },
    {
      $setOnInsert: {
        legacyId,
        modelListingId,
        modelName: source.modelName,
        status: ["queued", "running", "completed", "failed"].includes(source.status) ? source.status : "failed",
        progress: source.progress || 0,
        metrics: source.metrics || undefined,
        logs: source.logs || [],
        error: source.error || null,
        createdAt: source.createdAt || new Date(),
        updatedAt: source.updatedAt || source.createdAt || new Date(),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, timestamps: false },
  );
  jobIds.set(legacyId, job._id);
  await ModelListing.findByIdAndUpdate(modelListingId, { latestBenchmark: job._id });
}

for (const source of Object.values(store.deployments || {})) {
  const modelListingId = modelIds.get(String(source.modelListingId));
  if (!modelListingId || !source.keyHash) continue;
  await Deployment.findOneAndUpdate(
    { keyHash: source.keyHash },
    { $setOnInsert: { modelListingId, keyHash: source.keyHash, keyPrefix: source.keyPrefix, active: source.active !== false, createdAt: source.createdAt || new Date() } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, timestamps: false },
  );
}

console.log(`Migrated ${modelIds.size} models, ${jobIds.size} jobs, and ${Object.keys(store.deployments || {}).length} deployments.`);
await mongoose.disconnect();
