import path from 'path';
import { execSync } from 'child_process';

/**
 * Vitest global setup — 在所有测试文件加载前执行
 * 设置 DATABASE_URL 指向测试数据库，确保测试不会污染开发数据
 */
export default function setup() {
  // 使用绝对路径确保 Prisma 正确解析测试数据库
  const testDbPath = path.resolve(process.cwd(), 'prisma/test.db');
  process.env.DATABASE_URL = `file:${testDbPath}`;

  // 同步表结构到测试数据库
  execSync('npx prisma db push --skip-generate', {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: `file:${testDbPath}` },
    stdio: 'pipe',
  });
}
