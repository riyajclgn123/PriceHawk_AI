// Redis is optional — if REDIS_URL is not set the app runs without caching.
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis | null | undefined };

function createRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    return new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  } catch {
    console.warn("⚠️  Redis connection failed — running without cache.");
    return null;
  }
}

export const redis: Redis | null =
  globalForRedis.redis !== undefined ? globalForRedis.redis : createRedis();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
