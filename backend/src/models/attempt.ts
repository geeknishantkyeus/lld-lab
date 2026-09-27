import { pgTable, serial, integer, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';
import { problems } from './problem';

export const attempts = pgTable('attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  problemId: integer('problem_id').references(() => problems.id),
  submission: text('submission'),
  status: varchar('status', { length: 50 }).default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
});
