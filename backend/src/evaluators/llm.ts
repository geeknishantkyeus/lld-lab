import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { LLD_EVALUATION_PROMPT } from './prompts';
import { logAIUsage } from '../config/aiUsage';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export interface LLMResult {
  feedback: string;
  responsibilityClarity: number;
  solidCompliance: number;
  couplingCohesion: number;
  encapsulation: number;
  patternAppropriateness: number;
  extensibility: number;
  designTradeoffs: number;
  suggestions: string[];
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('LLM evaluation timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function evaluateLLM(submission: string, problemTitle: string): Promise<LLMResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = LLD_EVALUATION_PROMPT(submission, problemTitle);
  const startTime = Date.now();

  let text = '';
  let tokensUsed = 0;
  let success = false;

  try {
    const result = await withTimeout(model.generateContent(prompt), 15000);
    text = result.response.text();
    tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;
    success = true;
  } catch (err: any) {
    if (err?.status === 404 || err?.message?.includes('not found')) {
      const fallback = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
      const result = await withTimeout(fallback.generateContent(prompt), 15000);
      text = result.response.text();
      tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;
      success = true;
    } else {
      logAIUsage({
        timestamp: new Date(),
        problemTitle,
        tokensUsed: 0,
        model: 'gemini-2.5-flash',
        success: false,
        durationMs: Date.now() - startTime,
      });
      throw err;
    }
  }

  logAIUsage({
    timestamp: new Date(),
    problemTitle,
    tokensUsed,
    model: 'gemini-2.5-flash',
    success,
    durationMs: Date.now() - startTime,
  });

  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    feedback: parsed.feedback || '',
    responsibilityClarity: parsed.responsibilityClarity || 0,
    solidCompliance: parsed.solidCompliance || 0,
    couplingCohesion: parsed.couplingCohesion || 0,
    encapsulation: parsed.encapsulation || 0,
    patternAppropriateness: parsed.patternAppropriateness || 0,
    extensibility: parsed.extensibility || 0,
    designTradeoffs: parsed.designTradeoffs || 0,
    suggestions: parsed.suggestions || [],
  };
}
