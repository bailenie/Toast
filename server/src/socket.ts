import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from './utils/prisma.js';
import { messageStore, type ChatMessage } from './services/messageStore.js';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'moyu-circle-secret-key-2024';

interface JwtPayload {
  userId: string;
}

/**
 * 初始化 Socket.io 服务
 */
export function initSocket(io: Server): void {
  // JWT 认证中间件
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('未提供认证令牌'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      (socket as Socket & { userId: string }).userId = decoded.userId;
      next();
    } catch {
      return next(new Error('认证失败'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as Socket & { userId: string }).userId;
    console.log(`用户连接: ${socket.id}, userId: ${userId}`);

    // 加入鱼圈房间
    socket.on('join_circle', async (data: { circleId: string }) => {
      try {
        const { circleId } = data;

        // 验证用户是否在该鱼圈
        const membership = await prisma.userCircle.findUnique({
          where: {
            userId_circleId: {
              userId,
              circleId,
            },
          },
        });

        if (!membership) {
          socket.emit('error', { message: '你不是该鱼圈成员' });
          return;
        }

        // 离开之前的房间
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.leave(room);
          }
        }

        // 加入新房间
        socket.join(circleId);
        console.log(`用户 ${userId} 加入房间 ${circleId}`);

        // 返回历史消息
        const messages = messageStore.getByCircle(circleId);
        socket.emit('history_messages', { messages });
      } catch (error) {
        console.error('加入房间失败:', error);
        socket.emit('error', { message: '加入房间失败' });
      }
    });

    // 发送消息
    socket.on('send_message', async (data: { circleId: string; text: string }) => {
      try {
        const { circleId, text } = data;

        // 验证用户是否在该鱼圈
        const membership = await prisma.userCircle.findUnique({
          where: {
            userId_circleId: {
              userId,
              circleId,
            },
          },
        });

        if (!membership) {
          socket.emit('error', { message: '你不是该鱼圈成员' });
          return;
        }

        // 获取用户信息
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          socket.emit('error', { message: '用户不存在' });
          return;
        }

        // 验证消息长度
        if (!text || text.trim() === '') {
          socket.emit('error', { message: '消息内容不能为空' });
          return;
        }

        if (text.length > 500) {
          socket.emit('error', { message: '内容超长，碎碎念不可超过500字！' });
          return;
        }

        // 创建消息
        const message: ChatMessage = {
          id: uuidv4(),
          circleId,
          authorId: userId,
          authorName: user.nickname,
          authorAvatar: user.avatar,
          text: text.trim(),
          createdAt: Date.now(),
        };

        // 存储消息
        messageStore.add(message);

        // 广播到房间
        io.to(circleId).emit('new_message', { message });

        // 返回成功
        socket.emit('send_success', { messageId: message.id });
      } catch (error) {
        console.error('发送消息失败:', error);
        socket.emit('error', { message: '发送失败' });
      }
    });

    // 断开连接
    socket.on('disconnect', () => {
      console.log(`用户断开: ${socket.id}`);
    });
  });
}
