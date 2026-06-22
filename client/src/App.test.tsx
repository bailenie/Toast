import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';
import AppRoutes from './App';

// Mock the auth context
vi.mock('./contexts/AuthContext', async () => {
  const actual = await vi.importActual('./contexts/AuthContext');
  return {
    ...actual,
    useAuthContext: vi.fn(),
  };
});

// Mock the pages
vi.mock('./pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">官网</div>,
}));

vi.mock('./pages/ChatPage', () => ({
  ChatPage: () => <div data-testid="chat-page">蛐蛐间</div>,
}));

vi.mock('./pages/GamePage', () => ({
  default: () => <div data-testid="game-page">摸鱼鱼</div>,
}));

vi.mock('./pages/SalaryPage', () => ({
  SalaryPage: () => <div data-testid="salary-page">窝囊费</div>,
}));

vi.mock('./pages/CirclePage', () => ({
  default: () => <div data-testid="circle-page">鱼圈管理</div>,
}));

vi.mock('./components/auth/LoginForm', () => ({
  default: () => <div data-testid="login-form">登录表单</div>,
}));

vi.mock('./components/auth/RegisterForm', () => ({
  default: () => <div data-testid="register-form">注册表单</div>,
}));

vi.mock('./components/common/MainLayout', () => ({
  MainLayout: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}));

describe('路由跳转测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('已登录用户访问公开页面', () => {
    it('已登录用户访问 /login 应跳转到 /home', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示首页内容（蛐蛐间）
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('已登录用户访问 /register 应跳转到 /home', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示首页内容（蛐蛐间）
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('已登录用户访问 / 应跳转到 /home', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示首页内容（蛐蛐间）
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  describe('未登录用户访问受保护页面', () => {
    it('未登录用户访问 /home 应跳转到 /login', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示登录表单
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('未登录用户访问 /home/chat 应跳转到 /login', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home/chat']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示登录表单
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('未登录用户访问 /home/game 应跳转到 /login', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home/game']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示登录表单
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('未登录用户访问 /home/salary 应跳转到 /login', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home/salary']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示登录表单
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  describe('已登录用户访问受保护页面', () => {
    it('已登录用户访问 /home 应显示首页布局', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示首页布局
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('已登录用户访问 /home/chat 应显示蛐蛐间', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home/chat']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示蛐蛐间
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });

    it('已登录用户访问 /home/game 应显示摸鱼鱼', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home/game']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示摸鱼鱼
      expect(screen.getByTestId('game-page')).toBeInTheDocument();
    });

    it('已登录用户访问 /home/salary 应显示窝囊费', () => {
      (useAuthContext as any).mockReturnValue({
        user: { id: '1', email: 'test@test.com' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/home/salary']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示窝囊费
      expect(screen.getByTestId('salary-page')).toBeInTheDocument();
    });
  });

  describe('未登录用户访问公开页面', () => {
    it('未登录用户访问 / 应显示官网', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示官网
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('未登录用户访问 /login 应显示登录表单', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示登录表单
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('未登录用户访问 /register 应显示注册表单', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示注册表单
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });
  });

  describe('默认路由', () => {
    it('访问不存在的路由应重定向到官网', () => {
      (useAuthContext as any).mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/nonexistent']}>
          <AppRoutes />
        </MemoryRouter>
      );

      // 应该显示官网
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
});
