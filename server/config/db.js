import mongoose from "mongoose";

let isDbConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI not defined in .env. Running with in-memory persistence fallback.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB Atlas Notice: ${error.message}. Running with in-memory persistence fallback.`);
  }
};

export const getDbStatus = () => isDbConnected;
export default connectDB;
