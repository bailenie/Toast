import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';

// Mock ActiveCircleContext
const mockCircles = [
  { id: 'c1', name: '技术部', icon: '🐟', memberCount: 5, unreadCount: 0, isActive: true },
  { id: 'c2', name: '市场部', icon: '🐠', memberCount: 3, unreadCount: 2, isActive: true },
];

vi.mock('../../contexts/ActiveCircleContext', () => ({
  useActiveCircle: () => ({
    circles: mockCircles,
    isLoading: false,
    activeCircleId: 'c1',
    activeCircle: mockCircles[0],
    setActiveCircle: vi.fn(),
    refreshCircles: vi.fn(),
  }),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { uid: 'u1', email: 'test@test.com' },
    loading: false,
  }),
}));

describe('MainLayout - 窝囊费页面独立布局', () => {
  it('AC-026: 窝囊费页面不显示左侧鱼圈栏', () => {
    render(
      <MemoryRouter initialEntries={['/home/salary']}>
        <MainLayout />
      </MemoryRouter>
    );

    // 侧边栏不应该出现（检查侧边栏特有的元素）
    expect(screen.queryByText('加入/创建鱼圈')).not.toBeInTheDocument();
    expect(screen.queryByText('我的窝囊费')).not.toBeInTheDocument();
    // "技术部" 也会出现在 Navbar 中，所以不检查它
  });

  it('AC-024: 非窝囊费页面显示左侧鱼圈栏', () => {
    render(
      <MemoryRouter initialEntries={['/home/chat']}>
        <MainLayout />
      </MemoryRouter>
    );

    // 侧边栏应该出现（使用 getAllByText 因为同名元素可能有多个）
    expect(screen.getAllByText('技术部').length).toBeGreaterThan(0);
    expect(screen.getAllByText('市场部').length).toBeGreaterThan(0);
  });

  it('AC-018: 非窝囊费页面显示底部Tab栏', () => {
    render(
      <MemoryRouter initialEntries={['/home/chat']}>
        <MainLayout />
      </MemoryRouter>
    );

    // 底部Tab栏应该出现（使用更精确的匹配，因为Navbar中也有"摸鱼鱼"）
    expect(screen.getByText(/💬 蛐蛐间/)).toBeInTheDocument();
    expect(screen.getByText(/🎮 摸鱼鱼/)).toBeInTheDocument();
    expect(screen.getByText(/⚙️ 鱼圈管理/)).toBeInTheDocument();
  });

  it('AC-018: 窝囊费页面不显示底部Tab栏', () => {
    render(
      <MemoryRouter initialEntries={['/home/salary']}>
        <MainLayout />
      </MemoryRouter>
    );

    // 底部Tab栏不应该出现（检查底部Tab栏特有的emoji+文字组合）
    expect(screen.queryByText(/💬 蛐蛐间/)).not.toBeInTheDocument();
    expect(screen.queryByText(/🎮 摸鱼鱼/)).not.toBeInTheDocument();
    expect(screen.queryByText(/⚙️ 鱼圈管理/)).not.toBeInTheDocument();
  });
});
