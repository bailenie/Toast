import prisma from '../utils/prisma.js';

// 启动邀请码清理服务
export function startInviteCleanup() {
  // 每5分钟清理一次
  const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5分钟

  console.log('🧹 邀请码清理服务已启动');

  setInterval(async () => {
    try {
      const now = new Date();

      // 1. 标记已过期的邀请码为 expired
      const expiredResult = await prisma.invite.updateMany({
        where: {
          status: 'active',
          expiresAt: {
            lt: now,
          },
        },
        data: {
          status: 'expired',
        },
      });

      if (expiredResult.count > 0) {
        console.log(`标记 ${expiredResult.count} 个邀请码为已过期`);
      }

      // 2. 删除已过期超过1小时的邀请码
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const deleteResult = await prisma.invite.deleteMany({
        where: {
          status: 'expired',
          createdAt: {
            lt: oneHourAgo,
          },
        },
      });

      if (deleteResult.count > 0) {
        console.log(`删除 ${deleteResult.count} 个过期邀请码`);
      }
    } catch (error) {
      console.error('邀请码清理失败:', error);
    }
  }, CLEANUP_INTERVAL);
}
