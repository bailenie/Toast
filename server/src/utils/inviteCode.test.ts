import { describe, it, expect, beforeEach } from 'vitest';
import { generateUniqueCode } from './inviteCode.js';
import prisma from './prisma.js';
import { cleanAll } from '../test/cleanup.js';

describe('generateUniqueCode', () => {
  beforeEach(async () => {
    await cleanAll();
  });

  it('返回6位数字字符串', async () => {
    const code = await generateUniqueCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('返回的邀请码在100000-999999范围内', async () => {
    const code = await generateUniqueCode();
    const num = parseInt(code, 10);
    expect(num).toBeGreaterThanOrEqual(100000);
    expect(num).toBeLessThanOrEqual(999999);
  });

  it('连续生成10个邀请码，无重复', async () => {
    const codes = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const code = await generateUniqueCode();
      codes.add(code);
    }
    expect(codes.size).toBe(10);
  });

  it('当邀请码已存在时，生成新的唯一邀请码', async () => {
    // 先创建一个测试用户
    const testUser = await prisma.user.create({
      data: {
        email: 'invite-test@example.com',
        password: 'hashedpassword',
        nickname: '测试用户',
        avatar: 'moyu_otter',
      },
    });

    // 创建一个鱼圈（Invite 需要 circleId 外键）
    const testCircle = await prisma.circle.create({
      data: {
        name: '测试鱼圈',
        owner: { connect: { id: testUser.id } },
        memberCount: 1,
      },
    });

    // 创建一个使用特定邀请码的邀请记录
    const firstCode = await generateUniqueCode();
    await prisma.invite.create({
      data: {
        circleId: testCircle.id,
        code: firstCode,
        createdBy: testUser.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    // 再次生成，应该得到不同的邀请码
    const secondCode = await generateUniqueCode();
    expect(secondCode).not.toBe(firstCode);

    // 清理
    await prisma.invite.deleteMany({});
    await prisma.circle.deleteMany({});
    await prisma.user.delete({ where: { id: testUser.id } });
  });
});
