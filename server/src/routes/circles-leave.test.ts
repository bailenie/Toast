import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

describe('Task-02: 验证退出鱼圈逻辑', () => {
  let userId: string;
  let circleId: string;

  beforeEach(async () => {
    await cleanAll();

    // 创建测试用户
    const hashedPassword = await hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: 'leave-test@example.com',
        password: hashedPassword,
        nickname: '测试用户',
        avatar: 'moyu_otter',
      },
    });
    userId = user.id;

    // 创建鱼圈
    const circle = await prisma.circle.create({
      data: {
        name: '测试鱼圈',
        ownerId: userId,
        memberCount: 2,
        isActive: true,
        coinBalance: 100,
        petFishGrowth: 50,
        petFishLevel: 2,
      },
    });
    circleId = circle.id;

    // 创建 UserCircle 记录
    await prisma.userCircle.create({
      data: {
        userId,
        circleId,
      },
    });
  });

  afterAll(async () => {
    await cleanAll();
  });

  it('用户退出鱼圈后，CircleDecoration 记录仍然存在', async () => {
    // 创建装饰
    const decoration = await prisma.decoration.create({
      data: {
        name: '测试装饰',
        icon: '🎨',
        price: 50,
        description: '测试装饰描述',
      },
    });

    // 购买装饰
    await prisma.circleDecoration.create({
      data: {
        circleId,
        decorationId: decoration.id,
        purchasedBy: userId,
      },
    });

    // 验证装饰存在
    const decorBefore = await prisma.circleDecoration.findMany({
      where: { circleId },
    });
    expect(decorBefore).toHaveLength(1);

    // 退出鱼圈（删除 UserCircle 记录）
    await prisma.userCircle.delete({
      where: {
        userId_circleId: { userId, circleId },
      },
    });

    // 验证装饰仍然存在
    const decorAfter = await prisma.circleDecoration.findMany({
      where: { circleId },
    });
    expect(decorAfter).toHaveLength(1);
  });

  it('用户退出鱼圈后，UnoCard 记录仍然存在', async () => {
    // 创建卡片
    await prisma.unoCard.create({
      data: {
        user: { connect: { id: userId } },
        circle: { connect: { id: circleId } },
        cardId: 'card-001',
        cardName: '测试卡片',
        rarity: 'N',
        color: 'red',
        count: 1,
      },
    });

    // 验证卡片存在
    const cardBefore = await prisma.unoCard.findMany({
      where: { circleId },
    });
    expect(cardBefore).toHaveLength(1);

    // 退出鱼圈
    await prisma.userCircle.delete({
      where: {
        userId_circleId: { userId, circleId },
      },
    });

    // 验证卡片仍然存在
    const cardAfter = await prisma.unoCard.findMany({
      where: { circleId },
    });
    expect(cardAfter).toHaveLength(1);
  });

  it('用户退出鱼圈后，MoyuStat 记录仍然存在', async () => {
    // 创建摸鱼统计
    await prisma.moyuStat.create({
      data: {
        userId,
        userName: '测试用户',
        circleId,
        todayCount: 5,
        totalCount: 10,
        lastMoyuDate: '2026-06-25',
      },
    });

    // 验证摸鱼统计存在
    const statBefore = await prisma.moyuStat.findMany({
      where: { circleId },
    });
    expect(statBefore).toHaveLength(1);

    // 退出鱼圈
    await prisma.userCircle.delete({
      where: {
        userId_circleId: { userId, circleId },
      },
    });

    // 验证摸鱼统计仍然存在
    const statAfter = await prisma.moyuStat.findMany({
      where: { circleId },
    });
    expect(statAfter).toHaveLength(1);
  });

  it('用户退出鱼圈后，SignRecord 记录仍然存在', async () => {
    // 创建签到记录
    await prisma.signRecord.create({
      data: {
        userId,
        circleId,
        signDate: '2026-06-25',
      },
    });

    // 验证签到记录存在
    const recordBefore = await prisma.signRecord.findMany({
      where: { circleId },
    });
    expect(recordBefore).toHaveLength(1);

    // 退出鱼圈
    await prisma.userCircle.delete({
      where: {
        userId_circleId: { userId, circleId },
      },
    });

    // 验证签到记录仍然存在
    const recordAfter = await prisma.signRecord.findMany({
      where: { circleId },
    });
    expect(recordAfter).toHaveLength(1);
  });

  it('用户退出鱼圈后，Circle.coinBalance 不变', async () => {
    // 验证初始鱼币余额
    const circleBefore = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circleBefore?.coinBalance).toBe(100);

    // 退出鱼圈
    await prisma.userCircle.delete({
      where: {
        userId_circleId: { userId, circleId },
      },
    });

    // 验证鱼币余额不变
    const circleAfter = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circleAfter?.coinBalance).toBe(100);
  });

  it('用户退出鱼圈后，Circle.petFishGrowth/Level 不变', async () => {
    // 验证初始宠物鱼状态
    const circleBefore = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circleBefore?.petFishGrowth).toBe(50);
    expect(circleBefore?.petFishLevel).toBe(2);

    // 退出鱼圈
    await prisma.userCircle.delete({
      where: {
        userId_circleId: { userId, circleId },
      },
    });

    // 验证宠物鱼状态不变
    const circleAfter = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circleAfter?.petFishGrowth).toBe(50);
    expect(circleAfter?.petFishLevel).toBe(2);
  });
});
