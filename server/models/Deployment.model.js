import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
  {
    modelListingId: { type: mongoose.Schema.Types.ObjectId, ref: "ModelListing", required: true },
    keyHash: { type: String, required: true, unique: true, index: true },
    keyPrefix: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Deployment", deploymentSchema);
