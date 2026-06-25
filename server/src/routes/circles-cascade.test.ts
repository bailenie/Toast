import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

describe('Task-01: 验证 Prisma 级联删除关系', () => {
  let userId: string;
  let circleId: string;

  beforeEach(async () => {
    await cleanAll();

    // 创建测试用户
    const hashedPassword = await hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: 'cascade-test@example.com',
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

  it('删除 Circle 后，关联的 UnoCard 记录自动删除', async () => {
    // 创建 UnoCard 记录
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

    // 验证记录存在
    const cardBefore = await prisma.unoCard.findMany({
      where: { circleId },
    });
    expect(cardBefore).toHaveLength(1);

    // 删除 Circle
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证 UnoCard 记录被级联删除
    const cardAfter = await prisma.unoCard.findMany({
      where: { circleId },
    });
    expect(cardAfter).toHaveLength(0);
  });

  it('删除 Circle 后，关联的 MoyuStat 记录自动删除', async () => {
    // 创建 MoyuStat 记录
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

    // 验证记录存在
    const statBefore = await prisma.moyuStat.findMany({
      where: { circleId },
    });
    expect(statBefore).toHaveLength(1);

    // 删除 Circle
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证 MoyuStat 记录被级联删除
    const statAfter = await prisma.moyuStat.findMany({
      where: { circleId },
    });
    expect(statAfter).toHaveLength(0);
  });

  it('删除 Circle 后，关联的 SignRecord 记录自动删除', async () => {
    // 创建 SignRecord 记录
    await prisma.signRecord.create({
      data: {
        userId,
        circleId,
        signDate: '2026-06-25',
      },
    });

    // 验证记录存在
    const recordBefore = await prisma.signRecord.findMany({
      where: { circleId },
    });
    expect(recordBefore).toHaveLength(1);

    // 删除 Circle
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证 SignRecord 记录被级联删除
    const recordAfter = await prisma.signRecord.findMany({
      where: { circleId },
    });
    expect(recordAfter).toHaveLength(0);
  });

  it('删除 Circle 后，关联的 CircleDecoration 记录自动删除', async () => {
    // 创建 Decoration
    const decoration = await prisma.decoration.create({
      data: {
        name: '测试装饰',
        icon: '🎨',
        price: 50,
        description: '测试装饰描述',
      },
    });

    // 创建 CircleDecoration 记录
    await prisma.circleDecoration.create({
      data: {
        circleId,
        decorationId: decoration.id,
        purchasedBy: userId,
      },
    });

    // 验证记录存在
    const decorBefore = await prisma.circleDecoration.findMany({
      where: { circleId },
    });
    expect(decorBefore).toHaveLength(1);

    // 删除 Circle
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证 CircleDecoration 记录被级联删除
    const decorAfter = await prisma.circleDecoration.findMany({
      where: { circleId },
    });
    expect(decorAfter).toHaveLength(0);
  });

  it('删除 Circle 后，关联的 ExchangeRecord 记录自动删除', async () => {
    // 创建 Decoration
    const decoration = await prisma.decoration.create({
      data: {
        name: '测试装饰',
        icon: '🎨',
        price: 50,
        description: '测试装饰描述',
      },
    });

    // 创建 ExchangeRecord 记录
    await prisma.exchangeRecord.create({
      data: {
        circleId,
        userId,
        decorationId: decoration.id,
        cost: 50,
      },
    });

    // 验证记录存在
    const exchangeBefore = await prisma.exchangeRecord.findMany({
      where: { circleId },
    });
    expect(exchangeBefore).toHaveLength(1);

    // 删除 Circle
    await prisma.circle.delete({
      where: { id: circleId },
    });

    // 验证 ExchangeRecord 记录被级联删除
    const exchangeAfter = await prisma.exchangeRecord.findMany({
      where: { circleId },
    });
    expect(exchangeAfter).toHaveLength(0);
  });
});
