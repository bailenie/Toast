import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

describe('Task-03: 验证鱼圈解散逻辑', () => {
  let userId: string;
  let circleId: string;

  beforeEach(async () => {
    await cleanAll();

    // 创建测试用户
    const hashedPassword = await hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: 'dissolve-test@example.com',
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
        memberCount: 1,
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

  it('鱼圈解散后，Circle 记录被删除', async () => {
    // 验证鱼圈存在
    const circleBefore = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circleBefore).not.toBeNull();

    // 解散鱼圈（删除 Circle 记录）
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证鱼圈被删除
    const circleAfter = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circleAfter).toBeNull();
  });

  it('鱼圈解散后，关联的 CircleDecoration 记录被删除', async () => {
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

    // 解散鱼圈
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证装饰被删除
    const decorAfter = await prisma.circleDecoration.findMany({
      where: { circleId },
    });
    expect(decorAfter).toHaveLength(0);
  });

  it('鱼圈解散后，关联的 UnoCard 记录被删除', async () => {
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

    // 解散鱼圈
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证卡片被删除
    const cardAfter = await prisma.unoCard.findMany({
      where: { circleId },
    });
    expect(cardAfter).toHaveLength(0);
  });

  it('鱼圈解散后，关联的 MoyuStat 记录被删除', async () => {
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

    // 解散鱼圈
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证摸鱼统计被删除
    const statAfter = await prisma.moyuStat.findMany({
      where: { circleId },
    });
    expect(statAfter).toHaveLength(0);
  });

  it('鱼圈解散后，关联的 SignRecord 记录被删除', async () => {
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

    // 解散鱼圈
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证签到记录被删除
    const recordAfter = await prisma.signRecord.findMany({
      where: { circleId },
    });
    expect(recordAfter).toHaveLength(0);
  });

  it('鱼圈解散后，关联的 ExchangeRecord 记录被删除', async () => {
    // 创建装饰
    const decoration = await prisma.decoration.create({
      data: {
        name: '测试装饰',
        icon: '🎨',
        price: 50,
        description: '测试装饰描述',
      },
    });

    // 创建兑换记录
    await prisma.exchangeRecord.create({
      data: {
        circleId,
        userId,
        decorationId: decoration.id,
        cost: 50,
      },
    });

    // 验证兑换记录存在
    const exchangeBefore = await prisma.exchangeRecord.findMany({
      where: { circleId },
    });
    expect(exchangeBefore).toHaveLength(1);

    // 解散鱼圈
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证兑换记录被删除
    const exchangeAfter = await prisma.exchangeRecord.findMany({
      where: { circleId },
    });
    expect(exchangeAfter).toHaveLength(0);
  });
});
