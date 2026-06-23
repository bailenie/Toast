import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const decorationsRouter = Router();

// GET /api/decorations — 获取装饰列表（包含鱼圈购买状态）
decorationsRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const { circleId } = req.query;

    if (!circleId || typeof circleId !== 'string') {
      res.status(400).json({
        success: false,
        message: '缺少 circleId 参数',
      });
      return;
    }

    // 检查鱼圈是否存在
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
      select: { coinBalance: true },
    });

    if (!circle) {
      res.status(404).json({
        success: false,
        message: '鱼圈不存在',
      });
      return;
    }

    // 获取所有装饰
    const decorations = await prisma.decoration.findMany({
      orderBy: { price: 'asc' },
    });

    // 获取鱼圈已购买的装饰
    const purchasedDecorations = await prisma.circleDecoration.findMany({
      where: { circleId },
      select: { decorationId: true, purchasedAt: true },
    });

    const purchasedMap = new Map(
      purchasedDecorations.map((pd) => [pd.decorationId, pd.purchasedAt])
    );

    // 合并装饰列表和购买状态
    const decorationsWithStatus = decorations.map((decoration) => ({
      id: decoration.id,
      name: decoration.name,
      icon: decoration.icon,
      price: decoration.price,
      description: decoration.description,
      isPurchased: purchasedMap.has(decoration.id),
      purchasedAt: purchasedMap.get(decoration.id) || null,
    }));

    res.json({
      success: true,
      data: {
        decorations: decorationsWithStatus,
        coinBalance: circle.coinBalance,
      },
    });
  } catch (error) {
    console.error('获取装饰列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// GET /api/decorations/records — 获取兑换记录
decorationsRouter.get('/records', authMiddleware, async (req, res) => {
  try {
    const { circleId } = req.query;

    if (!circleId || typeof circleId !== 'string') {
      res.status(400).json({
        success: false,
        message: '缺少 circleId 参数',
      });
      return;
    }

    // 检查鱼圈是否存在
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
    });

    if (!circle) {
      res.status(404).json({
        success: false,
        message: '鱼圈不存在',
      });
      return;
    }

    // 获取兑换记录
    const records = await prisma.exchangeRecord.findMany({
      where: { circleId },
      include: {
        user: { select: { nickname: true } },
        decoration: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedRecords = records.map((record) => ({
      id: record.id,
      userId: record.userId,
      userName: record.user.nickname,
      decorationId: record.decorationId,
      decorationName: record.decoration.name,
      cost: record.cost,
      createdAt: record.createdAt,
    }));

    res.json({
      success: true,
      data: { records: formattedRecords },
    });
  } catch (error) {
    console.error('获取兑换记录失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// POST /api/decorations/buy — 购买装饰
decorationsRouter.post('/buy', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { circleId, decorationId } = req.body;

    if (!circleId || !decorationId) {
      res.status(400).json({
        success: false,
        message: '缺少 circleId 或 decorationId 参数',
      });
      return;
    }

    // 检查用户是否为该鱼圈成员
    const membership = await prisma.userCircle.findUnique({
      where: {
        userId_circleId: {
          userId,
          circleId,
        },
      },
    });

    if (!membership) {
      res.status(403).json({
        success: false,
        message: '你不是该鱼圈成员',
        code: 'NOT_MEMBER',
      });
      return;
    }

    // 获取装饰信息
    const decoration = await prisma.decoration.findUnique({
      where: { id: decorationId },
    });

    if (!decoration) {
      res.status(404).json({
        success: false,
        message: '装饰不存在',
      });
      return;
    }

    // 检查是否已购买
    const existingPurchase = await prisma.circleDecoration.findUnique({
      where: {
        circleId_decorationId: {
          circleId,
          decorationId,
        },
      },
    });

    if (existingPurchase) {
      res.status(400).json({
        success: false,
        message: '该装饰已购买',
        code: 'ALREADY_PURCHASED',
      });
      return;
    }

    // 获取鱼圈信息
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
    });

    if (!circle) {
      res.status(404).json({
        success: false,
        message: '鱼圈不存在',
      });
      return;
    }

    // 检查鱼币余额
    if (circle.coinBalance < decoration.price) {
      res.status(400).json({
        success: false,
        message: '鱼币不足，无法购买',
        code: 'INSUFFICIENT_COINS',
      });
      return;
    }

    // 扣除鱼币、创建购买记录、记录兑换
    const [updatedCircle, circleDecoration] = await prisma.$transaction([
      prisma.circle.update({
        where: { id: circleId },
        data: { coinBalance: { decrement: decoration.price } },
      }),
      prisma.circleDecoration.create({
        data: {
          circleId,
          decorationId,
          purchasedBy: userId,
        },
      }),
      prisma.exchangeRecord.create({
        data: {
          circleId,
          userId,
          decorationId,
          cost: decoration.price,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        circleDecoration: {
          id: circleDecoration.id,
          circleId: circleDecoration.circleId,
          decorationId: circleDecoration.decorationId,
          purchasedBy: circleDecoration.purchasedBy,
          purchasedAt: circleDecoration.purchasedAt,
        },
        coinBalance: updatedCircle.coinBalance,
        message: '购买成功！',
      },
    });
  } catch (error) {
    console.error('购买装饰失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});
