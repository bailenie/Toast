import prisma from './prisma.js';

/**
 * 生成唯一的6位数字邀请码
 * 范围：100000-999999
 */
export async function generateUniqueCode(): Promise<string> {
  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    // 生成6位随机数字
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // 检查是否已存在（在 Invite 表中）
    const existing = await prisma.invite.findUnique({
      where: { code },
    });

    if (!existing) {
      return code;
    }

    attempts++;
  }

  throw new Error('无法生成唯一邀请码，请稍后重试');
}
