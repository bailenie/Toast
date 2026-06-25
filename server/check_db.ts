import prisma from './src/utils/prisma.js';

async function checkDatabase() {
  try {
    // 检查 UnoCard 表结构
    const result = await prisma.$queryRaw`SELECT sql FROM sqlite_master WHERE type='table' AND name='UnoCard'`;
    console.log('UnoCard 表结构:', result);

    // 检查 UnoCard 表中的数据
    const cards = await prisma.unoCard.findMany();
    console.log('UnoCard 表中的数据数量:', cards.length);
    console.log('UnoCard 表中的数据示例:', cards.slice(0, 2));
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
