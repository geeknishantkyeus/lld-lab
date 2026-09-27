import { db } from './db';
import { sql } from 'drizzle-orm';
import { problems } from '../models/problem';
import { users } from '../models/user';
import { attempts } from '../models/attempt';
import { feedbacks } from '../models/feedback';

export async function migrate() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS problems (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      requirements JSONB,
      difficulty VARCHAR(50),
      course_link VARCHAR(255),
      related_module VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      problem_id INTEGER REFERENCES problems(id),
      submission TEXT,
      status VARCHAR(50) DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS feedbacks (
      id SERIAL PRIMARY KEY,
      attempt_id INTEGER REFERENCES attempts(id),
      deterministic_results JSONB,
      ai_results JSONB,
      cached BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Migration complete');
}

if (require.main === module) {
  migrate().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
