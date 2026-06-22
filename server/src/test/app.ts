import express from 'express';
import { authRouter } from '../routes/auth.routes.js';

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
}
