interface AIUsageLog {
  timestamp: Date;
  problemTitle: string;
  tokensUsed: number;
  model: string;
  success: boolean;
  durationMs: number;
}

const usageLogs: AIUsageLog[] = [];

export function logAIUsage(log: AIUsageLog) {
  usageLogs.push(log);
  console.log(`[AI Usage] ${log.model} | ${log.tokensUsed} tokens | ${log.durationMs}ms | ${log.success ? 'success' : 'failed'}`);
}

export function getAIUsageStats() {
  const totalCalls = usageLogs.length;
  const successfulCalls = usageLogs.filter((l) => l.success).length;
  const failedCalls = totalCalls - successfulCalls;
  const totalTokens = usageLogs.reduce((sum, l) => sum + l.tokensUsed, 0);
  const avgDuration = totalCalls > 0
    ? Math.round(usageLogs.reduce((sum, l) => sum + l.durationMs, 0) / totalCalls)
    : 0;

  return {
    totalCalls,
    successfulCalls,
    failedCalls,
    totalTokens,
    avgDurationMs: avgDuration,
    estimatedCostUSD: (totalTokens / 1000000) * 0.075,
  };
}

export function getAIUsageLogs() {
  return usageLogs;
}
