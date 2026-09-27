import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/db';
import { sql } from 'drizzle-orm';

describe('API Tests', () => {
  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);
  });

  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/problems returns 3 problems', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/problems/1 returns Parking Lot', async () => {
    const res = await request(app).get('/api/problems/1');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Parking Lot');
  });

  test('GET /api/problems/999 returns 404', async () => {
    const res = await request(app).get('/api/problems/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/attempts creates attempt', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({
        problemId: 1,
        submission: 'class ParkingLot { park() {} unpark() {} }',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PENDING');
  });

  test('POST /api/attempts with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1 });
    expect(res.status).toBe(400);
  });

  test('POST /api/attempts with empty solution returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: '' });
    expect(res.status).toBe(400);
  });

  test('GET /api/attempts/:id/status returns status', async () => {
    const res = await request(app).get('/api/attempts/1/status');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('status');
  });

  test('GET /api/attempts/:id/feedback returns feedback', async () => {
    let res;
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      res = await request(app).get('/api/attempts/1/feedback');
      if (res.status === 200) break;
    }
    expect(res?.status).toBe(200);
    expect(res?.body.data).toHaveProperty('deterministicResults');
  }, 20000);

  test('POST /api/attempts/:id/retry on non-FAILED returns 400', async () => {
    const res = await request(app).post('/api/attempts/1/retry');
    expect(res.status).toBe(400);
  });

  test('GET /api/attempts/ai/usage returns usage stats', async () => {
    const res = await request(app).get('/api/attempts/ai/usage');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCalls');
    expect(res.body.data).toHaveProperty('totalTokens');
  });

  test('GET /api/attempts/compare/:id1/:id2 returns comparison data', async () => {
    const res = await request(app).get('/api/attempts/compare/1/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('attempt1');
    expect(res.body.data).toHaveProperty('attempt2');
  });

  test('GET /api/attempts/compare/:id1/:id2 with invalid id returns 404', async () => {
    const res = await request(app).get('/api/attempts/compare/1/999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Additional API Tests', () => {
  let attemptId1: number;
  let attemptId2: number;

  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);

    const res1 = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot { park() {} unpark() {} }' });
    attemptId1 = res1.body.data.id;

    await new Promise((r) => setTimeout(r, 3000));

    const res2 = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot { park() {} unpark() {} } class Vehicle {}' });
    attemptId2 = res2.body.data.id;

    await new Promise((r) => setTimeout(r, 3000));
  });

  test('GET /api/attempts/compare/:id1/:id2 returns both attempts', async () => {
    const res = await request(app).get(`/api/attempts/compare/${attemptId1}/${attemptId2}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.attempt1.id).toBe(attemptId1);
    expect(res.body.data.attempt2.id).toBe(attemptId2);
  });

  test('GET /api/attempts/compare with invalid IDs returns 404', async () => {
    const res = await request(app).get('/api/attempts/compare/99999/88888');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/attempts/compare with one invalid ID returns 404', async () => {
    const res = await request(app).get(`/api/attempts/compare/${attemptId1}/99999`);
    expect(res.status).toBe(404);
  });

  test('GET /api/attempts/ai/usage returns stats', async () => {
    const res = await request(app).get('/api/attempts/ai/usage');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalCalls');
    expect(res.body.data).toHaveProperty('successfulCalls');
    expect(res.body.data).toHaveProperty('totalTokens');
    expect(res.body.data).toHaveProperty('estimatedCostUSD');
  });

  test('POST /api/attempts/:id/retry on COMPLETED returns 400', async () => {
    const res = await request(app).post(`/api/attempts/${attemptId1}/retry`);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Only FAILED');
  });

  test('POST /api/attempts/:id/retry on non-existent returns 404', async () => {
    const res = await request(app).post('/api/attempts/99999/retry');
    expect(res.status).toBe(404);
  });

  test('GET /api/attempts/:id returns attempt', async () => {
    const res = await request(app).get(`/api/attempts/${attemptId1}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(attemptId1);
  });

  test('GET /api/attempts/:id with invalid ID returns 404', async () => {
    const res = await request(app).get('/api/attempts/99999');
    expect(res.status).toBe(404);
  });
});

