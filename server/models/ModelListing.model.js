import mongoose from "mongoose";

const modelListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Model name is required"],
      trim: true,
    },
    creator: {
      type: String,
      default: "@anonymous_creator",
      trim: true,
    },
    provider: {
      type: String,
      enum: ["ollama_local", "modelfile_upload", "custom_api"],
      default: "ollama_local",
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    pricingPer1kTokens: {
      type: Number,
      default: 0.00015,
    },
    uploadedFilePath: {
      type: String,
      default: null,
    },
    latestBenchmark: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BenchmarkJob",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ModelListing = mongoose.model("ModelListing", modelListingSchema);
export default ModelListing;
