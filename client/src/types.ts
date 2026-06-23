// 用户
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  salary: number;
  workStart: string;
  workEnd: string;
  isBanned: boolean;
  joinedCircleId: string | null;
  privateCircleId: string | null;
  createdAt: string;
}

// 鱼圈
export interface Circle {
  id: string;
  name: string;
  code: string | null;
  isPrivate: boolean;
  memberCount: number;
}

// API 通用响应
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// 认证响应
export interface AuthData {
  token: string;
  user: User;
}

// /me 响应
export interface MeData {
  user: User;
  circle: Circle | null;
}
