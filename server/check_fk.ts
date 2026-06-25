import prisma from './src/utils/prisma.js';

async function checkForeignKeys() {
  try {
    // 检查外键约束是否启用
    const result = await prisma.$queryRaw`PRAGMA foreign_keys`;
    console.log('外键约束状态:', result);

    // 检查 UnoCard 表的外键约束
    const fkResult = await prisma.$queryRaw`PRAGMA foreign_key_list(UnoCard)`;
    console.log('UnoCard 表的外键约束:', fkResult);
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkForeignKeys();
