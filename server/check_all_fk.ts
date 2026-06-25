import prisma from './src/utils/prisma.js';

async function checkAllForeignKeys() {
  try {
    const tables = ['UnoCard', 'MoyuStat', 'SignRecord', 'CircleDecoration', 'ExchangeRecord'];

    for (const table of tables) {
      console.log(`\n${table} 表的外键约束:`);
      const fkResult = await prisma.$queryRawUnsafe(`PRAGMA foreign_key_list(${table})`);
      console.log(fkResult);
    }
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllForeignKeys();
