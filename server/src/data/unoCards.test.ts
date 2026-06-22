import { describe, it, expect } from 'vitest';
import {
  UNO_CARDS,
  getCardById,
  drawCard,
  DAILY_MOYU_LIMIT,
  GROWTH_THRESHOLDS,
  FISH_TYPE_MAP,
} from './unoCards.js';

describe('UNO卡片数据定义', () => {
  it('UNO_CARDS 数组长度为54', () => {
    expect(UNO_CARDS).toHaveLength(54);
  });

  it('每张卡片包含必要字段', () => {
    for (const card of UNO_CARDS) {
      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.color).toBeDefined();
      expect(card.value).toBeDefined();
      expect(card.rarity).toBeDefined();
      expect(card.bonusText).toBeDefined();
    }
  });

  it('红色卡片13张', () => {
    const redCards = UNO_CARDS.filter((c) => c.color === 'Red');
    expect(redCards).toHaveLength(13);
  });

  it('蓝色卡片13张', () => {
    const blueCards = UNO_CARDS.filter((c) => c.color === 'Blue');
    expect(blueCards).toHaveLength(13);
  });

  it('绿色卡片13张', () => {
    const greenCards = UNO_CARDS.filter((c) => c.color === 'Green');
    expect(greenCards).toHaveLength(13);
  });

  it('黄色卡片13张', () => {
    const yellowCards = UNO_CARDS.filter((c) => c.color === 'Yellow');
    expect(yellowCards).toHaveLength(13);
  });

  it('万能卡片2张', () => {
    const wildCards = UNO_CARDS.filter((c) => c.color === 'Wild');
    expect(wildCards).toHaveLength(2);
  });
});

describe('getCardById', () => {
  it('返回正确的卡片', () => {
    const card = getCardById('R_0');
    expect(card?.name).toBe('红色 0');
    expect(card?.color).toBe('Red');
  });

  it('不存在的ID返回undefined', () => {
    const card = getCardById('X_999');
    expect(card).toBeUndefined();
  });
});

describe('V1.1.0 常量定义', () => {
  it('DAILY_MOYU_LIMIT 为 30', () => {
    expect(DAILY_MOYU_LIMIT).toBe(30);
  });

  it('GROWTH_THRESHOLDS 正确定义', () => {
    expect(GROWTH_THRESHOLDS).toEqual([10, 20, 30]);
  });

  it('FISH_TYPE_MAP 包含4个等级', () => {
    expect(FISH_TYPE_MAP[1]).toEqual({ name: '肥嘟嘟胖金鱼', emoji: '🐠' });
    expect(FISH_TYPE_MAP[2]).toEqual({ name: '带薪发愣神游鳌', emoji: '🐙' });
    expect(FISH_TYPE_MAP[3]).toEqual({ name: '太极双休太公鱼', emoji: '🐙' });
    expect(FISH_TYPE_MAP[4]).toEqual({ name: '极品七彩锦鲤皇', emoji: '🎏' });
  });
});

describe('drawCard 抽卡概率算法', () => {
  it('返回 null 或 {card, isNew} 结构', async () => {
    const result = await drawCard(new Set());
    if (result !== null) {
      expect(result.card).toBeDefined();
      expect(result.isNew).toBeDefined();
      expect(typeof result.isNew).toBe('boolean');
    }
  });

  it('返回的卡片来自 UNO_CARDS 池', async () => {
    // 多次抽卡，验证返回的卡片都在池中
    for (let i = 0; i < 50; i++) {
      const result = await drawCard(new Set());
      if (result !== null) {
        const found = UNO_CARDS.find((c) => c.id === result.card.id);
        expect(found).toBeDefined();
      }
    }
  });

  it('不掉卡概率约为30%', async () => {
    let nullCount = 0;
    const total = 1000;
    for (let i = 0; i < total; i++) {
      const result = await drawCard(new Set());
      if (result === null) nullCount++;
    }
    // 30% ± 10%
    expect(nullCount).toBeGreaterThan(200);
    expect(nullCount).toBeLessThan(400);
  });

  it('重复卡返回的卡片确实在已收集列表中', async () => {
    const ownedIds = new Set(['R_0', 'B_0', 'G_0']);
    // 多次抽卡，验证重复卡确实在已收集列表中
    for (let i = 0; i < 100; i++) {
      const result = await drawCard(ownedIds);
      if (result !== null && !result.isNew) {
        expect(ownedIds.has(result.card.id)).toBe(true);
      }
    }
  });

  it('新卡返回的卡片确实在未收集列表中', async () => {
    const ownedIds = new Set(['R_0', 'B_0', 'G_0']);
    for (let i = 0; i < 100; i++) {
      const result = await drawCard(ownedIds);
      if (result !== null && result.isNew) {
        expect(ownedIds.has(result.card.id)).toBe(false);
      }
    }
  });

  it('所有N卡收集完时，N卡概率合并到重复卡', async () => {
    // 收集所有N卡
    const nCards = UNO_CARDS.filter((c) => c.rarity === 'N');
    const ownedIds = new Set(nCards.map((c) => c.id));
    // 不应该返回新的N卡
    for (let i = 0; i < 200; i++) {
      const result = await drawCard(ownedIds);
      if (result !== null && result.card.rarity === 'N') {
        expect(result.isNew).toBe(false);
      }
    }
  });
});
