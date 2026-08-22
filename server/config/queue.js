import { runPromptfooBenchmarkWorker } from "../workers/benchmarkWorker.js";
import "dotenv/config";

// Global persistent in-memory store for fallback
if (!globalThis.__codefury_memory_store) {
  globalThis.__codefury_memory_store = {
    models: new Map(),
    jobs: new Map(),
  };
}

export const memoryStore = globalThis.__codefury_memory_store;

let benchmarkQueue = null;
let isRedisAvailable = false;

// Only initialize BullMQ Redis if REDIS_URL or external REDIS_HOST is explicitly configured and not in Vercel lambda
if (!process.env.VERCEL && (process.env.REDIS_URL || (process.env.REDIS_HOST && process.env.REDIS_HOST !== "127.0.0.1"))) {
  import("ioredis").then(({ default: Redis }) => {
    import("bullmq").then(({ Queue, Worker }) => {
      try {
        const redisConnection = new Redis(process.env.REDIS_URL || {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          maxRetriesPerRequest: null,
          connectTimeout: 2000,
          enableReadyCheck: false,
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
    }).catch(() => {});
  }).catch(() => {});
}

/**
 * Dispatch job to BullMQ queue or resilient promptfoo background worker
 */
export const addBenchmarkJob = async ({ jobId, modelName }) => {
  if (isRedisAvailable && benchmarkQueue) {
    try {
      await benchmarkQueue.add("runBenchmark", { jobId, modelName });
      return;
    } catch (_) {
      // Fallback
    }
  }

  // Resilient non-blocking execution
  setTimeout(() => {
    runPromptfooBenchmarkWorker(jobId, modelName).catch((err) => {
      console.error(`❌ Background benchmark worker error [Job: ${jobId}]:`, err.message);
    });
  }, 100);
};

export default { addBenchmarkJob, memoryStore };
