import { motion } from 'motion/react';
import { useState } from 'react';

interface PetFishData {
  name: string;
  level: number;
  growth: number;
  type: string;
  requiredGrowth: number;
  leveledUp?: boolean;
}

interface PetFishProps {
  data: PetFishData | null;
  todayCount: number;
  maxCount: number;
  onClick?: () => void;
  isAnimating?: boolean;
}

// 根据等级获取鱼的emoji
function getFishEmoji(level: number): string {
  if (level >= 4) return '🎏';
  if (level >= 3) return '🐙';
  if (level >= 2) return '🐙';
  return '🐠';
}

export default function PetFish({ data, todayCount, maxCount, onClick, isAnimating }: PetFishProps) {
  const [showHand, setShowHand] = useState(false);

  if (!data) {
    return (
      <div className="bg-white border-[3px] border-ink rounded-2xl p-6">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-pulse">🐠</div>
          <p className="font-bold text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const fishEmoji = getFishEmoji(data.level);
  const growthPercent = data.requiredGrowth > 0 ? Math.round((data.growth / data.requiredGrowth) * 100) : 0;
  const isMaxed = todayCount >= maxCount;
  const isBusy = isAnimating || showHand;
  const canClick = !isMaxed && !isBusy && onClick;

  const handleClick = () => {
    if (!canClick) return;
    setShowHand(true);
    setTimeout(() => {
      setShowHand(false);
      onClick?.();
    }, 1000);
  };

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-6">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🐟</span>
        <h3 className="font-display font-black text-lg text-ink">治愈金鱼池</h3>
      </div>
      <p className="font-bold text-xs text-gray-500 mb-4">全队共享宠物鱼 · 摸鱼注入能量</p>

      {/* 鱼缸区域 */}
      <div
        className={`
          bg-gradient-to-b from-sky-50 to-sky-100 rounded-2xl p-6 mb-4 relative overflow-hidden
          ${canClick ? 'cursor-pointer hover:from-sky-100 hover:to-sky-200 transition-colors' : ''}
          ${isMaxed ? 'opacity-50' : ''}
        `}
        onClick={handleClick}
        role="button"
        tabIndex={canClick ? 0 : -1}
        aria-label="点击摸鱼"
      >
        {/* 水波纹装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-sky-300 animate-pulse" />
          <div className="absolute top-2/4 left-0 right-0 h-px bg-sky-300 animate-pulse delay-300" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-sky-300 animate-pulse delay-700" />
        </div>

        {/* 宠物鱼 */}
        <div className="text-center relative z-10">
          <motion.div
            className="text-6xl mb-2 inline-block"
            animate={isMaxed ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {fishEmoji}
          </motion.div>
          <p className="font-display font-black text-lg text-ink">{data.name}</p>
        </div>

        {/* 摸鱼手势动画 */}
        {showHand && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            initial={{ x: -60 }}
            animate={{ x: [- 60, 60, -60] }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <span className="text-5xl select-none">🤚</span>
          </motion.div>
        )}
      </div>

      {/* 品类和等级 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-accent-bg text-ink font-bold text-xs px-2 py-1 rounded-lg">
          {data.type}
        </span>
        <span className="bg-purple-100 text-purple-700 font-bold text-xs px-2 py-1 rounded-lg">
          Lv.{data.level}
        </span>
      </div>

      {/* 成长值条 */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-xs text-gray-500">成长值</span>
          <span className="font-bold text-xs text-accent">
            {data.growth} / {data.requiredGrowth}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${growthPercent}%` }}
          />
        </div>
      </div>

      {/* 今日配额 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-xs text-gray-500">今日配额</span>
          <span className={`font-bold text-xs ${isMaxed ? 'text-red-500' : 'text-accent'}`}>
            {todayCount} / {maxCount}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full transition-all ${isMaxed ? 'bg-red-400' : 'bg-accent'}`}
            style={{ width: `${Math.round((todayCount / maxCount) * 100)}%` }}
          />
        </div>
      </div>

      {/* 状态提示 */}
      {isMaxed && (
        <p className="font-bold text-xs text-red-500 text-center mt-3">
          你已触及今日防沉迷保护网！
        </p>
      )}
      {canClick && !isMaxed && (
        <p className="font-bold text-xs text-gray-400 text-center mt-3">
          点击小鱼带薪摸鱼~
        </p>
      )}
    </div>
  );
}
