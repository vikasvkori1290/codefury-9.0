import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import benchmarkRoutes from "./routes/benchmark.routes.js";
import modelRoutes from "./routes/model.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";
import { startSelfPingService } from "./services/selfPing.service.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Start automatic 8-minute self-ping heartbeat
startSelfPingService();

const app = express();

// --------------- Middleware ---------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like health checks, curl, mobile) or Netlify / Vercel domains
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Ensure MongoDB connection is ready before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("DB connection warning in request middleware:", err.message);
  }
  next();
});

// --------------- Routes ---------------
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Forge CodeFury API",
    health: "/api/health",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Forge API is active and healthy 🚀",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Forge API is active and healthy 🚀",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/benchmark", benchmarkRoutes);
app.use("/api", deploymentRoutes);

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
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
