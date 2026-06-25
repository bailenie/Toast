import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/home/chat' }),
  };
});

describe('BottomTabBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('AC-018: 底部Tab栏显示3个Tab：蛐蛐间、摸鱼鱼、鱼圈管理', () => {
    render(
      <MemoryRouter initialEntries={['/home/chat']}>
        <BottomTabBar />
      </MemoryRouter>
    );

    expect(screen.getByText(/蛐蛐间/)).toBeInTheDocument();
    expect(screen.getByText(/摸鱼鱼/)).toBeInTheDocument();
    expect(screen.getByText(/鱼圈管理/)).toBeInTheDocument();
  });

  it('AC-018: 点击"鱼圈管理"Tab跳转到 /home/circle-manage', () => {
    render(
      <MemoryRouter initialEntries={['/home/chat']}>
        <BottomTabBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/鱼圈管理/));
    expect(mockNavigate).toHaveBeenCalledWith('/home/circle-manage');
  });

  it('AC-018: 点击"蛐蛐间"Tab跳转到 /home/chat', () => {
    render(
      <MemoryRouter initialEntries={['/home/game']}>
        <BottomTabBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/蛐蛐间/));
    expect(mockNavigate).toHaveBeenCalledWith('/home/chat');
  });

  it('AC-018: 点击"摸鱼鱼"Tab跳转到 /home/game', () => {
    render(
      <MemoryRouter initialEntries={['/home/chat']}>
        <BottomTabBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/摸鱼鱼/));
    expect(mockNavigate).toHaveBeenCalledWith('/home/game');
  });
});
