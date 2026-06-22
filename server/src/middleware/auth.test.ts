import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authMiddleware } from './auth.js';
import { signToken } from '../utils/jwt.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ success: true, userId: (req as unknown as Record<string, string>).userId });
  });
  return app;
}

const app = createTestApp();

describe('认证中间件', () => {
  it('有效 token → 调用 next()，返回 200', async () => {
    const token = signToken('user-123');

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.userId).toBe('user-123');
  });

  it('无 token → 返回 401', async () => {
    const res = await request(app).get('/protected');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('无效 token → 返回 401', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('空 Authorization 头 → 返回 401', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', '');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
