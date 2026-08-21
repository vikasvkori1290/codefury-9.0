import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import ModelListing from "../models/ModelListing.model.js";
import BenchmarkJob from "../models/BenchmarkJob.model.js";

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not defined in server/.env");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas.");

  const allJobs = await BenchmarkJob.find({});
  const failedJobIds = allJobs
    .filter((j) => j.status === "failed" || !j.metrics || j.metrics.overallPassRate < 10)
    .map((j) => j._id);

  console.log(`Found ${failedJobIds.length} failed/incomplete benchmark jobs to clean.`);

  if (failedJobIds.length > 0) {
    await BenchmarkJob.deleteMany({ _id: { $in: failedJobIds } });
    await ModelListing.deleteMany({
      $or: [
        { latestBenchmark: { $in: failedJobIds } },
        { latestBenchmark: null },
      ],
    });
  }

  // Verify remaining valid models
  const validModels = await ModelListing.find({}).populate("latestBenchmark");
  console.log(`Remaining valid evaluated models in MongoDB: ${validModels.length}`);
  validModels.forEach((m) => {
    console.log(`- ${m.name} (${m.creator}): Pass Rate = ${m.latestBenchmark?.metrics?.overallPassRate}%`);
  });

  await mongoose.disconnect();
  console.log("Database clean completed.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
