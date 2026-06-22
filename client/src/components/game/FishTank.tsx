import { useState, useEffect } from 'react';

interface PetFishData {
  name: string;
  level: number;
  growth: number;
  type: string;
  requiredGrowth: number;
  leveledUp?: boolean;
}

interface FishTankProps {
  petFish: PetFishData | null;
  todayCount: number;
  maxCount: number;
  loading: boolean;
  error: string;
  onMoyu: () => void;
  onOpenShop: () => void;
}

export default function FishTank({
  petFish,
  todayCount,
  maxCount,
  loading,
  error,
  onMoyu,
  onOpenShop,
}: FishTankProps) {
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (petFish?.leveledUp) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [petFish?.leveledUp, petFish?.level]);

  const progressPercent = maxCount > 0 ? Math.round((todayCount / maxCount) * 100) : 0;
  const growthPercent = petFish?.requiredGrowth
    ? Math.round((petFish.growth / petFish.requiredGrowth) * 100)
    : 0;

  const getFishEmoji = (level: number) => {
    switch (level) {
      case 1: return '🐠';
      case 2: return '🐙';
      case 3: return '🐡';
      case 4: return '🎏';
      default: return '🐠';
    }
  };

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-black text-lg text-ink">🐟 治愈金鱼池</h2>
        <button
          onClick={onOpenShop}
          className="text-xs font-bold text-primary hover:underline"
        >
          装扮商城 →
        </button>
      </div>

      {/* 鱼缸区域 */}
      <div
        className={`relative bg-blue-50 rounded-xl p-6 mb-4 text-center border-2 border-blue-200 ${
          loading || todayCount >= maxCount ? '' : 'cursor-pointer hover:bg-blue-100 transition-colors'
        }`}
        onClick={onMoyu}
      >
        {/* 宠物鱼 */}
        <div className="text-7xl mb-3 select-none">
          {petFish ? getFishEmoji(petFish.level) : '🐠'}
        </div>

        {/* 宠物鱼信息 */}
        {petFish && (
          <div className="mb-3">
            <h3 className="font-display font-bold text-lg text-ink">{petFish.name}</h3>
            <p className="text-sm text-gray-500">{petFish.type} · Lv.{petFish.level}</p>
          </div>
        )}

        {/* 成长值进度条 */}
        {petFish && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500">成长值</span>
              <span className="text-xs font-bold text-primary">
                {petFish.growth}/{petFish.requiredGrowth}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${growthPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* 今日配额进度条 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-500">今日配额</span>
            <span className="text-xs font-bold text-accent">
              {todayCount}/{maxCount}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 点击提示 */}
        {loading ? (
          <p className="text-sm text-gray-500 mt-3 animate-pulse">摸鱼中...</p>
        ) : todayCount >= maxCount ? (
          <p className="text-sm text-danger font-bold mt-3">
            你已触及今日防沉迷保护网！
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-3">点击鱼鱼摸一下</p>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-danger text-center font-bold">{error}</p>
      )}

      {/* 升级庆祝动画 */}
      {showLevelUp && petFish && (
        <div className="mt-3 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-xl p-3 text-center animate-bounce">
          <p className="font-display font-black text-lg text-amber-700">
            🎉 恭喜升级！
          </p>
          <p className="font-bold text-sm text-amber-600">
            {petFish.name} 进化为 {petFish.type} Lv.{petFish.level}！
          </p>
        </div>
      )}
    </div>
  );
}
