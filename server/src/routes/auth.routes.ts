import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/auth.js';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, nickname, avatar } = req.body;

    // 输入验证
    if (!nickname || nickname.trim() === '') {
      res.status(400).json({
        success: false,
        message: '注册需要填写一个萌新新昵称哦~',
      });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        message: '认证失败：密码过短或网络超时',
      });
      return;
    }

    // 检查邮箱唯一性
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: '该邮箱已在职场划水中！请尝试直接登录。',
      });
      return;
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        avatar: avatar || 'moyu_otter',
      },
    });

    const updatedUser = user;

    // 签发 JWT
    const token = signToken(user.id);

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword },
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查询用户
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({
        success: false,
        message: '找不到该雇员信息，请确认邮箱或切换为注册页面！',
      });
      return;
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: '密码输入有误，请核实后再敲门！',
      });
      return;
    }

    // 检查封禁状态
    if (user.isBanned) {
      res.status(403).json({
        success: false,
        message: '你已被管理员关进【冷冻鱼缸】！',
        isBanned: true,
      });
      return;
    }

    // 签发 JWT
    const token = signToken(user.id);

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// GET /api/auth/me
authRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
      return;
    }

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// PUT /api/auth/profile — 编辑个人资料
authRouter.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { nickname, avatar, bio } = req.body;

    // 输入验证
    if (!nickname || nickname.trim() === '') {
      res.status(400).json({
        success: false,
        message: '昵称不能为空，给职场花名留个位置~',
      });
      return;
    }

    if (nickname.length > 40) {
      res.status(400).json({
        success: false,
        message: '昵称不能超过40个字符',
      });
      return;
    }

    if (bio && bio.length > 200) {
      res.status(400).json({
        success: false,
        message: '个人简介不能超过200个字符',
      });
      return;
    }

    // 更新用户资料
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname: nickname.trim(),
        avatar: avatar || 'moyu_otter',
        bio: bio || '',
      },
    });

    // 返回更新后的用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: { user: userWithoutPassword },
      message: '保存成功！',
    });
  } catch (error) {
    console.error('更新个人资料失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

// PUT /api/auth/password — 修改密码
authRouter.put('/password', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { oldPassword, newPassword } = req.body;

    // 输入验证
    if (!oldPassword) {
      res.status(400).json({
        success: false,
        message: '请输入原密码',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: '新密码不少于6位',
      });
      return;
    }

    // 查询用户
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
      return;
    }

    // 验证旧密码
    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      res.status(400).json({
        success: false,
        message: '原密码输入有误，请核实后再试！',
      });
      return;
    }

    // 加密新密码并更新
    const hashedNewPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({
      success: true,
      message: '密码修改成功！',
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});
