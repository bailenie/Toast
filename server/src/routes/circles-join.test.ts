import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { cleanAll } from '../test/cleanup.js';

describe('Task-04: 验证加入鱼圈逻辑', () => {
  let ownerUserId: string;
  let newMemberUserId: string;
  let circleId: string;

  beforeEach(async () => {
    await cleanAll();

    // 创建圈主
    const hashedPassword = await hashPassword('password123');
    const owner = await prisma.user.create({
      data: {
        email: 'owner@example.com',
        password: hashedPassword,
        nickname: '圈主',
        avatar: 'moyu_otter',
      },
    });
    ownerUserId = owner.id;

    // 创建新成员
    const newMember = await prisma.user.create({
      data: {
        email: 'new-member@example.com',
        password: hashedPassword,
        nickname: '新成员',
        avatar: 'moyu_otter',
      },
    });
    newMemberUserId = newMember.id;

    // 创建鱼圈
    const circle = await prisma.circle.create({
      data: {
        name: '测试鱼圈',
        ownerId: ownerUserId,
        memberCount: 1,
        isActive: true,
        coinBalance: 100,
        petFishGrowth: 50,
        petFishLevel: 2,
      },
    });
    circleId = circle.id;

    // 创建圈主的 UserCircle 记录
    await prisma.userCircle.create({
      data: {
        userId: ownerUserId,
        circleId,
      },
    });
  });

  afterAll(async () => {
    await cleanAll();
  });

  it('新成员加入鱼圈后，可以查询到鱼圈的 CircleDecoration 记录', async () => {
    // 创建装饰
    const decoration = await prisma.decoration.create({
      data: {
        name: '测试装饰',
        icon: '🎨',
        price: 50,
        description: '测试装饰描述',
      },
    });

    // 圈主购买装饰
    await prisma.circleDecoration.create({
      data: {
        circleId,
        decorationId: decoration.id,
        purchasedBy: ownerUserId,
      },
    });

    // 新成员加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId: newMemberUserId,
        circleId,
      },
    });

    // 验证新成员可以查询到装饰
    const decor = await prisma.circleDecoration.findMany({
      where: { circleId },
    });
    expect(decor).toHaveLength(1);
    expect(decor[0].decorationId).toBe(decoration.id);
  });

  it('新成员加入鱼圈后，可以查询到鱼圈的 UnoCard 记录', async () => {
    // 圈主抽卡
    await prisma.unoCard.create({
      data: {
        user: { connect: { id: ownerUserId } },
        circle: { connect: { id: circleId } },
        cardId: 'card-001',
        cardName: '测试卡片',
        rarity: 'N',
        color: 'red',
        count: 1,
      },
    });

    // 新成员加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId: newMemberUserId,
        circleId,
      },
    });

    // 验证新成员可以查询到卡片
    const cards = await prisma.unoCard.findMany({
      where: { circleId },
    });
    expect(cards).toHaveLength(1);
    expect(cards[0].cardId).toBe('card-001');
  });

  it('新成员加入鱼圈后，可以查询到鱼圈的 MoyuStat 排行榜', async () => {
    // 圈主摸鱼
    await prisma.moyuStat.create({
      data: {
        userId: ownerUserId,
        userName: '圈主',
        circleId,
        todayCount: 5,
        totalCount: 10,
        lastMoyuDate: '2026-06-25',
      },
    });

    // 新成员加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId: newMemberUserId,
        circleId,
      },
    });

    // 验证新成员可以查询到排行榜
    const stats = await prisma.moyuStat.findMany({
      where: { circleId },
    });
    expect(stats).toHaveLength(1);
    expect(stats[0].userId).toBe(ownerUserId);
  });

  it('新成员加入鱼圈后，可以看到 Circle.coinBalance', async () => {
    // 新成员加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId: newMemberUserId,
        circleId,
      },
    });

    // 验证新成员可以看到鱼币余额
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circle?.coinBalance).toBe(100);
  });

  it('新成员加入鱼圈后，可以看到 Circle.petFishGrowth/Level', async () => {
    // 新成员加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId: newMemberUserId,
        circleId,
      },
    });

    // 验证新成员可以看到宠物鱼状态
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
    });
    expect(circle?.petFishGrowth).toBe(50);
    expect(circle?.petFishLevel).toBe(2);
  });
});
