import mongoose from "mongoose";
import "dotenv/config";

let cached = globalThis.__mongoose_cached;
if (!cached) {
  cached = globalThis.__mongoose_cached = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI not defined in environment variables.");
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((m) => {
      console.log(`✅ MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`❌ MongoDB connection error: ${e.message}`);
  }

  return cached.conn;
};

export const getDbStatus = () => mongoose.connection.readyState === 1;
export default connectDB;
