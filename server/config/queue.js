import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import "dotenv/config";
import { runPromptfooBenchmarkWorker } from "../workers/benchmarkWorker.js";

// Global persistent in-memory store for fallback
if (!globalThis.__codefury_memory_store) {
  globalThis.__codefury_memory_store = {
    models: new Map(),
    jobs: new Map(),
  };
}

export const memoryStore = globalThis.__codefury_memory_store;

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

let redisConnection = null;
let benchmarkQueue = null;
let isRedisAvailable = false;

try {
  redisConnection = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    // BullMQ requires unlimited request retries on worker connections.
    maxRetriesPerRequest: null,
    connectTimeout: 1000,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: () => null,
  });

  redisConnection.on("error", () => {
    isRedisAvailable = false;
  });

  redisConnection.connect().then(() => {
    isRedisAvailable = true;
    benchmarkQueue = new Queue("benchmarkQueue", { connection: redisConnection });
    new Worker(
      "benchmarkQueue",
      async (job) => {
        const { jobId, modelName } = job.data;
        await runPromptfooBenchmarkWorker(jobId, modelName);
      },
      { connection: redisConnection }
    );
  }).catch(() => {
    isRedisAvailable = false;
  });
} catch (_) {
  isRedisAvailable = false;
}

/**
 * Dispatch job to BullMQ queue or resilient promptfoo background worker
 */
export const addBenchmarkJob = async ({ jobId, modelName }) => {
  if (isRedisAvailable && benchmarkQueue) {
    try {
      await benchmarkQueue.add("runBenchmark", { jobId, modelName });
      return;
    } catch (_) {}
  }

  // Fast asynchronous worker dispatch
  setTimeout(() => {
    runPromptfooBenchmarkWorker(jobId, modelName);
  }, 50);
};

export { benchmarkQueue };
