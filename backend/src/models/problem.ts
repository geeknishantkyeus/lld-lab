import { pgTable, serial, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  requirements: jsonb('requirements'),
  difficulty: varchar('difficulty', { length: 50 }),
  courseLink: varchar('course_link', { length: 255 }),
  relatedModule: varchar('related_module', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});
