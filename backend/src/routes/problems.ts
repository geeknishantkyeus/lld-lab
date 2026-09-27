import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { problems } from '../models/problem';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const all = await db.select().from(problems);
    res.json({ success: true, data: all });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problem = await db.select().from(problems).where(eq(problems.id, +req.params.id));
    if (!problem.length) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: problem[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

export default router;
