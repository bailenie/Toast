import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { drawCard, DAILY_MOYU_LIMIT, GROWTH_THRESHOLDS, FISH_TYPE_MAP } from '../data/unoCards.js';

export const moyuRouter = Router();

// POST /api/moyu/click — 摸鱼点击（V1.1.0 重构）
moyuRouter.post('/click', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { circleId } = req.body;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 校验 circleId
    if (!circleId) {
      res.status(400).json({ success: false, message: '缺少鱼圈ID' });
      return;
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, message: '用户不存在' });
      return;
    }

    // 获取或创建摸鱼统计
    let stat = await prisma.moyuStat.findFirst({
      where: { userId, circleId },
    });

    if (!stat) {
      stat = await prisma.moyuStat.create({
        data: {
          userId,
          userName: user.nickname,
          circleId,
          todayCount: 0,
          totalCount: 0,
          lastMoyuDate: '',
        },
      });
    }

    // 检查是否需要重置今日计数（凌晨0点重置）
    if (stat.lastMoyuDate !== today) {
      await prisma.moyuStat.update({
        where: { id: stat.id },
        data: { todayCount: 0, lastMoyuDate: today },
      });
      stat.todayCount = 0;
    }

    // 检查是否达到上限（固定30次）
    if (stat.todayCount >= DAILY_MOYU_LIMIT) {
      res.status(400).json({
        success: false,
        message: '你已触及今日防沉迷保护网！',
      });
      return;
    }

    // 抽卡（V1.1.0 5档概率算法）
    const userCards = await prisma.unoCard.findMany({ where: { userId } });
    const ownedCardIds = new Set(userCards.map((c) => c.cardId));
    const drawResult = await drawCard(ownedCardIds);

    // 保存卡片到用户收集库
    if (drawResult) {
      const existingCard = await prisma.unoCard.findFirst({
        where: { userId, cardId: drawResult.card.id },
      });

      if (existingCard) {
        await prisma.unoCard.update({
          where: { id: existingCard.id },
          data: { count: { increment: 1 } },
        });
      } else {
        await prisma.unoCard.create({
          data: {
            userId,
            cardId: drawResult.card.id,
            cardName: drawResult.card.name,
            count: 1,
            rarity: drawResult.card.rarity,
            color: drawResult.card.color,
          },
        });
      }
    }

    // 更新摸鱼统计
    await prisma.moyuStat.update({
      where: { id: stat.id },
      data: {
        todayCount: { increment: 1 },
        totalCount: { increment: 1 },
        lastMoyuDate: today,
      },
    });

    // 更新宠物鱼成长值（固定+1，无论是否掉卡）
    let petFish = null;

    const circle = await prisma.circle.findUnique({ where: { id: circleId } });
    if (circle) {
      const newGrowth = circle.petFishGrowth + 1;
      const levelIndex = circle.petFishLevel - 1; // 0-based
      const threshold = GROWTH_THRESHOLDS[levelIndex]; // 当前等级升级所需

      if (threshold !== undefined && newGrowth >= threshold && circle.petFishLevel < 4) {
        // 升级
        const newLevel = circle.petFishLevel + 1;
        const overflow = newGrowth - threshold;
        const fishType = FISH_TYPE_MAP[newLevel] || FISH_TYPE_MAP[1];

        await prisma.circle.update({
          where: { id: circleId },
          data: {
            petFishLevel: newLevel,
            petFishGrowth: overflow,
            petFishType: fishType.name,
          },
        });

        petFish = {
          name: circle.petFishName,
          level: newLevel,
          growth: overflow,
          type: fishType.name,
          requiredGrowth: GROWTH_THRESHOLDS[newLevel - 1] || 0,
          leveledUp: true,
        };
      } else {
        // 未升级，成长值+1
        await prisma.circle.update({
          where: { id: circleId },
          data: { petFishGrowth: { increment: 1 } },
        });

        const nextThreshold = GROWTH_THRESHOLDS[levelIndex] || 0;
        petFish = {
          name: circle.petFishName,
          level: circle.petFishLevel,
          growth: newGrowth,
          type: circle.petFishType,
          requiredGrowth: nextThreshold,
          leveledUp: false,
        };
      }
    }

    // 获取更新后的统计
    const updatedStat = await prisma.moyuStat.findUnique({
      where: { id: stat.id },
    });

    // 构造响应卡片数据
    const cards = drawResult
      ? [{ ...drawResult.card, isNew: drawResult.isNew }]
      : [];

    res.json({
      success: true,
      data: {
        cards,
        petFish,
        todayCount: updatedStat?.todayCount || 1,
        maxCount: DAILY_MOYU_LIMIT,
        totalCount: updatedStat?.totalCount || 1,
      },
    });
  } catch (error) {
    console.error('摸鱼失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/moyu/status — 获取今日摸鱼状态 + 宠物鱼信息（V1.1.0）
moyuRouter.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const circleId = req.query.circleId as string;
    const today = new Date().toISOString().split('T')[0];

    if (!circleId) {
      res.status(400).json({ success: false, message: '缺少鱼圈ID' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, message: '用户不存在' });
      return;
    }

    // 获取或创建摸鱼统计
    let stat = await prisma.moyuStat.findFirst({
      where: { userId, circleId },
    });

    if (!stat) {
      stat = await prisma.moyuStat.create({
        data: {
          userId,
          userName: user.nickname,
          circleId,
          todayCount: 0,
          totalCount: 0,
          lastMoyuDate: '',
        },
      });
    }

    // 检查是否需要重置今日计数
    if (stat.lastMoyuDate !== today) {
      await prisma.moyuStat.update({
        where: { id: stat.id },
        data: { todayCount: 0, lastMoyuDate: today },
      });
      stat.todayCount = 0;
    }

    // 获取宠物鱼信息
    let petFish = null;
    const circle = await prisma.circle.findUnique({ where: { id: circleId } });
    if (circle) {
      const levelIndex = circle.petFishLevel - 1;
      petFish = {
        name: circle.petFishName,
        level: circle.petFishLevel,
        growth: circle.petFishGrowth,
        type: circle.petFishType,
        requiredGrowth: GROWTH_THRESHOLDS[levelIndex] || 0,
      };
    }

    res.json({
      success: true,
      data: {
        todayCount: stat.todayCount,
        maxCount: DAILY_MOYU_LIMIT,
        petFish,
      },
    });
  } catch (error) {
    console.error('获取摸鱼状态失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/moyu/cards — 获取用户卡片收集（不变）
moyuRouter.get('/cards', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const cards = await prisma.unoCard.findMany({
      where: { userId },
    });

    const totalCount = cards.reduce((sum, card) => sum + card.count, 0);
    const uniqueCount = cards.length;

    res.json({
      success: true,
      data: { cards, totalCount, uniqueCount },
    });
  } catch (error) {
    console.error('获取卡片失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/moyu/leaderboard — 获取排行榜（V1.1.0: circleId 从 query 获取）
moyuRouter.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const circleId = req.query.circleId as string;

    if (!circleId) {
      res.json({ success: true, data: { leaderboard: [] } });
      return;
    }

    const stats = await prisma.moyuStat.findMany({
      where: { circleId },
      orderBy: [{ todayCount: 'desc' }, { totalCount: 'desc' }],
      take: 10,
    });

    const leaderboard = stats.map((stat) => ({
      userId: stat.userId,
      userName: stat.userName,
      todayCount: stat.todayCount,
      totalCount: stat.totalCount,
    }));

    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});
