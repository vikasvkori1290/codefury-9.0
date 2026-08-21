import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import benchmarkRoutes from "./routes/benchmark.routes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --------------- Middleware ---------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --------------- Routes ---------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CodeFury API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/benchmark", benchmarkRoutes);

// --------------- Error Handler ---------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
