import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'moyu_circle_jwt_secret_2026';
const JWT_EXPIRES_IN = '7d';

export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}
