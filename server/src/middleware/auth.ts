import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: '认证失败，请重新登录' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: '认证失败，请重新登录' });
  }
}
