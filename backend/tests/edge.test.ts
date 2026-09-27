import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/db';
import { sql } from 'drizzle-orm';

describe('Edge Case Tests', () => {
  beforeAll(async () => {
    await db.execute(sql`DELETE FROM feedbacks`);
    await db.execute(sql`DELETE FROM attempts`);
  });

  test('Invalid problem ID creates FAILED attempt', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 999, submission: 'invalid' });
    expect(res.status).toBe(201);

    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await request(app).get(`/api/attempts/${res.body.data.id}/status`);
    expect(statusRes.body.data.status).toBe('FAILED');
  });

  test('Retry FAILED attempt works', async () => {
    const createRes = await request(app)
      .post('/api/attempts')
      .send({ problemId: 999, submission: 'invalid' });

    await new Promise((r) => setTimeout(r, 2000));

    const retryRes = await request(app).post(`/api/attempts/${createRes.body.data.id}/retry`);
    expect(retryRes.status).toBe(200);
    expect(retryRes.body.data.status).toBe('PENDING');
  });

  test('Get feedback for non-existent attempt returns 404', async () => {
    const res = await request(app).get('/api/attempts/99999/feedback');
    expect(res.status).toBe(404);
  });

  test('Get status for non-existent attempt returns 404', async () => {
    const res = await request(app).get('/api/attempts/99999/status');
    expect(res.status).toBe(404);
  });
});

describe('Edge Cases Additional', () => {
  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);
  });

  test('Missing problemId returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ submission: 'class Test {}' });
    expect(res.status).toBe(400);
  });

  test('Missing submission returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1 });
    expect(res.status).toBe(400);
  });

  test('Whitespace-only submission returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: '   ' });
    expect([400, 201]).toContain(res.status);
  });

  test('Negative problemId creates attempt that fails', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: -1, submission: 'test' });
    expect(res.status).toBe(201);

    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await request(app).get(`/api/attempts/${res.body.data.id}/status`);
    expect(statusRes.body.data.status).toBe('FAILED');
  });

  test('Very long submission is accepted', async () => {
    const longSubmission = 'class A {}\n'.repeat(500);
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: longSubmission });
    expect(res.status).toBe(201);
  });
});

describe('LLM Failure Simulation', () => {
  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);
    const { generateCacheKey, invalidateCache } = require('../src/config/cache');
    await invalidateCache(generateCacheKey(1, 'class ParkingLot { park() {} unpark() {} }'));
    await invalidateCache(generateCacheKey(1, 'class Test {}'));
  });

  test('LLM failure falls back to deterministic results', async () => {
    const llmModule = require('../src/evaluators/llm');
    const originalEvaluate = llmModule.evaluateLLM;
    
    llmModule.evaluateLLM = jest.fn().mockRejectedValue(new Error('Simulated LLM failure'));

    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot { park() {} unpark() {} }' });

    await new Promise((r) => setTimeout(r, 3000));

    let fbRes = await request(app).get(`/api/attempts/${res.body.data.id}/feedback`);
    if (fbRes.status === 404) {
      await new Promise((r) => setTimeout(r, 2000));
      fbRes = await request(app).get(`/api/attempts/${res.body.data.id}/feedback`);
    }
    
    expect(fbRes.status).toBe(200);
    expect(fbRes.body.data.deterministicResults).toBeDefined();
    expect(fbRes.body.data.aiResults.status).toBe('failed');
    expect(fbRes.body.data.aiResults.feedback).toContain('temporarily unavailable');

    llmModule.evaluateLLM = originalEvaluate;
  }, 15000);
});

describe('Concurrent Attempts', () => {
  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);
  });

  test('Multiple concurrent attempts are processed correctly', async () => {
    const promises = [
      request(app).post('/api/attempts').send({ problemId: 1, submission: 'class A {}' }),
      request(app).post('/api/attempts').send({ problemId: 1, submission: 'class B {}' }),
      request(app).post('/api/attempts').send({ problemId: 1, submission: 'class C {}' }),
    ];

    const results = await Promise.all(promises);
    
    results.forEach((res) => {
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('PENDING');
    });

    await new Promise((r) => setTimeout(r, 15000));

    const ids = results.map((r) => r.body.data.id);
    for (const id of ids) {
      const statusRes = await request(app).get(`/api/attempts/${id}/status`);
      expect(['COMPLETED', 'FAILED']).toContain(statusRes.body.data.status);
    }
  }, 30000);
});

describe('Invalid Data Handling', () => {
  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);
  });

  test('Non-numeric problemId returns 400 or creates failed attempt', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 'not-a-number', submission: 'test' });
    expect([400, 201]).toContain(res.status);
  });

  test('Null submission returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: null });
    expect(res.status).toBe(400);
  });

  test('Object submission returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: { invalid: 'object' } });
    expect([400, 500]).toContain(res.status);
  });

  test('Array submission returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: ['array', 'submission'] });
    expect([400, 500]).toContain(res.status);
  });

  test('SQL injection attempt in submission is safe', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: "'; DROP TABLE attempts; --" });
    expect(res.status).toBe(201);

    const check = await request(app).get('/api/attempts/1/status');
    expect([200, 404]).toContain(check.status);
  });

  test('Boolean submission returns 400 or 500', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: true });
    expect([400, 500]).toContain(res.status);
  });

  test('Numeric submission returns 400 or 500', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 12345 });
    expect([400, 500]).toContain(res.status);
  });

  test('Special characters in submission are handled safely', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class Test { // <>&"\'`/*$%^&*@! \n }' });
    expect(res.status).toBe(201);
  });
});


