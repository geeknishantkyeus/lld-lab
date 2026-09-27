import { pgTable, serial, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { attempts } from './attempt';

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  attemptId: integer('attempt_id').references(() => attempts.id),
  deterministicResults: jsonb('deterministic_results'),
  aiResults: jsonb('ai_results'),
  cached: boolean('cached').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
