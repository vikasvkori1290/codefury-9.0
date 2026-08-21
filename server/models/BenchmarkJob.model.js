import mongoose from "mongoose";

const benchmarkJobSchema = new mongoose.Schema(
  {
    legacyId: { type: String, default: null, unique: true, sparse: true, index: true },
    modelListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModelListing",
      required: true,
    },
    modelName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    metrics: {
      overallPassRate: { type: Number, default: 0 },
      avgLatencyMs: { type: Number, default: 0 },
      tokensPerSecond: { type: Number, default: 0 },
      categoryScores: {
        reasoning: { type: Number, default: 0 },
        knowledge: { type: Number, default: 0 },
        coding: { type: Number, default: 0 },
        instruction: { type: Number, default: 0 },
        safety: { type: Number, default: 0 },
      },
      totalCases: { type: Number, default: 0 },
      passedCases: { type: Number, default: 0 },
      failedCases: { type: Number, default: 0 },
      evaluator: { type: String, default: null },
      testResults: { type: mongoose.Schema.Types.Mixed, default: [] },
    },
    logs: [
      {
        type: String,
      },
    ],
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BenchmarkJob = mongoose.model("BenchmarkJob", benchmarkJobSchema);
export default BenchmarkJob;
