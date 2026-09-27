import app from './app';
import { env } from './config/env';
import { db } from './config/db';
import { redis } from './config/redis';
import { sql } from 'drizzle-orm';

const port = env.PORT || 5000;

async function start() {
  try {
    await Promise.all([db.execute(sql`SELECT 1`), redis.ping()]);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
