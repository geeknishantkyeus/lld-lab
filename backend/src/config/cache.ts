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
      console.log(`[Cache] Hit: ${cacheKey}`);
      return JSON.parse(cached) as T;
    }
    console.log(`[Cache] Miss: ${cacheKey}`);
    return null;
  } catch (err) {
    console.error('[Cache] Get error:', err);
    return null;
  }
}

export async function setCachedFeedback(cacheKey: string, value: object): Promise<void> {
  try {
    await redis.set(cacheKey, JSON.stringify(value), 'EX', CACHE_TTL);
    console.log(`[Cache] Set: ${cacheKey}`);
  } catch (err) {
    console.error('[Cache] Set error:', err);
  }
}

export async function getCacheTTL(cacheKey: string): Promise<number> {
  return redis.ttl(cacheKey);
}

export async function invalidateCache(cacheKey: string): Promise<void> {
  await redis.del(cacheKey);
  console.log(`[Cache] Invalidated: ${cacheKey}`);
}

export async function flushAllCache(): Promise<void> {
  const keys = await redis.keys('feedback:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
  console.log(`[Cache] Flushed ${keys.length} keys`);
}
