import { redis } from '../src/config/redis';

describe('Redis Connection Tests', () => {
  test('responds to ping with PONG', async () => {
    const pong = await redis.ping();
    expect(pong).toBe('PONG');
  });

  test('persists and reads key-value strings', async () => {
    const key = 'test:redis:' + Date.now();
    await redis.set(key, 'test-value', 'EX', 10);
    const value = await redis.get(key);
    expect(value).toBe('test-value');
    await redis.del(key);
  });

  test('sets and reads key expiration TTL', async () => {
    const key = 'test:ttl:' + Date.now();
    await redis.set(key, 'value', 'EX', 60);
    const ttl = await redis.ttl(key);
    expect(ttl).toBeGreaterThan(55);
    expect(ttl).toBeLessThanOrEqual(60);
    await redis.del(key);
  });
});
