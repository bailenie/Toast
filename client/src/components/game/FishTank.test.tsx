import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FishTank from './FishTank';

const defaultProps = {
  petFish: {
    name: '小金鱼',
    level: 1,
    growth: 10,
    type: '肥嘟嘟胖金鱼',
    requiredGrowth: 100,
    isMaxLevel: false,
  },
  todayCount: 5,
  maxCount: 30,
  todayCardCount: 2,
  maxCardCount: 5,
  loading: false,
  error: '',
  onMoyu: vi.fn(),
  onOpenShop: vi.fn(),
  ownedDecorations: [],
};

describe('FishTank - 装饰显示', () => {
  it('AC-204: 当 ownedDecorations 为空数组时，鱼缸区域不渲染任何装饰 emoji', () => {
    render(<FishTank {...defaultProps} ownedDecorations={[]} />);
    
    // 不应该有装饰 emoji
    expect(screen.queryByText('🌿')).not.toBeInTheDocument();
    expect(screen.queryByText('🫧')).not.toBeInTheDocument();
    expect(screen.queryByText('🪨')).not.toBeInTheDocument();
    expect(screen.queryByText('⭐')).not.toBeInTheDocument();
    expect(screen.queryByText('🪸')).not.toBeInTheDocument();
  });

  it('AC-204: 当 ownedDecorations 包含 deco-001 时，鱼缸显示水草 🌿', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[{ decorationId: 'deco-001', icon: '🌿' }]}
      />
    );
    
    expect(screen.getByText('🌿')).toBeInTheDocument();
  });

  it('AC-204: 当 ownedDecorations 包含 deco-002 时，鱼缸显示气泡 🫧', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[{ decorationId: 'deco-002', icon: '🫧' }]}
      />
    );
    
    expect(screen.getByText('🫧')).toBeInTheDocument();
  });

  it('AC-204: 当 ownedDecorations 包含 deco-003 时，鱼缸显示石头 🪨', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[{ decorationId: 'deco-003', icon: '🪨' }]}
      />
    );
    
    expect(screen.getByText('🪨')).toBeInTheDocument();
  });

  it('AC-204: 当 ownedDecorations 包含 deco-004 时，鱼缸显示海星 ⭐', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[{ decorationId: 'deco-004', icon: '⭐' }]}
      />
    );
    
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('AC-204: 当 ownedDecorations 包含 deco-005 时，鱼缸显示珊瑚 🪸', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[{ decorationId: 'deco-005', icon: '🪸' }]}
      />
    );
    
    expect(screen.getByText('🪸')).toBeInTheDocument();
  });

  it('AC-204: 当拥有多个装饰时，所有装饰都显示', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[
          { decorationId: 'deco-001', icon: '🌿' },
          { decorationId: 'deco-003', icon: '🪨' },
          { decorationId: 'deco-005', icon: '🪸' },
        ]}
      />
    );
    
    expect(screen.getByText('🌿')).toBeInTheDocument();
    expect(screen.getByText('🪨')).toBeInTheDocument();
    expect(screen.getByText('🪸')).toBeInTheDocument();
    // 未购买的不显示
    expect(screen.queryByText('🫧')).not.toBeInTheDocument();
    expect(screen.queryByText('⭐')).not.toBeInTheDocument();
  });

  it('BR-015: 装饰使用绝对定位，不影响宠物鱼显示', () => {
    render(
      <FishTank
        {...defaultProps}
        ownedDecorations={[{ decorationId: 'deco-001', icon: '🌿' }]}
      />
    );
    
    // 宠物鱼应该正常显示
    expect(screen.getByText('🐠')).toBeInTheDocument();
    // 装饰也应该显示
    expect(screen.getByText('🌿')).toBeInTheDocument();
  });
});

describe('FishTank - 基础功能', () => {
  it('点击鱼缸触发 onMoyu 回调', () => {
    const onMoyu = vi.fn();
    render(<FishTank {...defaultProps} onMoyu={onMoyu} />);
    
    // 点击鱼缸区域
    const fishTankArea = screen.getByText('点击鱼鱼摸一下').closest('div');
    if (fishTankArea) {
      fireEvent.click(fishTankArea);
    }
    
    expect(onMoyu).toHaveBeenCalled();
  });

  it('点击"装扮商城"触发 onOpenShop 回调', () => {
    const onOpenShop = vi.fn();
    render(<FishTank {...defaultProps} onOpenShop={onOpenShop} />);
    
    fireEvent.click(screen.getByText(/装扮商城/));
    
    expect(onOpenShop).toHaveBeenCalled();
  });

  it('loading 状态显示"摸鱼中..."', () => {
    render(<FishTank {...defaultProps} loading={true} />);
    
    expect(screen.getByText('摸鱼中...')).toBeInTheDocument();
  });

  it('达到今日上限显示防沉迷提示', () => {
    render(<FishTank {...defaultProps} todayCount={30} maxCount={30} />);
    
    expect(screen.getByText('你已触及今日防沉迷保护网！')).toBeInTheDocument();
  });
});
