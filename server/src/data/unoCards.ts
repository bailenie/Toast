export interface UnoCardInfo {
  id: string;
  name: string;
  color: 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Wild';
  value: string;
  rarity: 'N' | 'R' | 'SR';
  bonusText: string;
}

// 54种 UNO 卡片定义
export const UNO_CARDS: UnoCardInfo[] = [
  // ==================== 红色卡片 (13张) ====================
  { id: 'R_0', name: '红色 0', color: 'Red', value: '0', rarity: 'N', bonusText: '红运当头，一切归零！' },
  { id: 'R_1', name: '红色 1', color: 'Red', value: '1', rarity: 'N', bonusText: '一心一意摸鱼去~' },
  { id: 'R_2', name: '红色 2', color: 'Red', value: '2', rarity: 'N', bonusText: '两个人一起摸鱼更快落！' },
  { id: 'R_3', name: '红色 3', color: 'Red', value: '3', rarity: 'N', bonusText: '三生有幸，今日抽到红3！' },
  { id: 'R_4', name: '红色 4', color: 'Red', value: '4', rarity: 'N', bonusText: '事事如意，红红火火~' },
  { id: 'R_5', name: '红色 5', color: 'Red', value: '5', rarity: 'N', bonusText: '五福临门，摸鱼得福！' },
  { id: 'R_6', name: '红色 6', color: 'Red', value: '6', rarity: 'N', bonusText: '六六大顺，工资翻倍！' },
  { id: 'R_7', name: '红色 7', color: 'Red', value: '7', rarity: 'N', bonusText: '七星高照，带薪摸鱼~' },
  { id: 'R_8', name: '红色 8', color: 'Red', value: '8', rarity: 'N', bonusText: '八方来财，摸鱼生财！' },
  { id: 'R_9', name: '红色 9', color: 'Red', value: '9', rarity: 'N', bonusText: '九九归一，摸鱼不止~' },
  { id: 'R_Skip', name: '红色 跳过', color: 'Red', value: '🚫', rarity: 'R', bonusText: '跳过加班，准时下班！' },
  { id: 'R_Reverse', name: '红色 反转', color: 'Red', value: '⇄', rarity: 'R', bonusText: '反转人生，老板给你打工！' },
  { id: 'R_Draw2', name: '红色 +2', color: 'Red', value: '+2', rarity: 'R', bonusText: '再摸两张，双倍快乐！' },

  // ==================== 蓝色卡片 (13张) ====================
  { id: 'B_0', name: '蓝色 0', color: 'Blue', value: '0', rarity: 'N', bonusText: '蓝瘦香菇，但还是要摸鱼~' },
  { id: 'B_1', name: '蓝色 1', color: 'Blue', value: '1', rarity: 'N', bonusText: '一望无际的蓝，摸鱼无极限！' },
  { id: 'B_2', name: '蓝色 2', color: 'Blue', value: '2', rarity: 'N', bonusText: '蓝色心情，摸鱼治愈~' },
  { id: 'B_3', name: '蓝色 3', color: 'Blue', value: '3', rarity: 'N', bonusText: '三蓝合一，摸鱼之力！' },
  { id: 'B_4', name: '蓝色 4', color: 'Blue', value: '4', rarity: 'N', bonusText: '四海为家，摸鱼为业~' },
  { id: 'B_5', name: '蓝色 5', color: 'Blue', value: '5', rarity: 'N', bonusText: '五月的蓝，摸鱼的甜~' },
  { id: 'B_6', name: '蓝色 6', color: 'Blue', value: '6', rarity: 'N', bonusText: '蓝色星期六，摸鱼日！' },
  { id: 'B_7', name: '蓝色 7', color: 'Blue', value: '7', rarity: 'N', bonusText: '七蓝八摸，人生赢家~' },
  { id: 'B_8', name: '蓝色 8', color: 'Blue', value: '8', rarity: 'N', bonusText: '蓝8在手，天下我有！' },
  { id: 'B_9', name: '蓝色 9', color: 'Blue', value: '9', rarity: 'N', bonusText: '九蓝归海，摸鱼不败~' },
  { id: 'B_Skip', name: '蓝色 跳过', color: 'Blue', value: '🚫', rarity: 'R', bonusText: '跳过KPI，直接躺平！' },
  { id: 'B_Reverse', name: '蓝色 反转', color: 'Blue', value: '⇄', rarity: 'R', bonusText: '反转乾坤，摸鱼为王！' },
  { id: 'B_Draw2', name: '蓝色 +2', color: 'Blue', value: '+2', rarity: 'R', bonusText: '蓝色加成，双倍摸鱼！' },

  // ==================== 绿色卡片 (13张) ====================
  { id: 'G_0', name: '绿色 0', color: 'Green', value: '0', rarity: 'N', bonusText: '绿色心情，摸鱼开始~' },
  { id: 'G_1', name: '绿色 1', color: 'Green', value: '1', rarity: 'N', bonusText: '一抹绿意，摸鱼惬意~' },
  { id: 'G_2', name: '绿色 2', color: 'Green', value: '2', rarity: 'N', bonusText: '绿色双人组，摸鱼搭档！' },
  { id: 'G_3', name: '绿色 3', color: 'Green', value: '3', rarity: 'N', bonusText: '三绿成荫，摸鱼乘凉~' },
  { id: 'G_4', name: '绿色 4', color: 'Green', value: '4', rarity: 'N', bonusText: '四季常青，摸鱼常在~' },
  { id: 'G_5', name: '绿色 5', color: 'Green', value: '5', rarity: 'N', bonusText: '五谷丰登，摸鱼丰收！' },
  { id: 'G_6', name: '绿色 6', color: 'Green', value: '6', rarity: 'N', bonusText: '绿6出击，摸鱼无敌！' },
  { id: 'G_7', name: '绿色 7', color: 'Green', value: '7', rarity: 'N', bonusText: '七绿八摸，快乐工作~' },
  { id: 'G_8', name: '绿色 8', color: 'Green', value: '8', rarity: 'N', bonusText: '绿8护身，摸鱼无忧~' },
  { id: 'G_9', name: '绿色 9', color: 'Green', value: '9', rarity: 'N', bonusText: '九绿归真，摸鱼大成！' },
  { id: 'G_Skip', name: '绿色 跳过', color: 'Green', value: '🚫', rarity: 'R', bonusText: '跳过会议，摸鱼去也！' },
  { id: 'G_Reverse', name: '绿色 反转', color: 'Green', value: '⇄', rarity: 'R', bonusText: '反转命运，摸鱼改命！' },
  { id: 'G_Draw2', name: '绿色 +2', color: 'Green', value: '+2', rarity: 'R', bonusText: '绿色加成，再来两张！' },

  // ==================== 黄色卡片 (13张) ====================
  { id: 'Y_0', name: '黄色 0', color: 'Yellow', value: '0', rarity: 'N', bonusText: '黄金万两，摸鱼无价~' },
  { id: 'Y_1', name: '黄色 1', color: 'Yellow', value: '1', rarity: 'N', bonusText: '一金在手，摸鱼不愁~' },
  { id: 'Y_2', name: '黄色 2', color: 'Yellow', value: '2', rarity: 'N', bonusText: '双黄临门，摸鱼大吉！' },
  { id: 'Y_3', name: '黄色 3', color: 'Yellow', value: '3', rarity: 'N', bonusText: '三黄开泰，摸鱼兴旺~' },
  { id: 'Y_4', name: '黄色 4', color: 'Yellow', value: '4', rarity: 'N', bonusText: '四黄齐出，摸鱼无敌！' },
  { id: 'Y_5', name: '黄色 5', color: 'Yellow', value: '5', rarity: 'N', bonusText: '五金齐全，摸鱼装备满！' },
  { id: 'Y_6', name: '黄色 6', color: 'Yellow', value: '6', rarity: 'N', bonusText: '六黄高照，摸鱼顺遂~' },
  { id: 'Y_7', name: '黄色 7', color: 'Yellow', value: '7', rarity: 'N', bonusText: '七黄八摸，人生巅峰~' },
  { id: 'Y_8', name: '黄色 8', color: 'Yellow', value: '8', rarity: 'N', bonusText: '八黄发财，摸鱼致富！' },
  { id: 'Y_9', name: '黄色 9', color: 'Yellow', value: '9', rarity: 'N', bonusText: '九黄至尊，摸鱼王者！' },
  { id: 'Y_Skip', name: '黄色 跳过', color: 'Yellow', value: '🚫', rarity: 'R', bonusText: '跳过打卡，直接摸鱼！' },
  { id: 'Y_Reverse', name: '黄色 反转', color: 'Yellow', value: '⇄', rarity: 'R', bonusText: '反转工资，越摸越多！' },
  { id: 'Y_Draw2', name: '黄色 +2', color: 'Yellow', value: '+2', rarity: 'R', bonusText: '黄金加成，双倍收益！' },

  // ==================== 万能卡片 (2张) ====================
  { id: 'W_Wild', name: '万能 变色', color: 'Wild', value: '🌈', rarity: 'SR', bonusText: '万能摸鱼卡！随心所欲，想变就变！' },
  { id: 'W_Wild4', name: '万能 +4', color: 'Wild', value: '+4', rarity: 'SR', bonusText: '终极摸鱼神器！+4 张牌，满载而归！' },
];

// 卡片颜色映射（用于UI显示）
export const CARD_COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  Red: { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-700' },
  Blue: { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-700' },
  Green: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-700' },
  Yellow: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700' },
  Wild: { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-700' },
};

// 稀有度标签颜色
export const RARITY_MAP: Record<string, { label: string; bg: string; text: string }> = {
  N: { label: 'N', bg: 'bg-gray-200', text: 'text-gray-700' },
  R: { label: 'R', bg: 'bg-blue-200', text: 'text-blue-700' },
  SR: { label: 'SR', bg: 'bg-purple-200', text: 'text-purple-700' },
};

/**
 * 根据卡片ID获取卡片信息
 */
export function getCardById(cardId: string): UnoCardInfo | undefined {
  return UNO_CARDS.find((card) => card.id === cardId);
}

// ==================== V1.1.0 新增常量 ====================

/** 每日摸鱼上限（固定30次） */
export const DAILY_MOYU_LIMIT = 30;

/** 宠物鱼升级所需成长值（索引0=等级1→2，索引1=等级2→3，索引2=等级3→4，索引3=等级4→5） */
export const GROWTH_THRESHOLDS = [1000, 2000, 3000, 4000];

/** 宠物鱼等级→品类映射 */
export const FISH_TYPE_MAP: Record<number, { name: string; emoji: string }> = {
  1: { name: '肥嘟嘟胖金鱼', emoji: '🐠' },
  2: { name: '带薪发愣神游鳌', emoji: '🐙' },
  3: { name: '太极双休太公鱼', emoji: '🐙' },
  4: { name: '极品七彩锦鲤皇', emoji: '🎏' },
  5: { name: '传说级摸鱼之神', emoji: '🐉' },
};

// ==================== V1.1.0 抽卡概率算法 ====================

/** 抽卡结果 */
export interface DrawResult {
  card: UnoCardInfo;
  isNew: boolean;
}

// 按稀有度分组的卡片池
const CARDS_BY_RARITY: Record<string, UnoCardInfo[]> = {
  N: UNO_CARDS.filter((c) => c.rarity === 'N'),
  R: UNO_CARDS.filter((c) => c.rarity === 'R'),
  SR: UNO_CARDS.filter((c) => c.rarity === 'SR'),
};

/**
 * 从数组中随机选一个元素
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * V1.3.0 抽卡算法：5档概率分布
 *
 * 60% 不掉卡
 * 20% 掉已有卡（重复）
 * 10% 掉不重复普通卡(N)
 *  7% 掉不重复稀有卡(R)
 *  3% 掉不重复超稀有卡(SR)
 *
 * 特殊规则：
 * - 每日获卡上限5张（todayCardCount >= 5 则 100%不掉卡）
 * - 全收集兜底：54张全收集后 80%不掉卡 + 20%重复
 * - 稀有卡(R/SR)不会重复
 */
export async function drawCard(
  ownedCardIds: Set<string>,
  todayCardCount: number = 0
): Promise<DrawResult | null> {
  // AC-109: 每日获卡上限检查
  if (todayCardCount >= 5) {
    return null; // 100%不掉卡
  }

  // 计算各稀有度未收集卡片
  const availableN = CARDS_BY_RARITY.N.filter((c) => !ownedCardIds.has(c.id));
  const availableR = CARDS_BY_RARITY.R.filter((c) => !ownedCardIds.has(c.id));
  const availableSR = CARDS_BY_RARITY.SR.filter(
    (c) => !ownedCardIds.has(c.id)
  );

  // AC-105: 全收集兜底检查
  const allCollected = availableN.length === 0 && availableR.length === 0 && availableSR.length === 0;

  // 全收集兜底：80%不掉卡，20%重复卡
  if (allCollected) {
    if (Math.random() < 0.8) {
      return null;
    }
    // 20% 掉重复卡
    if (ownedCardIds.size > 0) {
      const ownedCards = UNO_CARDS.filter((c) => ownedCardIds.has(c.id));
      const card = pickRandom(ownedCards);
      return { card, isNew: false };
    }
    return null;
  }

  // 正常概率分布
  const rand = Math.random() * 100;

  // 60% 不掉卡
  if (rand < 60) {
    return null;
  }

  // 20% 重复卡（60-80）
  if (rand < 80) {
    // 如果用户没有任何已收集卡片，从全池随机
    if (ownedCardIds.size === 0) {
      const card = pickRandom(UNO_CARDS);
      return { card, isNew: true };
    }
    // 从已收集卡中随机选一张
    const ownedCards = UNO_CARDS.filter((c) => ownedCardIds.has(c.id));
    const card = pickRandom(ownedCards);
    return { card, isNew: false };
  }

  // 10% 不重复N卡（80-90）
  if (rand < 90 && availableN.length > 0) {
    const card = pickRandom(availableN);
    return { card, isNew: true };
  }

  // 7% 不重复R卡（90-97）
  if (rand < 97 && availableR.length > 0) {
    const card = pickRandom(availableR);
    return { card, isNew: true };
  }

  // 3% 不重复SR卡（97-100）
  if (availableSR.length > 0) {
    const card = pickRandom(availableSR);
    return { card, isNew: true };
  }

  // 兜底：掉重复卡
  if (ownedCardIds.size > 0) {
    const ownedCards = UNO_CARDS.filter((c) => ownedCardIds.has(c.id));
    const card = pickRandom(ownedCards);
    return { card, isNew: false };
  }

  return null;
}
