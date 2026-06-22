import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const salaryRouter = Router();

// GET /api/salary/config — 获取用户工资配置
salaryRouter.get('/config', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        salary: true,
        workStart: true,
        workEnd: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        salary: user.salary,
        workStart: user.workStart,
        workEnd: user.workEnd,
      },
    });
  } catch (error) {
    console.error('获取工资配置失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// PUT /api/salary/config — 更新用户工资配置
salaryRouter.put('/config', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { salary, workStart, workEnd } = req.body;

    // 参数校验
    if (salary !== undefined) {
      if (typeof salary !== 'number' || salary < 0) {
        res.status(400).json({
          success: false,
          message: '工资必须为非负数字',
        });
        return;
      }
    }

    if (workStart !== undefined) {
      if (!/^\d{2}:\d{2}$/.test(workStart)) {
        res.status(400).json({
          success: false,
          message: '上班时间格式错误，请使用 HH:MM 格式',
        });
        return;
      }
    }

    if (workEnd !== undefined) {
      if (!/^\d{2}:\d{2}$/.test(workEnd)) {
        res.status(400).json({
          success: false,
          message: '下班时间格式错误，请使用 HH:MM 格式',
        });
        return;
      }
    }

    // 构建更新数据
    const updateData: Record<string, unknown> = {};
    if (salary !== undefined) updateData.salary = salary;
    if (workStart !== undefined) updateData.workStart = workStart;
    if (workEnd !== undefined) updateData.workEnd = workEnd;

    // 更新用户配置
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        salary: true,
        workStart: true,
        workEnd: true,
      },
    });

    res.json({
      success: true,
      data: {
        salary: updatedUser.salary,
        workStart: updatedUser.workStart,
        workEnd: updatedUser.workEnd,
      },
      message: '保存成功！',
    });
  } catch (error) {
    console.error('更新工资配置失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});
