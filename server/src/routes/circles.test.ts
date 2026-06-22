import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

describe('POST /api/circles — 创建鱼圈', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await cleanAll();

    // 创建测试用户
    const hashedPassword = await hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: 'circle-test@example.com',
        password: hashedPassword,
        nickname: '测试用户',
        avatar: 'moyu_otter',
      },
    });
    userId = user.id;

    // 登录获取 token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'circle-test@example.com', password: 'password123' });
    token = loginRes.body.data.token;
  });

  afterAll(async () => {
    await cleanAll();
  });

  it('传入有效名称 → 返回 200，body 包含 circle', async () => {
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '第五工位躺平分会' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.circle).toBeDefined();
  });

  it('返回的 circle 包含正确字段', async () => {
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '测试鱼圈' });

    const { circle } = res.body.data;
    expect(circle.id).toBeDefined();
    expect(circle.name).toBe('测试鱼圈');
    expect(circle.isActive).toBe(false);
    expect(circle.memberCount).toBe(1);
  });

  it('返回的 invite 包含6位数字邀请码', async () => {
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '测试鱼圈' });

    const { invite } = res.body.data;
    expect(invite).toBeDefined();
    expect(invite.code).toMatch(/^\d{6}$/);
    expect(parseInt(invite.code, 10)).toBeGreaterThanOrEqual(100000);
    expect(parseInt(invite.code, 10)).toBeLessThanOrEqual(999999);
    expect(invite.expiresAt).toBeDefined();
  });

  it('数据库中创建了 Circle 记录', async () => {
    await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '数据库测试' });

    const circle = await prisma.circle.findFirst({
      where: { name: '数据库测试' },
    });
    expect(circle).toBeTruthy();
  });

  it('创建者通过 UserCircle 加入鱼圈', async () => {
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '更新用户测试' });

    const circleId = res.body.data.circle.id;
    const userCircle = await prisma.userCircle.findUnique({
      where: {
        userId_circleId: {
          userId,
          circleId,
        },
      },
    });
    expect(userCircle).toBeTruthy();
  });

  it('名称超过50字符 → 返回 400', async () => {
    const longName = 'a'.repeat(51);
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: longName });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('名称超长，鱼圈名限50字以内哦~');
  });

  it('名称为空 → 返回 400', async () => {
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('请输入鱼圈名称');
  });

  it('未登录 → 返回 401', async () => {
    const res = await request(app)
      .post('/api/circles')
      .send({ name: '未登录测试' });

    expect(res.status).toBe(401);
  });

  it('已有3个等待中鱼圈 → 创建第4个返回 400', async () => {
    // 创建3个等待中的鱼圈（isActive=false）
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/circles')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `等待中鱼圈${i + 1}` });
    }

    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '第4个鱼圈' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('3');
  });

  it('已有2个等待中鱼圈 → 创建第3个成功', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app)
        .post('/api/circles')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `等待中鱼圈${i + 1}` });
    }

    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '第3个鱼圈' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.circle.name).toBe('第3个鱼圈');
  });

  it('无等待中鱼圈 → 创建成功', async () => {
    const res = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '正常创建' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /api/circles/pending — 获取等待中鱼圈', () => {
  let token: string;

  beforeEach(async () => {
    await cleanAll();

    const hashedPassword = await hashPassword('password123');
    await prisma.user.create({
      data: {
        email: 'pending-test@example.com',
        password: hashedPassword,
        nickname: '测试用户',
        avatar: 'moyu_otter',
      },
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pending-test@example.com', password: 'password123' });
    token = loginRes.body.data.token;
  });

  afterAll(async () => {
    await cleanAll();
  });

  it('返回当前用户的等待中鱼圈列表', async () => {
    // 创建一个等待中的鱼圈
    await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '测试鱼圈' });

    const res = await request(app)
      .get('/api/circles/pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pendingCircles).toHaveLength(1);
    expect(res.body.data.pendingCircles[0].circleName).toBe('测试鱼圈');
  });

  it('无等待中鱼圈时返回空数组', async () => {
    const res = await request(app)
      .get('/api/circles/pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pendingCircles).toEqual([]);
  });

  it('不返回其他用户创建的等待中鱼圈', async () => {
    const hashedPassword = await hashPassword('password123');
    const otherUser = await prisma.user.create({
      data: {
        email: 'other-user@example.com',
        password: hashedPassword,
        nickname: '其他用户',
        avatar: 'moyu_otter',
      },
    });

    // 其他用户创建鱼圈
    await prisma.circle.create({
      data: {
        name: '其他人的鱼圈',
        owner: { connect: { id: otherUser.id } },
        memberCount: 1,
      },
    });

    const res = await request(app)
      .get('/api/circles/pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const names = res.body.data.pendingCircles.map((c: any) => c.circleName);
    expect(names).not.toContain('其他人的鱼圈');
  });

  it('不返回已激活的鱼圈', async () => {
    // 创建鱼圈
    const createRes = await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '测试鱼圈' });

    const circleId = createRes.body.data.circle.id;

    // 手动激活
    await prisma.circle.update({
      where: { id: circleId },
      data: { isActive: true },
    });

    const res = await request(app)
      .get('/api/circles/pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pendingCircles).toHaveLength(0);
  });

  it('列表按创建时间倒序排列', async () => {
    await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '先创建的' });

    await request(app)
      .post('/api/circles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '后创建的' });

    const res = await request(app)
      .get('/api/circles/pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const circles = res.body.data.pendingCircles;
    expect(circles[0].circleName).toBe('后创建的');
    expect(circles[1].circleName).toBe('先创建的');
  });

  it('未登录 → 返回 401', async () => {
    const res = await request(app)
      .get('/api/circles/pending');

    expect(res.status).toBe(401);
  });
});
