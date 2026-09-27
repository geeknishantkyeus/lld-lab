export const LLD_EVALUATION_PROMPT = (submission: string, problemTitle: string) => `You are a senior LLD mentor evaluating a student's solution for "${problemTitle}".

Submission:
${submission}

Evaluate the design on these 7 dimensions (score 0-10 each):
1. Responsibility Clarity (Single Responsibility Principle) — Are classes focused on single responsibilities?
2. SOLID Compliance — Are SOLID principles applied correctly?
3. Coupling & Cohesion — Are components loosely coupled and highly cohesive?
4. Encapsulation — Is internal state properly protected?
5. Pattern Appropriateness — Are design patterns used purposefully (not over-engineered)?
6. Extensibility — Can new features be added without major rewrites?
7. Design Trade-offs — Are trade-offs explained and justified?

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "feedback": "3-4 sentence overall assessment covering strengths and weaknesses",
  "responsibilityClarity": 8,
  "solidCompliance": 7,
  "couplingCohesion": 8,
  "encapsulation": 7,
  "patternAppropriateness": 6,
  "extensibility": 6,
  "designTradeoffs": 7,
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3"
  ]
}`;
