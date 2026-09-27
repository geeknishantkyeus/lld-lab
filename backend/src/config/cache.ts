import crypto from 'crypto';
import { redis } from './redis';

const PROMPT_VERSION = 'v1';
const CACHE_TTL = 60 * 60 * 24;

export function generateCacheKey(problemId: number, submission: string): string {
  const normalized = submission.trim().toLowerCase().replace(/\s+/g, ' ');
  const hash = crypto
    .createHash('sha256')
    .update(`${problemId}:${normalized}:${PROMPT_VERSION}`)
    .digest('hex');
  return `feedback:${hash}`;
}

export async function getCachedFeedback<T>(cacheKey: string): Promise<T | null> {
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch (err) {
    console.error('Cache read failed:', err);
    return null;
  }
}

export async function setCachedFeedback(cacheKey: string, value: object): Promise<void> {
  try {
    await redis.set(cacheKey, JSON.stringify(value), 'EX', CACHE_TTL);
  } catch (err) {
    console.error('Cache write failed:', err);
  }
}

export async function getCacheTTL(cacheKey: string): Promise<number> {
  return redis.ttl(cacheKey);
}

export async function invalidateCache(cacheKey: string): Promise<void> {
  await redis.del(cacheKey);
}

export async function flushAllCache(): Promise<void> {
  const keys = await redis.keys('feedback:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
