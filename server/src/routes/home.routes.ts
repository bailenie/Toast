import { Router } from 'express';
import { getMemeQuotes } from '../services/home.service.js';

export const homeRouter = Router();

// GET /api/home/meme-quotes — 无需鉴权
homeRouter.get('/meme-quotes', (_req, res) => {
  const quotes = getMemeQuotes();
  res.json({
    success: true,
    data: { quotes },
  });
});
