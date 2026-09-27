import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/db';
import { sql } from 'drizzle-orm';

describe('API Tests', () => {
  let attemptId1: number;
  let attemptId2: number;

  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);

    const res1 = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot { park() {} unpark() {} }' });
    attemptId1 = res1.body.data.id;

    await new Promise((r) => setTimeout(r, 2500));

    const res2 = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot { park() {} unpark() {} } class Vehicle {}' });
    attemptId2 = res2.body.data.id;

    await new Promise((r) => setTimeout(r, 2500));
  });

  test('health check returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('lists seeded problems', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  test('retrieves problem details by id', async () => {
    const res = await request(app).get('/api/problems/1');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Parking Lot');
  });

  test('returns 404 for unknown problem', async () => {
    const res = await request(app).get('/api/problems/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('creates a new attempt in pending status', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({
        problemId: 1,
        submission: 'class ParkingLot { park() {} unpark() {} }',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PENDING');
  });

  test('validates required submission payload', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1 });
    expect(res.status).toBe(400);
  });

  test('rejects empty submission solution', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: '' });
    expect(res.status).toBe(400);
  });

  test('checks status of queued attempt', async () => {
    const res = await request(app).get(`/api/attempts/${attemptId1}/status`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('status');
  });

  test('waits for attempt feedback processing', async () => {
    let res;
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      res = await request(app).get(`/api/attempts/${attemptId1}/feedback`);
      if (res.status === 200) break;
    }
    expect(res?.status).toBe(200);
    expect(res?.body.data).toHaveProperty('deterministicResults');
  }, 20000);

  test('blocks retrying non-failed attempts', async () => {
    const res = await request(app).post(`/api/attempts/${attemptId1}/retry`);
    expect(res.status).toBe(400);
  });

  test('returns current AI usage stats', async () => {
    const res = await request(app).get('/api/attempts/ai/usage');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCalls');
    expect(res.body.data).toHaveProperty('totalTokens');
  });

  test('compares valid attempt pair', async () => {
    const res = await request(app).get(`/api/attempts/compare/${attemptId1}/${attemptId1}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('attempt1');
    expect(res.body.data).toHaveProperty('attempt2');
  });

  test('returns 404 when comparing missing attempt', async () => {
    const res = await request(app).get('/api/attempts/compare/1/999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('retrieves full side-by-side comparison data', async () => {
    const res = await request(app).get(`/api/attempts/compare/${attemptId1}/${attemptId2}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.attempt1.id).toBe(attemptId1);
    expect(res.body.data.attempt2.id).toBe(attemptId2);
  });

  test('returns 404 if both compared attempts are missing', async () => {
    const res = await request(app).get('/api/attempts/compare/99999/88888');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('returns 404 if second attempt is missing', async () => {
    const res = await request(app).get(`/api/attempts/compare/${attemptId1}/99999`);
    expect(res.status).toBe(404);
  });

  test('verifies usage statistics calculation fields', async () => {
    const res = await request(app).get('/api/attempts/ai/usage');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalCalls');
    expect(res.body.data).toHaveProperty('successfulCalls');
    expect(res.body.data).toHaveProperty('totalTokens');
    expect(res.body.data).toHaveProperty('estimatedCostUSD');
  });

  test('prevents retry on completed attempt', async () => {
    const res = await request(app).post(`/api/attempts/${attemptId1}/retry`);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Only FAILED');
  });

  test('returns 404 when retrying unknown attempt', async () => {
    const res = await request(app).post('/api/attempts/99999/retry');
    expect(res.status).toBe(404);
  });

  test('fetches attempt record by id', async () => {
    const res = await request(app).get(`/api/attempts/${attemptId1}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(attemptId1);
  });

  test('returns 404 for non-existent attempt id', async () => {
    const res = await request(app).get('/api/attempts/99999');
    expect(res.status).toBe(404);
  });
});
