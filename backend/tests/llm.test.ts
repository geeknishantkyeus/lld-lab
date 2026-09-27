import { evaluateLLM } from '../src/evaluators/llm';
import { LLD_EVALUATION_PROMPT } from '../src/evaluators/prompts';

describe('LLM Evaluator Unit Tests', () => {
  test('embeds submission code and problem title in prompt', () => {
    const prompt = LLD_EVALUATION_PROMPT('class Test {}', 'Parking Lot');
    expect(prompt).toContain('Parking Lot');
    expect(prompt).toContain('class Test {}');
    expect(prompt).toContain('responsibilityClarity');
    expect(prompt).toContain('solidCompliance');
    expect(prompt).toContain('couplingCohesion');
    expect(prompt).toContain('encapsulation');
    expect(prompt).toContain('patternAppropriateness');
    expect(prompt).toContain('extensibility');
    expect(prompt).toContain('designTradeoffs');
    expect(prompt).toContain('suggestions');
  });

  test('includes all 7 architectural evaluation dimensions', () => {
    const prompt = LLD_EVALUATION_PROMPT('test', 'Test');
    const dimensions = [
      'Responsibility Clarity',
      'SOLID Compliance',
      'Coupling & Cohesion',
      'Encapsulation',
      'Pattern Appropriateness',
      'Extensibility',
      'Design Trade-offs',
    ];
    dimensions.forEach((dim) => {
      expect(prompt).toContain(dim);
    });
  });

  test('specifies strict JSON response format', () => {
    const prompt = LLD_EVALUATION_PROMPT('test', 'Test');
    expect(prompt).toContain('JSON');
    expect(prompt).toContain('no markdown');
  });

  test('exports callable evaluator function', async () => {
    if (!process.env.GEMINI_API_KEY) {
      return;
    }
    expect(typeof evaluateLLM).toBe('function');
  }, 30000);
});
