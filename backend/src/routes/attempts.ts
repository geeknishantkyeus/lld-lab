import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { attempts } from '../models/attempt';
import { feedbacks } from '../models/feedback';
import { addEvaluationJob } from '../queue/inMemoryQueue';
import { getAIUsageStats } from '../config/aiUsage';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { userId, problemId, submission } = req.body;
    if (!problemId || isNaN(+problemId) || !submission || typeof submission !== 'string' || !submission.trim()) {
      return res.status(400).json({ success: false, error: 'problemId and submission required' });
    }
    const [attempt] = await db.insert(attempts).values({
      userId: userId || 1,
      problemId: +problemId,
      submission,
      status: 'PENDING',
    }).returning();

    addEvaluationJob(attempt.id);

    res.status(201).json({ success: true, data: attempt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/ai/usage', (_req, res) => {
  res.json({ success: true, data: getAIUsageStats() });
});

router.get('/compare/:id1/:id2', async (req, res) => {
  try {
    const id1 = +req.params.id1;
    const id2 = +req.params.id2;

    const [attempt1] = await db.select().from(attempts).where(eq(attempts.id, id1));
    const [attempt2] = await db.select().from(attempts).where(eq(attempts.id, id2));

    if (!attempt1 || !attempt2) {
      return res.status(404).json({ success: false, error: 'One or both attempts not found' });
    }

    const [feedback1] = await db.select().from(feedbacks).where(eq(feedbacks.attemptId, id1));
    const [feedback2] = await db.select().from(feedbacks).where(eq(feedbacks.attemptId, id2));

    res.json({
      success: true,
      data: {
        attempt1: { ...attempt1, feedback: feedback1 || null },
        attempt2: { ...attempt2, feedback: feedback2 || null },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, +req.params.id));
    if (!attempt) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: attempt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/:id/feedback', async (req, res) => {
  try {
    const [feedback] = await db.select().from(feedbacks).where(eq(feedbacks.attemptId, +req.params.id));
    if (!feedback) return res.status(404).json({ success: false, error: 'Feedback not ready' });
    res.json({ success: true, data: feedback });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/:id/status', async (req, res) => {
  try {
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, +req.params.id));
    if (!attempt) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { id: attempt.id, status: attempt.status } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.post('/:id/retry', async (req, res) => {
  try {
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, +req.params.id));
    if (!attempt) return res.status(404).json({ success: false, error: 'Not found' });
    if (attempt.status !== 'FAILED') {
      return res.status(400).json({ success: false, error: 'Only FAILED attempts can be retried' });
    }

    await db.update(attempts).set({ status: 'PENDING' }).where(eq(attempts.id, +req.params.id));
    addEvaluationJob(attempt.id);

    res.json({ success: true, data: { id: attempt.id, status: 'PENDING' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

export default router;
