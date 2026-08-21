import mongoose from "mongoose";
import "dotenv/config";

// Disable indefinite command buffering so queries fail fast when Atlas is disconnected
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 2000);

let isDbConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI not defined in .env. Running with in-memory persistence fallback.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB Atlas Notice: Running with file-backed persistence fallback.`);
  }
};

export const getDbStatus = () => isDbConnected;
export default connectDB;
