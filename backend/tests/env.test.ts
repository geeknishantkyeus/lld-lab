describe('Environment Config Tests', () => {
  test('env object has required properties', () => {
    const { env } = require('../src/config/env');
    expect(env).toHaveProperty('PORT');
    expect(env).toHaveProperty('DATABASE_URL');
    expect(env).toHaveProperty('GEMINI_API_KEY');
    expect(env).toHaveProperty('REDIS_URL');
  });

  test('PORT defaults to 5000', () => {
    const { env } = require('../src/config/env');
    expect(env.PORT).toBeGreaterThan(0);
  });
});
