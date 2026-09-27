import { db } from '../src/config/db';
import { sql } from 'drizzle-orm';
jest.setTimeout(60000);

jest.mock('p-queue', () => {
  return jest.fn().mockImplementation(() => {
    return {
      add: (fn: any) => Promise.resolve().then(fn),
    };
  });
});

beforeAll(async () => {
  await db.execute(sql`SELECT 1`);
});
