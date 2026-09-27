import express from 'express';
import cors from 'cors';
import problemsRouter from './routes/problems';
import attemptsRouter from './routes/attempts';
import usersRouter from './routes/users';
import { env } from './config/env';

const app = express();

app.use(cors({
  origin: env.NODE_ENV === 'production'
    ? [env.FRONTEND_URL, 'https://lld-lab-frontend.onrender.com']
    : 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

app.use('/api/problems', problemsRouter);
app.use('/api/attempts', attemptsRouter);
app.use('/api/users', usersRouter);

export default app;
