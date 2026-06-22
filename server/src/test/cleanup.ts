import prisma from '../utils/prisma.js';

/**
 * 清理所有测试数据（按外键依赖顺序）
 */
export async function cleanAll() {
  await prisma.exchangeRecord.deleteMany({});
  await prisma.circleDecoration.deleteMany({});
  await prisma.signRecord.deleteMany({});
  await prisma.moyuStat.deleteMany({});
  await prisma.invite.deleteMany({});
  await prisma.userCircle.deleteMany({});
  await prisma.unoCard.deleteMany({});
  await prisma.decoration.deleteMany({});
  await prisma.circle.deleteMany({});
  await prisma.user.deleteMany({});
}
