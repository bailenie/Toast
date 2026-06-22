import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

vi.mock('../../contexts/ActiveCircleContext', () => ({
  useActiveCircle: () => ({
    circles: [],
    isLoading: false,
    activeCircleId: null,
    activeCircle: null,
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

vi.mock('../user/UserMenu', () => ({
  default: () => <div data-testid="user-menu">用户菜单</div>,
}));

describe('Navbar - 窝囊费页面返回按钮', () => {
  it('AC-012: 窝囊费页面显示返回按钮', () => {
    render(
      <MemoryRouter initialEntries={['/home/salary']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('← 返回')).toBeInTheDocument();
  });

  it('AC-012: 非窝囊费页面不显示返回按钮', () => {
    render(
      <MemoryRouter initialEntries={['/home/chat']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByText('← 返回')).not.toBeInTheDocument();
  });
});
