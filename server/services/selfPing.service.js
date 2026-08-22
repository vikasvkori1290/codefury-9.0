import http from "http";
import https from "https";
import mongoose from "mongoose";

/**
 * Automated 10-minute Heartbeat Activity
 * Keeps server instance warm and MongoDB connection pool active
 */
export const startSelfPingService = () => {
  // On Vercel serverless, don't run persistent interval that blocks lambda execution
  if (process.env.VERCEL) {
    return;
  }

  // Interval: 8 minutes (480,000 ms) to comfortably beat 10-15m idle timeouts
  const INTERVAL_MS = 8 * 60 * 1000;

  console.log("💓 [HEARTBEAT SERVICE] Automatic 8-minute self-ping & DB warm-up initialized.");

  const timer = setInterval(async () => {
    try {
      // 1. Warm MongoDB Connection
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        console.log(`💓 [HEARTBEAT DB] MongoDB connection pool verified active at ${new Date().toLocaleTimeString()}`);
      }

      // 2. HTTP Self-Ping if URL is configured
      const targetUrl =
        process.env.BACKEND_URL ||
        (process.env.RENDER_EXTERNAL_URL ? process.env.RENDER_EXTERNAL_URL : null);

      if (targetUrl) {
        const fullUrl = `${targetUrl.replace(/\/$/, "")}/api/health`;
        const client = fullUrl.startsWith("https") ? https : http;

        client
          .get(fullUrl, (res) => {
            console.log(`💓 [HEARTBEAT HTTP] Self-ping to ${fullUrl} responded with status ${res.statusCode}`);
          })
          .on("error", (err) => {
            console.warn(`💓 [HEARTBEAT HTTP WARNING] Self-ping error: ${err.message}`);
          });
      }
    } catch (error) {
      console.warn(`💓 [HEARTBEAT WARNING] ${error.message}`);
    }
  }, INTERVAL_MS);

  // Unref timer so Node process can cleanly exit or scale without hanging
  if (timer.unref) {
    timer.unref();
  }
};
