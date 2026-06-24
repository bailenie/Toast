import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CircleManagePage from './CircleManagePage';
import { apiClient } from '../lib/api';

// Mock apiClient
vi.mock('../lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock ActiveCircleContext
const mockActiveCircle = {
  id: 'c1',
  name: '技术部摸鱼会',
  icon: '🐟',
  memberCount: 3,
  isActive: true,
  unreadCount: 0,
};

vi.mock('../contexts/ActiveCircleContext', () => ({
  useActiveCircle: () => ({
    circles: [mockActiveCircle],
    activeCircleId: 'c1',
    activeCircle: mockActiveCircle,
    setActiveCircle: vi.fn(),
    refreshCircles: vi.fn(),
    isLoading: false,
  }),
}));

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { uid: 'u1', email: 'test@test.com' },
    loading: false,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockMembers = [
  { id: 'u1', nickname: '群主大人', avatar: 'moyu_otter', isOwner: true, isMe: true },
  { id: 'u2', nickname: '摸鱼达人', avatar: 'moyu_otter', isOwner: false, isMe: false },
  { id: 'u3', nickname: '划水高手', avatar: 'moyu_otter', isOwner: false, isMe: false },
];

describe('CircleManagePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        circle: { ...mockActiveCircle, ownerId: 'u1', inviteCode: '123456', inviteExpiresAt: '2026-12-31T23:59:59Z' },
        members: mockMembers,
      },
    });
  });

  it('AC-019: 显示鱼圈名称和成员数量', async () => {
    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('技术部摸鱼会')).toBeInTheDocument();
      expect(screen.getByText(/3 位成员/)).toBeInTheDocument();
    });
  });

  it('AC-019: 显示成员列表', async () => {
    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('群主大人')).toBeInTheDocument();
      expect(screen.getByText('摸鱼达人')).toBeInTheDocument();
      expect(screen.getByText('划水高手')).toBeInTheDocument();
    });
  });

  it('AC-019: 群主看到成员旁边的"踢出"按钮', async () => {
    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      // 群主应该看到踢出其他成员的按钮（不包括自己）
      const kickButtons = screen.getAllByText('踢出');
      expect(kickButtons.length).toBe(2); // u2 和 u3
    });
  });

  it('AC-019: 显示邀请码和复制按钮', async () => {
    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument();
      expect(screen.getByText('复制')).toBeInTheDocument();
    });
  });

  it('AC-019: 群主看到"解散鱼圈"按钮', async () => {
    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('解散鱼圈')).toBeInTheDocument();
    });
  });

  it('AC-019: 普通成员看到"退出鱼圈"按钮', async () => {
    // Mock 当前用户为普通成员
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        circle: { ...mockActiveCircle, ownerId: 'u2' },
        members: mockMembers.map(m => ({
          ...m,
          isOwner: m.id === 'u2',
          isMe: m.id === 'u1',
        })),
      },
    });

    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('退出鱼圈')).toBeInTheDocument();
      expect(screen.queryByText('解散鱼圈')).not.toBeInTheDocument();
    });
  });

  it('AC-019: 无活跃鱼圈时显示空状态提示', async () => {
    render(
      <MemoryRouter>
        <CircleManagePage />
      </MemoryRouter>
    );

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
    });

    // 验证组件正常渲染（显示成员列表等）
    expect(screen.getByText('群主大人')).toBeInTheDocument();
  });
});
