import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const circlesRouter = Router();

// 生成6位数字邀请码
function generateInviteCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// GET /api/circles — 获取当前用户加入的所有鱼圈
circlesRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const userCircles = await prisma.userCircle.findMany({
      where: {
        userId,
        circle: { isActive: true },
      },
      include: {
        circle: {
          select: {
            id: true,
            name: true,
            icon: true,
            memberCount: true,
            isActive: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const circles = userCircles.map((uc) => ({
      ...uc.circle,
      unreadCount: 0, // 本期简化，后续补充实时未读
    }));

    res.json({
      success: true,
      data: { circles },
    });
  } catch (error) {
    console.error('获取鱼圈列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// GET /api/circles/pending — 获取当前用户"等待中"的鱼圈列表
circlesRouter.get('/pending', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const pendingCircles = await prisma.circle.findMany({
      where: {
        ownerId: userId,
        isActive: false,
      },
      include: {
        invites: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            code: true,
            expiresAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = pendingCircles.map((circle) => ({
      circleId: circle.id,
      circleName: circle.name,
      circleIcon: circle.icon,
      inviteCode: circle.invites[0]?.code || null,
      expiresAt: circle.invites[0]?.expiresAt || null,
      memberCount: circle.memberCount,
      createdAt: circle.createdAt,
    }));

    res.json({
      success: true,
      data: { pendingCircles: result },
    });
  } catch (error) {
    console.error('获取等待中鱼圈失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// POST /api/circles — 创建鱼圈
circlesRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { name } = req.body;

    // 输入验证
    if (!name || name.trim() === '') {
      res.status(400).json({
        success: false,
        message: '请输入鱼圈名称',
        code: 'CIRCLE_NAME_EMPTY',
      });
      return;
    }

    if (name.length > 50) {
      res.status(400).json({
        success: false,
        message: '名称超长，鱼圈名限50字以内哦~',
        code: 'CIRCLE_NAME_TOO_LONG',
      });
      return;
    }

    // 检查等待中鱼圈数量上限（3个）
    const pendingCount = await prisma.circle.count({
      where: {
        ownerId: userId,
        isActive: false,
      },
    });
    if (pendingCount >= 3) {
      res.status(400).json({
        success: false,
        message: '你已经有3个等待中的鱼圈了，等它们过期或有人加入后再创建吧！',
        code: 'PENDING_CIRCLE_LIMIT',
      });
      return;
    }

    // 生成唯一邀请码
    let code = generateInviteCode();
    while (true) {
      const existing = await prisma.invite.findUnique({ where: { code } });
      if (!existing) break;
      code = generateInviteCode();
    }

    // 创建鱼圈（未激活状态）
    const circle = await prisma.circle.create({
      data: {
        name: name.trim(),
        code,
        owner: { connect: { id: userId } },
        isActive: false,
        memberCount: 1,
      },
    });

    // 创建者自动加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId,
        circleId: circle.id,
      },
    });

    // 生成邀请码（1小时有效期）
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const invite = await prisma.invite.create({
      data: {
        circleId: circle.id,
        code,
        createdBy: userId,
        status: 'active',
        expiresAt,
      },
    });

    res.json({
      success: true,
      data: {
        circle: {
          id: circle.id,
          name: circle.name,
          icon: circle.icon,
          isActive: circle.isActive,
          memberCount: circle.memberCount,
        },
        invite: {
          code: invite.code,
          expiresAt: invite.expiresAt.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('创建鱼圈失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// POST /api/circles/join — 通过邀请码加入鱼圈
circlesRouter.post('/join', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { code } = req.body;

    // 输入验证
    if (!code || !/^\d{6}$/.test(code)) {
      res.status(400).json({
        success: false,
        message: '请输入正确的6位邀请码',
        code: 'CIRCLE_INVALID_CODE',
      });
      return;
    }

    // 根据邀请码查询邀请记录
    const invite = await prisma.invite.findUnique({
      where: { code },
      include: { circle: true },
    });

    if (!invite) {
      res.status(400).json({
        success: false,
        message: '找不到匹配的鱼圈！请核对同事给的6位分享秘钥是否正确。',
        code: 'CIRCLE_INVALID_CODE',
      });
      return;
    }

    // 检查邀请码是否已过期
    if (invite.status === 'expired' || new Date() > invite.expiresAt) {
      res.status(400).json({
        success: false,
        message: '邀请已过期，请让同事重新生成邀请码~',
        code: 'INVITE_EXPIRED',
      });
      return;
    }

    // 检查鱼圈是否已满（最多10人）
    if (invite.circle.memberCount >= 10) {
      res.status(400).json({
        success: false,
        message: '这个划水小分队已经达到10人满负荷啦！',
        code: 'CIRCLE_FULL',
      });
      return;
    }

    // 检查用户是否已在该圈
    const existingMembership = await prisma.userCircle.findUnique({
      where: {
        userId_circleId: {
          userId,
          circleId: invite.circleId,
        },
      },
    });

    if (existingMembership) {
      res.status(400).json({
        success: false,
        message: '你已经在这只划水队伍中啦！',
        code: 'CIRCLE_ALREADY_MEMBER',
      });
      return;
    }

    // 加入鱼圈
    await prisma.userCircle.create({
      data: {
        userId,
        circleId: invite.circleId,
      },
    });

    // 更新鱼圈成员数
    const updatedCircle = await prisma.circle.update({
      where: { id: invite.circleId },
      data: { memberCount: { increment: 1 } },
    });

    // 检查是否达到2人，自动激活
    if (updatedCircle.memberCount >= 2 && !updatedCircle.isActive) {
      await prisma.circle.update({
        where: { id: invite.circleId },
        data: { isActive: true },
      });
      // 更新邀请码状态为完成
      await prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'completed' },
      });
    }

    res.json({
      success: true,
      data: {
        circle: {
          id: updatedCircle.id,
          name: updatedCircle.name,
          icon: updatedCircle.icon,
          isActive: updatedCircle.memberCount >= 2,
          memberCount: updatedCircle.memberCount,
        },
      },
    });
  } catch (error) {
    console.error('加入鱼圈失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// POST /api/circles/:id/leave — 退出鱼圈
circlesRouter.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // 查询鱼圈
    const circle = await prisma.circle.findUnique({
      where: { id },
    });

    if (!circle) {
      res.status(404).json({
        success: false,
        message: '鱼圈不存在',
      });
      return;
    }

    // 检查用户是否为该圈成员
    const membership = await prisma.userCircle.findUnique({
      where: {
        userId_circleId: {
          userId,
          circleId: id,
        },
      },
    });

    if (!membership) {
      res.status(400).json({
        success: false,
        message: '你不是该鱼圈成员',
      });
      return;
    }

    // 从鱼圈中移除
    await prisma.userCircle.delete({
      where: {
        userId_circleId: {
          userId,
          circleId: id,
        },
      },
    });

    // 更新鱼圈成员数
    const newMemberCount = circle.memberCount - 1;

    if (newMemberCount <= 0) {
      // 成员为0，删除鱼圈
      await prisma.circle.delete({
        where: { id },
      });
    } else {
      await prisma.circle.update({
        where: { id },
        data: { memberCount: newMemberCount },
      });
    }

    res.json({
      success: true,
      message: '已成功退出鱼圈',
    });
  } catch (error) {
    console.error('退出鱼圈失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// DELETE /api/circles/:id/members/:userId — 踢出成员
circlesRouter.delete('/:id/members/:userId', authMiddleware, async (req, res) => {
  try {
    const operatorId = req.userId!;
    const { id, userId } = req.params;

    // 查询鱼圈
    const circle = await prisma.circle.findUnique({
      where: { id },
    });

    if (!circle) {
      res.status(404).json({
        success: false,
        message: '鱼圈不存在',
      });
      return;
    }

    // 检查操作者是否为群主
    if (circle.ownerId !== operatorId) {
      res.status(403).json({
        success: false,
        message: '只有群主可以踢出成员',
      });
      return;
    }

    // 检查不能踢出自己
    if (userId === operatorId) {
      res.status(400).json({
        success: false,
        message: '群主不能踢出自己',
      });
      return;
    }

    // 检查目标用户是否为成员
    const membership = await prisma.userCircle.findUnique({
      where: {
        userId_circleId: {
          userId,
          circleId: id,
        },
      },
    });

    if (!membership) {
      res.status(400).json({
        success: false,
        message: '该用户不是鱼圈成员',
      });
      return;
    }

    // 从鱼圈中移除
    await prisma.userCircle.delete({
      where: {
        userId_circleId: {
          userId,
          circleId: id,
        },
      },
    });

    // 更新鱼圈成员数
    await prisma.circle.update({
      where: { id: circle.id },
      data: { memberCount: { decrement: 1 } },
    });

    res.json({
      success: true,
      message: '已成功请离战友！',
    });
  } catch (error) {
    console.error('踢出成员失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// GET /api/circles/:id — 获取鱼圈详情
circlesRouter.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // 查询鱼圈
    const circle = await prisma.circle.findUnique({
      where: { id },
    });

    if (!circle) {
      res.status(404).json({
        success: false,
        message: '鱼圈不存在',
      });
      return;
    }

    // 查询成员列表
    const userCircles = await prisma.userCircle.findMany({
      where: { circleId: id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    const membersWithFlags = userCircles.map((uc) => ({
      ...uc.user,
      isOwner: uc.user.id === circle.ownerId,
      isMe: uc.user.id === userId,
    }));

    res.json({
      success: true,
      data: {
        circle: {
          id: circle.id,
          name: circle.name,
          icon: circle.icon,
          ownerId: circle.ownerId,
          isActive: circle.isActive,
          memberCount: circle.memberCount,
          petFishName: circle.petFishName,
          petFishLevel: circle.petFishLevel,
          petFishGrowth: circle.petFishGrowth,
          petFishType: circle.petFishType,
          coinBalance: circle.coinBalance,
        },
        members: membersWithFlags,
      },
    });
  } catch (error) {
    console.error('获取鱼圈详情失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});
