import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SidebarPending } from './SidebarPending';

// Mock apiClient
const mockGet = vi.fn();
vi.mock('../../lib/api', () => ({
  apiClient: {
    get: (...args: any[]) => mockGet(...args),
  },
}));

describe('SidebarPending — 侧边栏等待中鱼圈', () => {
  const mockOnOpenInvite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('无等待中鱼圈时不渲染任何内容', async () => {
    mockGet.mockResolvedValue({
      success: true,
      data: { pendingCircles: [] },
    });

    const { container } = render(
      <SidebarPending onOpenInvite={mockOnOpenInvite} />
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/circles/pending');
    });

    // 组件应该不渲染任何可见内容
    expect(container.innerHTML).toBe('');
  });

  it('有等待中鱼圈时显示折叠标题', async () => {
    mockGet.mockResolvedValue({
      success: true,
      data: {
        pendingCircles: [
          {
            circleId: 'c1',
            circleName: '测试鱼圈',
            circleIcon: '🐟',
            inviteCode: '123456',
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            memberCount: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    render(<SidebarPending onOpenInvite={mockOnOpenInvite} />);

    await waitFor(() => {
      expect(screen.getByText('等待加入')).toBeInTheDocument();
    });

    // 默认折叠，不显示鱼圈名称
    expect(screen.queryByText('测试鱼圈')).not.toBeInTheDocument();
  });

  it('点击展开后显示鱼圈详情', async () => {
    mockGet.mockResolvedValue({
      success: true,
      data: {
        pendingCircles: [
          {
            circleId: 'c1',
            circleName: '测试鱼圈',
            circleIcon: '🐟',
            inviteCode: '123456',
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            memberCount: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    render(<SidebarPending onOpenInvite={mockOnOpenInvite} />);

    await waitFor(() => {
      expect(screen.getByText('等待加入')).toBeInTheDocument();
    });

    // 点击展开
    fireEvent.click(screen.getByText('等待加入'));

    // 现在应该显示鱼圈名称
    expect(screen.getByText('测试鱼圈')).toBeInTheDocument();
  });

  it('展开后点击鱼圈调用 onOpenInvite', async () => {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    mockGet.mockResolvedValue({
      success: true,
      data: {
        pendingCircles: [
          {
            circleId: 'c1',
            circleName: '测试鱼圈',
            circleIcon: '🐟',
            inviteCode: '123456',
            expiresAt,
            memberCount: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    render(<SidebarPending onOpenInvite={mockOnOpenInvite} />);

    await waitFor(() => {
      expect(screen.getByText('等待加入')).toBeInTheDocument();
    });

    // 展开
    fireEvent.click(screen.getByText('等待加入'));

    // 点击鱼圈
    fireEvent.click(screen.getByText('测试鱼圈'));

    expect(mockOnOpenInvite).toHaveBeenCalledWith({
      circleId: 'c1',
      circleName: '测试鱼圈',
      inviteCode: '123456',
      expiresAt,
    });
  });

  it('显示正确的数量徽章', async () => {
    mockGet.mockResolvedValue({
      success: true,
      data: {
        pendingCircles: [
          {
            circleId: 'c1',
            circleName: '鱼圈1',
            circleIcon: '🐟',
            inviteCode: '111111',
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            memberCount: 1,
            createdAt: '2026-06-22T12:00:00.000Z',
          },
          {
            circleId: 'c2',
            circleName: '鱼圈2',
            circleIcon: '🐠',
            inviteCode: '222222',
            expiresAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
            memberCount: 1,
            createdAt: '2026-06-22T11:00:00.000Z',
          },
        ],
      },
    });

    render(<SidebarPending onOpenInvite={mockOnOpenInvite} />);

    await waitFor(() => {
      expect(screen.getByText('等待加入')).toBeInTheDocument();
    });

    // 应该显示数量 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
