import PQueue from 'p-queue';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { attempts } from '../models/attempt';
import { feedbacks } from '../models/feedback';
import { problems } from '../models/problem';
import { evaluateDeterministic } from '../evaluators/deterministic';
import { evaluateLLM } from '../evaluators/llm';
import { generateCacheKey, getCachedFeedback, setCachedFeedback } from '../config/cache';

export const evaluationQueue = new PQueue({ concurrency: 2 });

async function evaluateWithRetry(submission: string, problemTitle: string, maxRetries = 1) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await evaluateLLM(submission, problemTitle);
    } catch (err) {
      console.error(`LLM attempt ${i + 1} failed:`, err);
      if (i === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
  throw new Error('LLM evaluation failed after retries');
}

export async function addEvaluationJob(attemptId: number) {
  return evaluationQueue.add(async () => {
    await db.update(attempts).set({ status: 'EVALUATING' }).where(eq(attempts.id, attemptId));

    let timedOut = false;
    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        timedOut = true;
        reject(new Error('Evaluation timeout'));
      }, 20000);
    });

    try {
      await Promise.race([
        (async () => {
          const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId));
          if (!attempt) throw new Error('Attempt not found');

          const [problem] = await db.select().from(problems).where(eq(problems.id, attempt.problemId!));
          if (!problem) throw new Error('Problem not found');

          const cacheKey = generateCacheKey(problem.id, attempt.submission || '');
          const cached = await getCachedFeedback<{
            deterministicResults: object;
            aiResults: object;
          }>(cacheKey);

          if (cached) {
            await db.insert(feedbacks).values({
              attemptId,
              deterministicResults: cached.deterministicResults,
              aiResults: cached.aiResults,
              cached: true,
            });
            await db.update(attempts).set({ status: 'COMPLETED' }).where(eq(attempts.id, attemptId));
            return;
          }

          const deterministicResults = evaluateDeterministic(attempt.submission || '', problem.title);

          let aiResults = {
            status: 'pending',
            feedback: 'AI evaluation temporarily unavailable. Showing deterministic results only.',
            responsibilityClarity: 0,
            solidCompliance: 0,
            couplingCohesion: 0,
            encapsulation: 0,
            patternAppropriateness: 0,
            extensibility: 0,
            designTradeoffs: 0,
            suggestions: [] as string[],
          };

          try {
            const llmResult = await evaluateWithRetry(attempt.submission || '', problem.title);
            aiResults = {
              status: 'completed',
              feedback: llmResult.feedback,
              responsibilityClarity: llmResult.responsibilityClarity,
              solidCompliance: llmResult.solidCompliance,
              couplingCohesion: llmResult.couplingCohesion,
              encapsulation: llmResult.encapsulation,
              patternAppropriateness: llmResult.patternAppropriateness,
              extensibility: llmResult.extensibility,
              designTradeoffs: llmResult.designTradeoffs,
              suggestions: llmResult.suggestions,
            };
          } catch (err) {
            console.error('LLM evaluation failed after retries:', err);
            aiResults.status = 'failed';
          }

          if (timedOut) return;

          await setCachedFeedback(cacheKey, { deterministicResults, aiResults });

          await db.insert(feedbacks).values({
            attemptId,
            deterministicResults,
            aiResults,
            cached: false,
          });

          await db.update(attempts).set({ status: 'COMPLETED' }).where(eq(attempts.id, attemptId));
        })(),
        timeoutPromise,
      ]);
    } catch (err) {
      console.error('Evaluation failed:', err);
      await db.update(attempts).set({ status: 'FAILED' }).where(eq(attempts.id, attemptId));
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  });
}
