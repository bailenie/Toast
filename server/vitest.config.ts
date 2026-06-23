import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './src/test/global-setup.ts',
    // 测试文件串行执行，避免 SQLite 并发写入冲突
    sequence: {
      concurrent: false,
    },
    // 单个文件内的测试也串行
    pool: 'forks',
    fileParallelism: false,
  },
});
