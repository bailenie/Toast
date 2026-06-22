import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './password.js';

describe('密码加密工具函数', () => {
  describe('hashPassword', () => {
    it('应该返回非空字符串', async () => {
      const hashed = await hashPassword('123456');
      expect(hashed).toBeTruthy();
      expect(typeof hashed).toBe('string');
    });

    it('加密后的密码不应等于原密码', async () => {
      const hashed = await hashPassword('123456');
      expect(hashed).not.toBe('123456');
    });

    it('同一密码多次加密结果应不同（salt 不同）', async () => {
      const hash1 = await hashPassword('123456');
      const hash2 = await hashPassword('123456');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('正确密码应返回 true', async () => {
      const hashed = await hashPassword('123456');
      const result = await comparePassword('123456', hashed);
      expect(result).toBe(true);
    });

    it('错误密码应返回 false', async () => {
      const hashed = await hashPassword('123456');
      const result = await comparePassword('wrong-password', hashed);
      expect(result).toBe(false);
    });

    it('空密码应返回 false', async () => {
      const hashed = await hashPassword('123456');
      const result = await comparePassword('', hashed);
      expect(result).toBe(false);
    });
  });
});
