import { Router } from 'express';
import { eq, desc, inArray } from 'drizzle-orm';
import { db } from '../config/db';
import { attempts } from '../models/attempt';
import { feedbacks } from '../models/feedback';

const router = Router();

router.get('/:id/attempts', async (req, res) => {
  try {
    const userAttempts = await db.select().from(attempts).where(eq(attempts.userId, +req.params.id));
    res.json({ success: true, data: userAttempts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/:id/weak-areas', async (req, res) => {
  try {
    const userId = +req.params.id;

    const userAttempts = await db
      .select()
      .from(attempts)
      .where(eq(attempts.userId, userId))
      .orderBy(desc(attempts.createdAt));

    if (userAttempts.length === 0) {
      return res.json({ success: true, data: { weakAreas: [], totalAttempts: 0 } });
    }

    const attemptIds = userAttempts.map((a) => a.id);
    const allFeedbacks = await db
      .select()
      .from(feedbacks)
      .where(inArray(feedbacks.attemptId, attemptIds));

    const validFeedbacks = allFeedbacks.filter((fb) => fb && fb.aiResults);

    const dimensionKeys = [
      'responsibilityClarity',
      'solidCompliance',
      'couplingCohesion',
      'encapsulation',
      'patternAppropriateness',
      'extensibility',
      'designTradeoffs',
    ];

    const dimensionLabels: Record<string, string> = {
      responsibilityClarity: 'Responsibility Clarity',
      solidCompliance: 'SOLID Compliance',
      couplingCohesion: 'Coupling & Cohesion',
      encapsulation: 'Encapsulation',
      patternAppropriateness: 'Pattern Appropriateness',
      extensibility: 'Extensibility',
      designTradeoffs: 'Design Trade-offs',
    };

    const weakAreas = dimensionKeys
      .map((key) => {
        const scores = validFeedbacks
          .map((fb: any) => fb.aiResults?.[key])
          .filter((s: any) => typeof s === 'number' && s > 0);

        if (scores.length === 0) return null;

        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        const lowest = Math.min(...scores);

        return {
          key,
          label: dimensionLabels[key],
          averageScore: Math.round(avg * 10) / 10,
          lowestScore: lowest,
          attemptCount: scores.length,
          isWeak: avg < 6,
        };
      })
      .filter((w) => w !== null)
      .sort((a: any, b: any) => a.averageScore - b.averageScore);

    res.json({
      success: true,
      data: {
        weakAreas,
        totalAttempts: userAttempts.length,
        analyzedAttempts: validFeedbacks.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/:id/progress', async (req, res) => {
  try {
    const userId = +req.params.id;

    const userAttempts = await db
      .select()
      .from(attempts)
      .where(eq(attempts.userId, userId))
      .orderBy(desc(attempts.createdAt));

    if (userAttempts.length === 0) {
      return res.json({
        success: true,
        data: {
          totalAttempts: 0,
          completedAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          improvement: 0,
          scoreTrend: [],
        },
      });
    }

    const attemptIds = userAttempts.map((a) => a.id);
    const feedbackList = await db
      .select()
      .from(feedbacks)
      .where(inArray(feedbacks.attemptId, attemptIds));

    const feedbackMap = new Map(feedbackList.map((fb) => [fb.attemptId, fb]));
    const allFeedbacks = userAttempts.map((a) => ({
      attempt: a,
      feedback: feedbackMap.get(a.id) || null,
    }));

    const completed = allFeedbacks.filter(
      (f) => f.attempt.status === 'COMPLETED' && f.feedback?.deterministicResults
    );

    const scores = completed.map((f: any) => f.feedback.deterministicResults.score || 0);
    const totalAttempts = userAttempts.length;
    const completedAttempts = completed.length;
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    let improvement = 0;
    if (scores.length >= 2) {
      const half = Math.floor(scores.length / 2);
      const firstHalf = scores.slice(0, half);
      const secondHalf = scores.slice(half);
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      improvement = Math.round(secondAvg - firstAvg);
    }

    const scoreTrend = completed
      .slice(0, 10)
      .reverse()
      .map((f: any) => ({
        attemptId: f.attempt.id,
        score: f.feedback.deterministicResults.score || 0,
        date: f.attempt.createdAt,
      }));

    res.json({
      success: true,
      data: {
        totalAttempts,
        completedAttempts,
        averageScore,
        bestScore,
        improvement,
        scoreTrend,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

export default router;
