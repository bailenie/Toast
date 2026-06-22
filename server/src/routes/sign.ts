import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const signRouter = Router();

// POST /api/circles/:id/sign — 签到领鱼币
signRouter.post('/:id/sign', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { id: circleId } = req.params;

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

    // 获取今天的日期 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // 检查今天是否已签到
    const existingSign = await prisma.signRecord.findUnique({
      where: {
        userId_circleId_signDate: {
          userId,
          circleId,
          signDate: today,
        },
      },
    });

    if (existingSign) {
      res.status(400).json({
        success: false,
        message: '今日已签到',
        code: 'ALREADY_SIGNED',
      });
      return;
    }

    // 创建签到记录
    const signIn = await prisma.signRecord.create({
      data: {
        userId,
        circleId,
        signDate: today,
      },
    });

    // 鱼圈 coinBalance + 1
    const updatedCircle = await prisma.circle.update({
      where: { id: circleId },
      data: { coinBalance: { increment: 1 } },
    });

    res.json({
      success: true,
      data: {
        signIn: {
          id: signIn.id,
          userId: signIn.userId,
          circleId: signIn.circleId,
          signInDate: signIn.signDate,
          createdAt: signIn.createdAt,
        },
        coinBalance: updatedCircle.coinBalance,
        message: '签到成功！+1鱼币',
      },
    });
  } catch (error) {
    console.error('签到失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// GET /api/circles/:id/sign-status — 获取签到状态
signRouter.get('/:id/sign-status', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { id: circleId } = req.params;

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

    // 获取今天的日期
    const today = new Date().toISOString().split('T')[0];

    // 检查今天是否已签到
    const existingSign = await prisma.signRecord.findUnique({
      where: {
        userId_circleId_signDate: {
          userId,
          circleId,
          signDate: today,
        },
      },
    });

    // 获取鱼圈信息
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
      select: { coinBalance: true },
    });

    // 获取本周签到日期列表
    const weekStart = getWeekStart();
    const weekSigns = await prisma.signRecord.findMany({
      where: {
        userId,
        circleId,
        signDate: {
          gte: weekStart,
        },
      },
      select: { signDate: true },
    });

    const signInDates = weekSigns.map((s) => s.signDate);

    res.json({
      success: true,
      data: {
        isSignedToday: !!existingSign,
        coinBalance: circle?.coinBalance || 0,
        signInDates,
      },
    });
  } catch (error) {
    console.error('获取签到状态失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// 获取本周开始日期（周一）
function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周一为一周开始
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diff);
  return weekStart.toISOString().split('T')[0];
}
