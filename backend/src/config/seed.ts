import { db } from './db';
import { problems } from '../models/problem';
import { users } from '../models/user';

const seedProblems = [
  {
    title: 'Parking Lot',
    description: 'Design a multi-floor parking lot system',
    requirements: [
      'Multiple floors',
      'Different vehicle types (car, bike, truck)',
      'Ticket generation',
      'Payment calculation',
    ],
    difficulty: 'Easy-Medium',
    courseLink: 'https://www.cipherschools.com/course/full-stack',
    relatedModule: 'Full Stack Development with AI',
  },
  {
    title: 'Elevator System',
    description: 'Design a multi-elevator system for a building',
    requirements: [
      'Multiple elevators',
      'Internal and external buttons',
      'Scheduling algorithm (SCAN/LOOK)',
      'Display system',
    ],
    difficulty: 'Medium',
    courseLink: 'https://www.cipherschools.com/course/full-stack',
    relatedModule: 'Full Stack Development with AI',
  },
  {
    title: 'Vending Machine',
    description: 'Design a vending machine system',
    requirements: [
      'Multiple products',
      'State management (Idle, HasMoney, Dispensing)',
      'Inventory tracking',
      'Payment handling',
    ],
    difficulty: 'Easy',
    courseLink: 'https://www.cipherschools.com/course/full-stack',
    relatedModule: 'Full Stack Development with AI',
  },
];

import { sql } from 'drizzle-orm';

export async function seed() {
  const constraints = await db.execute(sql`SELECT conname FROM pg_constraint WHERE conrelid = 'attempts'::regclass AND contype = 'f'`);
  for (const row of constraints.rows as any[]) {
    if (row.conname.includes('problem')) {
      await db.execute(sql.raw(`ALTER TABLE attempts DROP CONSTRAINT IF EXISTS "${row.conname}"`));
      console.log('Dropped constraint:', row.conname);
    }
  }
  await db.execute(sql`TRUNCATE TABLE feedbacks, attempts, problems, users RESTART IDENTITY CASCADE`);
  await db.insert(users).values({ name: 'Demo User', email: 'demo@cipherschools.com' });
  await db.insert(problems).values(seedProblems);
  console.log('Seed complete');
  process.exit(0);
}

seed();
