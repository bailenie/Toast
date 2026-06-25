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

describe('V1.3.0 常量定义', () => {
  it('DAILY_MOYU_LIMIT 为 30', () => {
    expect(DAILY_MOYU_LIMIT).toBe(30);
  });

  it('GROWTH_THRESHOLDS 正确定义（4档升级阈值）', () => {
    expect(GROWTH_THRESHOLDS).toEqual([1000, 2000, 3000, 4000]);
  });

  it('FISH_TYPE_MAP 包含5个等级', () => {
    expect(FISH_TYPE_MAP[1]).toEqual({ name: '肥嘟嘟胖金鱼', emoji: '🐠' });
    expect(FISH_TYPE_MAP[2]).toEqual({ name: '带薪发愣神游鳌', emoji: '🐙' });
    expect(FISH_TYPE_MAP[3]).toEqual({ name: '太极双休太公鱼', emoji: '🐙' });
    expect(FISH_TYPE_MAP[4]).toEqual({ name: '极品七彩锦鲤皇', emoji: '🎏' });
    expect(FISH_TYPE_MAP[5]).toEqual({ name: '传说级摸鱼之神', emoji: '🐉' });
  });
});

describe('drawCard V1.3.0 抽卡概率算法', () => {
  it('返回 null 或 {card, isNew} 结构', async () => {
    const result = await drawCard(new Set(), 0);
    if (result !== null) {
      expect(result.card).toBeDefined();
      expect(result.isNew).toBeDefined();
      expect(typeof result.isNew).toBe('boolean');
    }
  });

  it('返回的卡片来自 UNO_CARDS 池', async () => {
    for (let i = 0; i < 50; i++) {
      const result = await drawCard(new Set(), 0);
      if (result !== null) {
        const found = UNO_CARDS.find((c) => c.id === result.card.id);
        expect(found).toBeDefined();
      }
    }
  });

  it('不掉卡概率约为60%', async () => {
    let nullCount = 0;
    const total = 2000;
    for (let i = 0; i < total; i++) {
      const result = await drawCard(new Set(), 0);
      if (result === null) nullCount++;
    }
    // 60% ± 8%
    expect(nullCount).toBeGreaterThan(1040);
    expect(nullCount).toBeLessThan(1360);
  });

  it('重复卡返回的卡片确实在已收集列表中', async () => {
    const ownedIds = new Set(['R_0', 'B_0', 'G_0']);
    for (let i = 0; i < 200; i++) {
      const result = await drawCard(ownedIds, 0);
      if (result !== null && !result.isNew) {
        expect(ownedIds.has(result.card.id)).toBe(true);
      }
    }
  });

  it('新卡返回的卡片确实在未收集列表中', async () => {
    const ownedIds = new Set(['R_0', 'B_0', 'G_0']);
    for (let i = 0; i < 200; i++) {
      const result = await drawCard(ownedIds, 0);
      if (result !== null && result.isNew) {
        expect(ownedIds.has(result.card.id)).toBe(false);
      }
    }
  });

  it('所有N卡收集完时，N卡概率合并到重复卡', async () => {
    const nCards = UNO_CARDS.filter((c) => c.rarity === 'N');
    const ownedIds = new Set(nCards.map((c) => c.id));
    for (let i = 0; i < 200; i++) {
      const result = await drawCard(ownedIds, 0);
      if (result !== null && result.card.rarity === 'N') {
        expect(result.isNew).toBe(false);
      }
    }
  });
});

describe('drawCard V1.3.0 每日获卡上限', () => {
  it('todayCardCount >= 5 时 100% 不掉卡', async () => {
    for (let i = 0; i < 100; i++) {
      const result = await drawCard(new Set(), 5);
      expect(result).toBeNull();
    }
  });

  it('todayCardCount = 4 时仍有机会掉卡', async () => {
    let gotCard = false;
    for (let i = 0; i < 200; i++) {
      const result = await drawCard(new Set(), 4);
      if (result !== null) {
        gotCard = true;
        break;
      }
    }
    expect(gotCard).toBe(true);
  });

  it('todayCardCount = 0 时正常掉卡', async () => {
    let gotCard = false;
    for (let i = 0; i < 100; i++) {
      const result = await drawCard(new Set(), 0);
      if (result !== null) {
        gotCard = true;
        break;
      }
    }
    expect(gotCard).toBe(true);
  });
});

describe('drawCard V1.3.0 全收集兜底', () => {
  it('54张全收集后 80%不掉卡 + 20%重复', async () => {
    const allIds = new Set(UNO_CARDS.map((c) => c.id));
    let nullCount = 0;
    let dupCount = 0;
    const total = 1000;

    for (let i = 0; i < total; i++) {
      const result = await drawCard(allIds, 0);
      if (result === null) {
        nullCount++;
      } else {
        expect(result.isNew).toBe(false);
        expect(allIds.has(result.card.id)).toBe(true);
        dupCount++;
      }
    }

    // 80% ± 10% 不掉卡
    expect(nullCount).toBeGreaterThan(700);
    expect(nullCount).toBeLessThan(900);
    // 有重复卡掉落
    expect(dupCount).toBeGreaterThan(100);
  });

  it('全收集时不会返回新卡', async () => {
    const allIds = new Set(UNO_CARDS.map((c) => c.id));
    for (let i = 0; i < 200; i++) {
      const result = await drawCard(allIds, 0);
      if (result !== null) {
        expect(result.isNew).toBe(false);
      }
    }
  });
});
