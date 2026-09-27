import app from './app';
import { env } from './config/env';
import { db } from './config/db';
import { redis } from './config/redis';
import { sql } from 'drizzle-orm';

const PORT = env.PORT || 5000;

async function start() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('Database connected');

    await redis.ping();
    console.log('Redis connected');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

start();
