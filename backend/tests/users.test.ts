import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/db';
import { sql } from 'drizzle-orm';

describe('Users API Tests', () => {
  test('summarizes user weak areas', async () => {
    const res = await request(app).get('/api/users/1/weak-areas');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('weakAreas');
    expect(res.body.data).toHaveProperty('totalAttempts');
  });

  test('returns empty weak areas for unknown user', async () => {
    const res = await request(app).get('/api/users/99999/weak-areas');
    expect(res.status).toBe(200);
    expect(res.body.data.weakAreas).toEqual([]);
    expect(res.body.data.totalAttempts).toBe(0);
  });

  test('calculates overall user progress metrics', async () => {
    const res = await request(app).get('/api/users/1/progress');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalAttempts');
    expect(res.body.data).toHaveProperty('completedAttempts');
    expect(res.body.data).toHaveProperty('averageScore');
    expect(res.body.data).toHaveProperty('bestScore');
    expect(res.body.data).toHaveProperty('scoreTrend');
  });

  test('returns zeroed progress stats for new user', async () => {
    const res = await request(app).get('/api/users/99999/progress');
    expect(res.status).toBe(200);
    expect(res.body.data.totalAttempts).toBe(0);
    expect(res.body.data.scoreTrend).toEqual([]);
  });
});

describe('User Metrics & Trend Calculations', () => {
  beforeAll(async () => {
    await db.execute(sql`TRUNCATE TABLE feedbacks, attempts RESTART IDENTITY CASCADE`);

    await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot {}' });
    await new Promise((r) => setTimeout(r, 3000));

    await request(app)
      .post('/api/attempts')
      .send({ problemId: 1, submission: 'class ParkingLot { park() {} unpark() {} } class Vehicle {} class ParkingSpot {} class Ticket {} class Payment {} calculateFee() {}' });
    await new Promise((r) => setTimeout(r, 3000));
  }, 15000);

  test('lists user submission history', async () => {
    const res = await request(app).get('/api/users/1/attempts');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('computes dimensional averages across attempts', async () => {
    const res = await request(app).get('/api/users/1/weak-areas');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.weakAreas.length).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty('totalAttempts');
    expect(res.body.data).toHaveProperty('analyzedAttempts');
  });

  test('sorts weak areas by ascending score', async () => {
    const res = await request(app).get('/api/users/1/weak-areas');
    const weakAreas = res.body.data.weakAreas;
    for (let i = 1; i < weakAreas.length; i++) {
      expect(weakAreas[i].averageScore).toBeGreaterThanOrEqual(weakAreas[i - 1].averageScore);
    }
  });

  test('computes completion stats and score trends', async () => {
    const res = await request(app).get('/api/users/1/progress');
    expect(res.status).toBe(200);
    expect(res.body.data.totalAttempts).toBeGreaterThan(0);
    expect(res.body.data.completedAttempts).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty('averageScore');
    expect(res.body.data).toHaveProperty('bestScore');
    expect(res.body.data).toHaveProperty('improvement');
    expect(res.body.data).toHaveProperty('scoreTrend');
  });

  test('maintains chronological order in score trend', async () => {
    const res = await request(app).get('/api/users/1/progress');
    const trend = res.body.data.scoreTrend;
    for (let i = 1; i < trend.length; i++) {
      expect(new Date(trend[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(trend[i - 1].date).getTime()
      );
    }
  });

  test('handles empty progress state without error', async () => {
    const res = await request(app).get('/api/users/99999/progress');
    expect(res.status).toBe(200);
    expect(res.body.data.totalAttempts).toBe(0);
    expect(res.body.data.averageScore).toBe(0);
    expect(res.body.data.bestScore).toBe(0);
  });
});
