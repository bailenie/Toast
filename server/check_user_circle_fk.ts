import prisma from './src/utils/prisma.js';

async function checkUserCircleForeignKeys() {
  try {
    console.log('UserCircle 表的外键约束:');
    const fkResult = await prisma.$queryRawUnsafe(`PRAGMA foreign_key_list(UserCircle)`);
    console.log(fkResult);
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserCircleForeignKeys();
