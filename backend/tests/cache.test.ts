import { generateCacheKey, getCachedFeedback, setCachedFeedback, getCacheTTL, invalidateCache } from '../src/config/cache';

describe('Cache Tests', () => {
  const problemId = 1;
  const submission = 'class ParkingLot { park() {} unpark() {} }';
  const testValue = { test: 'value', score: 85 };

  afterAll(async () => {
    const key = generateCacheKey(problemId, submission);
    await invalidateCache(key);
  });

  test('Cache key generation is deterministic', () => {
    const key1 = generateCacheKey(problemId, submission);
    const key2 = generateCacheKey(problemId, submission);
    expect(key1).toBe(key2);
    expect(key1).toMatch(/^feedback:[a-f0-9]{64}$/);
  });

  test('Cache key differs for different submissions', () => {
    const key1 = generateCacheKey(problemId, submission);
    const key2 = generateCacheKey(problemId, 'different solution');
    expect(key1).not.toBe(key2);
  });

  test('Cache key differs for different problems', () => {
    const key1 = generateCacheKey(1, submission);
    const key2 = generateCacheKey(2, submission);
    expect(key1).not.toBe(key2);
  });

  test('Cache miss returns null', async () => {
    const key = generateCacheKey(999, 'non-existent');
    const result = await getCachedFeedback(key);
    expect(result).toBeNull();
  });

  test('Cache set and get works', async () => {
    const key = generateCacheKey(problemId, submission);
    await setCachedFeedback(key, testValue);
    const result = await getCachedFeedback(key);
    expect(result).toEqual(testValue);
  });

  test('Cache TTL is set correctly', async () => {
    const key = generateCacheKey(problemId, submission);
    await setCachedFeedback(key, testValue);
    const ttl = await getCacheTTL(key);
    expect(ttl).toBeGreaterThan(86000);
    expect(ttl).toBeLessThanOrEqual(86400);
  });

  test('Cache invalidation works', async () => {
    const key = generateCacheKey(problemId, submission);
    await setCachedFeedback(key, testValue);
    await invalidateCache(key);
    const result = await getCachedFeedback(key);
    expect(result).toBeNull();
  });
});

describe('Cache Failure Handling', () => {
  test('Cache get failure returns null (no crash)', async () => {
    const { redis } = require('../src/config/redis');
    const originalGet = redis.get;
    
    redis.get = jest.fn().mockRejectedValue(new Error('Redis connection lost'));

    const { generateCacheKey, getCachedFeedback } = require('../src/config/cache');
    const key = generateCacheKey(1, 'test submission');
    const result = await getCachedFeedback(key);

    expect(result).toBeNull();

    redis.get = originalGet;
  });

  test('Cache set failure does not crash evaluation', async () => {
    const { redis } = require('../src/config/redis');
    const originalSet = redis.set;
    
    redis.set = jest.fn().mockRejectedValue(new Error('Redis write failed'));

    const { generateCacheKey, setCachedFeedback } = require('../src/config/cache');
    const key = generateCacheKey(1, 'test submission');
    
    await expect(setCachedFeedback(key, { test: 'value' })).resolves.not.toThrow();

    redis.set = originalSet;
  });

  test('Cache TTL is exactly 24 hours (86400 seconds)', async () => {
    const { generateCacheKey, setCachedFeedback, getCacheTTL } = require('../src/config/cache');
    const key = generateCacheKey(1, 'ttl test unique ' + Date.now());
    await setCachedFeedback(key, { test: 'value' });
    const ttl = await getCacheTTL(key);
    expect(ttl).toBeGreaterThan(86390);
    expect(ttl).toBeLessThanOrEqual(86400);
  });
});

