import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

describe('POST /api/circles/join — 加入鱼圈', () => {
  let token: string;
  let userId: string;
  let circleId: string;
  let inviteCode: string;

  beforeEach(async () => {
    await cleanAll();

    // 创建测试用户
    const hashedPassword = await hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: 'join-test@example.com',
        password: hashedPassword,
        nickname: '测试用户',
        avatar: 'moyu_otter',
      },
    });
    userId = user.id;

    // 创建另一个用户作为鱼圈创建者
    const creator = await prisma.user.create({
      data: {
        email: 'creator-test@example.com',
        password: hashedPassword,
        nickname: '创建者',
        avatar: 'moyu_otter',
      },
    });

    // 创建鱼圈
    const circle = await prisma.circle.create({
      data: {
        name: '测试鱼圈',
        owner: { connect: { id: creator.id } },
        memberCount: 1,
      },
    });
    circleId = circle.id;

    // 创建邀请码（新流程需要 Invite 记录）
    const invite = await prisma.invite.create({
      data: {
        circleId: circle.id,
        code: '123456',
        createdBy: creator.id,
        status: 'active',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    inviteCode = invite.code;

    // 创建者加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId: creator.id,
        circleId: circle.id,
      },
    });

    // 登录获取 token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'join-test@example.com', password: 'password123' });
    token = loginRes.body.data.token;
  });

  afterAll(async () => {
    await cleanAll();
  });

  it('传入有效邀请码 → 返回 200，body 包含 circle', async () => {
    const res = await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: inviteCode });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.circle).toBeDefined();
  });

  it('鱼圈成员数+1', async () => {
    await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: inviteCode });

    const circle = await prisma.circle.findUnique({ where: { id: circleId } });
    expect(circle?.memberCount).toBe(2);
  });

  it('用户通过 UserCircle 加入鱼圈', async () => {
    await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: inviteCode });

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

  it('邀请码不存在 → 返回 400', async () => {
    const res = await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: '999999' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('找不到匹配的鱼圈');
  });

  it('鱼圈已满10人 → 返回 400', async () => {
    await prisma.circle.update({
      where: { id: circleId },
      data: { memberCount: 10 },
    });

    const res = await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: inviteCode });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('满负荷');
  });

  it('已在该圈 → 返回 400', async () => {
    // 先加入
    await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: inviteCode });

    // 再次加入
    const res = await request(app)
      .post('/api/circles/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: inviteCode });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('已经在这只划水队伍中');
  });
});
