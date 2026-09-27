import { logAIUsage, getAIUsageStats, getAIUsageLogs } from '../src/config/aiUsage';

describe('AI Usage Tracking Tests', () => {
  test('appends usage record to in-memory log', () => {
    const initialCount = getAIUsageLogs().length;
    
    logAIUsage({
      timestamp: new Date(),
      problemTitle: 'Test Problem',
      tokensUsed: 100,
      model: 'gemini-2.5-flash',
      success: true,
      durationMs: 5000,
    });

    expect(getAIUsageLogs().length).toBe(initialCount + 1);
  });

  test('returns expected statistical fields', () => {
    const stats = getAIUsageStats();
    expect(stats).toHaveProperty('totalCalls');
    expect(stats).toHaveProperty('successfulCalls');
    expect(stats).toHaveProperty('failedCalls');
    expect(stats).toHaveProperty('totalTokens');
    expect(stats).toHaveProperty('avgDurationMs');
    expect(stats).toHaveProperty('estimatedCostUSD');
  });

  test('tracks success and failure counts', () => {
    const beforeStats = getAIUsageStats();
    
    logAIUsage({
      timestamp: new Date(),
      problemTitle: 'Success Test',
      tokensUsed: 50,
      model: 'gemini-2.5-flash',
      success: true,
      durationMs: 1000,
    });

    logAIUsage({
      timestamp: new Date(),
      problemTitle: 'Failure Test',
      tokensUsed: 0,
      model: 'gemini-2.5-flash',
      success: false,
      durationMs: 2000,
    });

    const afterStats = getAIUsageStats();
    expect(afterStats.totalCalls).toBe(beforeStats.totalCalls + 2);
    expect(afterStats.successfulCalls).toBeGreaterThanOrEqual(beforeStats.successfulCalls);
    expect(afterStats.failedCalls).toBeGreaterThanOrEqual(beforeStats.failedCalls);
  });

  test('aggregates consumed tokens', () => {
    const beforeStats = getAIUsageStats();
    
    logAIUsage({
      timestamp: new Date(),
      problemTitle: 'Token Test',
      tokensUsed: 200,
      model: 'gemini-2.5-flash',
      success: true,
      durationMs: 1000,
    });

    const afterStats = getAIUsageStats();
    expect(afterStats.totalTokens).toBeGreaterThanOrEqual(beforeStats.totalTokens + 200);
  });

  test('calculates cost estimate based on token count', () => {
    const stats = getAIUsageStats();
    expect(stats.estimatedCostUSD).toBeGreaterThanOrEqual(0);
    const expectedCost = (stats.totalTokens / 1000000) * 0.075;
    expect(stats.estimatedCostUSD).toBeCloseTo(expectedCost, 5);
  });

  test('retrieves raw log entries array', () => {
    const logs = getAIUsageLogs();
    expect(Array.isArray(logs)).toBe(true);
  });
});
