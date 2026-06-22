import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from './jwt.js';

describe('JWT 工具函数', () => {
  describe('signToken', () => {
    it('应该返回非空字符串', () => {
      const token = signToken('user-123');
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('不同用户应生成不同 token', () => {
      const token1 = signToken('user-1');
      const token2 = signToken('user-2');
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('应该正确验证有效 token', () => {
      const token = signToken('user-123');
      const payload = verifyToken(token);
      expect(payload.userId).toBe('user-123');
    });

    it('无效 token 应抛出错误', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('空 token 应抛出错误', () => {
      expect(() => verifyToken('')).toThrow();
    });

    it('被篡改的 token 应抛出错误', () => {
      const token = signToken('user-123');
      const tampered = token.slice(0, -5) + 'XXXXX';
      expect(() => verifyToken(tampered)).toThrow();
    });
  });
});
