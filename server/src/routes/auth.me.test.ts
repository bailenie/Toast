import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../test/app.js';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { cleanAll } from '../test/cleanup.js';

const app = createTestApp();

describe('GET /api/auth/me', () => {
  beforeEach(async () => {
    await cleanAll();
  });

  afterAll(async () => {
    await cleanAll();
    await prisma.$disconnect();
  });

  async function createTestUserWithCircle() {
    const hashedPassword = await hashPassword('123456');
    const user = await prisma.user.create({
      data: {
        email: 'me-test@example.com',
        password: hashedPassword,
        nickname: '摸鱼水獭',
        avatar: 'moyu_otter',
      },
    });

    return { user };
  }

  it('有效 token → 返回 200，包含 user', async () => {
    const { user } = await createTestUserWithCircle();
    const token = signToken(user.id);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('me-test@example.com');
    expect(res.body.data.user.nickname).toBe('摸鱼水獭');
  });

  it('返回的 user 不包含 password', async () => {
    const { user } = await createTestUserWithCircle();
    const token = signToken(user.id);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.user.password).toBeUndefined();
  });

  it('不带 token → 返回 401', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
