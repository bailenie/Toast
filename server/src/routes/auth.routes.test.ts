import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../test/app.js';
import prisma from '../utils/prisma.js';
import { cleanAll } from '../test/cleanup.js';

const app = createTestApp();

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await cleanAll();
  });

  afterAll(async () => {
    await cleanAll();
    await prisma.$disconnect();
  });

  const validRegisterData = {
    email: 'test@example.com',
    password: '123456',
    nickname: '摸鱼水獭',
    avatar: 'moyu_otter',
  };

  it('有效数据注册 → 返回 200，包含 token 和 user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validRegisterData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user).toBeTruthy();
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.user.nickname).toBe('摸鱼水獭');
    expect(res.body.data.user.avatar).toBe('moyu_otter');
    expect(res.body.data.user.salary).toBe(250);
    expect(res.body.data.user.workStart).toBe('09:00');
    expect(res.body.data.user.workEnd).toBe('18:00');
  });

  it('注册后数据库中创建了 User 记录', async () => {
    await request(app).post('/api/auth/register').send(validRegisterData);

    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    expect(user).toBeTruthy();
    expect(user?.nickname).toBe('摸鱼水獭');
  });

  it('注册后不再自动创建私有鱼圈', async () => {
    await request(app).post('/api/auth/register').send(validRegisterData);

    const circles = await prisma.circle.findMany();
    expect(circles.length).toBe(0);
  });

  it('重复邮箱注册 → 返回 400', async () => {
    await request(app).post('/api/auth/register').send(validRegisterData);

    const res = await request(app).post('/api/auth/register').send(validRegisterData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('该邮箱已在职场划水中！请尝试直接登录。');
  });

  it('密码少于 6 位 → 返回 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validRegisterData, password: '12345' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('认证失败：密码过短或网络超时');
  });

  it('昵称为空 → 返回 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validRegisterData, nickname: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('注册需要填写一个萌新新昵称哦~');
  });
});
