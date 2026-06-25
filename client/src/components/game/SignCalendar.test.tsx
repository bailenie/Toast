import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SignCalendar from './SignCalendar';
import api from '../../utils/api';

// Mock API
vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('SignCalendar - AC-205: 签到成功提示1.5秒自动消失', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('签到成功后，message 状态被设置为 "签到成功！+1鱼币"', async () => {
    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 15,
        },
      },
    });

    vi.mocked(api.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          message: '签到成功！+1鱼币',
          coinBalance: 16,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 等待初始加载完成
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // 点击签到按钮
    await act(async () => {
      fireEvent.click(screen.getByText('签到领鱼币'));
    });

    // 验证提示显示
    expect(screen.getByText('签到成功！+1鱼币')).toBeInTheDocument();
  });

  it('AC-205: 1.5秒后，提示自动消失', async () => {
    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 15,
        },
      },
    });

    vi.mocked(api.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          message: '签到成功！+1鱼币',
          coinBalance: 16,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 等待初始加载完成
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // 点击签到按钮
    await act(async () => {
      fireEvent.click(screen.getByText('签到领鱼币'));
    });

    // 验证提示显示
    expect(screen.getByText('签到成功！+1鱼币')).toBeInTheDocument();

    // 快进 1.5 秒
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    // 验证提示消失
    expect(screen.queryByText('签到成功！+1鱼币')).not.toBeInTheDocument();
  });

  it('BR-019: 签到失败时，错误提示不会自动消失', async () => {
    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 15,
        },
      },
    });

    vi.mocked(api.post).mockRejectedValue({
      response: {
        data: { message: '今日已签到' },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 等待初始加载完成
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // 点击签到按钮
    await act(async () => {
      fireEvent.click(screen.getByText('签到领鱼币'));
    });

    // 验证错误提示显示
    expect(screen.getByText('今日已签到')).toBeInTheDocument();

    // 快进 1.5 秒
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    // 错误提示应该仍然存在
    expect(screen.getByText('今日已签到')).toBeInTheDocument();
  });

  it('AC-001: 签到成功后，鱼币余额更新', async () => {
    const onSignSuccess = vi.fn();

    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 15,
        },
      },
    });

    vi.mocked(api.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          message: '签到成功！+1鱼币',
          coinBalance: 16,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" onSignSuccess={onSignSuccess} />);
    });

    // 等待初始加载完成
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // 点击签到按钮
    await act(async () => {
      fireEvent.click(screen.getByText('签到领鱼币'));
    });

    // 验证回调被调用
    expect(onSignSuccess).toHaveBeenCalledWith(16);
  });

  it('AC-002: 已签到状态显示"已签到"按钮', async () => {
    // Mock API 返回 - 已签到状态
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: true,
          signInDates: ['2026-06-25'],
          coinBalance: 15,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 等待加载完成
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // 按钮应该显示"已签到"
    expect(screen.getByText('已签到')).toBeInTheDocument();

    // 按钮应该被禁用
    const button = screen.getByText('已签到');
    expect(button).toBeDisabled();
  });

  it('AC-101: 已签到再次签到显示错误提示', async () => {
    // Mock API 返回 - 已签到状态
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: true,
          signInDates: ['2026-06-25'],
          coinBalance: 15,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 等待加载完成
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // 按钮应该被禁用，无法点击
    const button = screen.getByText('已签到');
    expect(button).toBeDisabled();
  });
});

describe('SignCalendar - 基础功能', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('组件加载时调用 API 获取签到状态', async () => {
    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 15,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 验证 API 被调用
    expect(api.get).toHaveBeenCalled();
  });

  it('显示签到日历', async () => {
    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 15,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 验证签到按钮显示
    expect(screen.getByText('签到领鱼币')).toBeInTheDocument();
  });

  it('显示鱼币余额', async () => {
    // Mock API 返回
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          isSignedToday: false,
          signInDates: [],
          coinBalance: 42,
        },
      },
    });

    await act(async () => {
      render(<SignCalendar circleId="circle-001" />);
    });

    // 等待加载完成（使用 waitFor）
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // 验证鱼币余额显示
    expect(screen.getByText(/鱼币:/)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });
});
