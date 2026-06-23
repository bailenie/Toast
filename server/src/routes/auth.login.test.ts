import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../test/app.js';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

const app = createTestApp();

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await cleanAll();
  });

  afterAll(async () => {
    await cleanAll();
    await prisma.$disconnect();
  });

  async function createTestUser(overrides?: Record<string, unknown>) {
    const hashedPassword = await hashPassword('123456');
    const user = await prisma.user.create({
      data: {
        email: 'login-test@example.com',
        password: hashedPassword,
        nickname: '摸鱼水獭',
        avatar: 'moyu_otter',
        ...overrides,
      },
    });
    return user;
  }

  it('正确邮箱密码登录 → 返回 200，包含 token 和 user', async () => {
    await createTestUser();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login-test@example.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.email).toBe('login-test@example.com');
    expect(res.body.data.user.nickname).toBe('摸鱼水獭');
  });

  it('用户不存在 → 返回 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('找不到该雇员信息，请确认邮箱或切换为注册页面！');
  });

  it('密码错误 → 返回 400', async () => {
    await createTestUser();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login-test@example.com', password: 'wrong-password' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('密码输入有误，请核实后再敲门！');
  });

  it('用户被封禁 → 返回 403', async () => {
    await createTestUser({ isBanned: true });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login-test@example.com', password: '123456' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('你已被管理员关进【冷冻鱼缸】！');
    expect(res.body.isBanned).toBe(true);
  });
});
