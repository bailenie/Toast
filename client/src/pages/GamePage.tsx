import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useActiveCircle } from '../contexts/ActiveCircleContext';
import { BottomTab } from '../components/common/BottomTab';
import CardDropModal from '../components/game/CardDropModal';
import Leaderboard from '../components/game/Leaderboard';
import CardCollection from '../components/game/CardCollection';
import RedeemModal from '../components/game/RedeemModal';
import SignCalendar from '../components/game/SignCalendar';
import FishTank from '../components/game/FishTank';
import DecorationShop from '../components/game/DecorationShop';

interface CardInfo {
  id: string;
  name: string;
  color: string;
  value: string;
  rarity: string;
  bonusText: string;
  isNew?: boolean;
}

interface PetFishData {
  name: string;
  level: number;
  growth: number;
  type: string;
  requiredGrowth: number;
  leveledUp?: boolean;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  todayCount: number;
  totalCount: number;
}

export default function GamePage() {
  const { activeCircleId } = useActiveCircle();

  // 摸鱼状态
  const [todayCount, setTodayCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 卡片掉落弹窗
  const [showCardModal, setShowCardModal] = useState(false);
  const [droppedCards, setDroppedCards] = useState<CardInfo[]>([]);

  // 宠物鱼
  const [petFish, setPetFish] = useState<PetFishData | null>(null);

  // 排行榜
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // 卡片图鉴
  const [showCollection, setShowCollection] = useState(false);

  // 兑换弹窗
  const [showRedeem, setShowRedeem] = useState(false);
  const [totalCards, setTotalCards] = useState(0);
  const [uniqueCards, setUniqueCards] = useState(0);

  // 装饰商店
  const [showDecorationShop, setShowDecorationShop] = useState(false);

  // 加载初始数据
  const loadData = useCallback(async () => {
    if (!activeCircleId) return;
    try {
      const [statusRes, cardsRes, leaderboardRes] = await Promise.all([
        api.get(`/moyu/status?circleId=${activeCircleId}`),
        api.get('/moyu/cards'),
        api.get(`/moyu/leaderboard?circleId=${activeCircleId}`),
      ]);

      const status = statusRes.data.data;
      setTodayCount(status.todayCount);
      setMaxCount(status.maxCount);
      setPetFish(status.petFish);

      setTotalCards(cardsRes.data.data.totalCount);
      setUniqueCards(cardsRes.data.data.uniqueCount);
      setLeaderboard(leaderboardRes.data.data.leaderboard);
    } catch (err) {
      console.error('加载数据失败:', err);
    }
  }, [activeCircleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 摸鱼点击（PetFish 动画结束后调用）
  const handleMoyu = async () => {
    if (loading || todayCount >= maxCount || !activeCircleId) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/moyu/click', { circleId: activeCircleId });
      const { cards, petFish: newPetFish, todayCount: newTodayCount, maxCount: newMaxCount } = res.data.data;

      setDroppedCards(cards);
      if (cards.length > 0) {
        setShowCardModal(true);
      }
      setTodayCount(newTodayCount);
      setMaxCount(newMaxCount);
      setPetFish(newPetFish);

      // 更新卡片统计
      setTotalCards((prev) => prev + cards.length);

      // 重新加载排行榜
      const leaderboardRes = await api.get(`/moyu/leaderboard?circleId=${activeCircleId}`);
      setLeaderboard(leaderboardRes.data.data.leaderboard);
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(errData.response?.data?.message || '摸鱼失败');
    } finally {
      setLoading(false);
    }
  };

  if (!activeCircleId) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 select-none">🎮</div>
            <h2 className="font-display font-black text-xl text-ink mb-2">摸鱼鱼</h2>
            <p className="font-bold text-sm text-gray-500">请先加入一个鱼圈</p>
          </div>
        </div>
        <BottomTab />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* 标题区 */}
          <div className="text-center mb-6">
            <h1 className="font-display font-black text-2xl text-ink mb-2">
              带薪疯狂摸鱼 🦥
            </h1>
            <p className="font-bold text-sm text-gray-500">
              点击宠物鱼带薪抽卡！每戳一次增加鱼池 XP 且掉落卡片。
            </p>
          </div>

          {/* 主内容区 - 左右布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 第一行左侧：签到日历 */}
            <SignCalendar circleId={activeCircleId} />

            {/* 第一行右侧：治愈金鱼池 */}
            <FishTank
              petFish={petFish}
              todayCount={todayCount}
              maxCount={maxCount}
              loading={loading}
              error={error}
              onMoyu={handleMoyu}
              onOpenShop={() => setShowDecorationShop(true)}
            />

            {/* 第二行左侧：排行榜 */}
            <Leaderboard entries={leaderboard} />

            {/* 第二行右侧：UNO图鉴 */}
            <div className="bg-white border-[3px] border-ink rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-black text-lg text-ink">
                  UNO 摸鱼图鉴
                </h2>
                <span className="bg-accent-bg text-ink font-bold text-xs px-2 py-1 rounded-lg">
                  {uniqueCards}/54
                </span>
              </div>

              {/* 收集进度 */}
              <div className="mb-3">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${(uniqueCards / 54) * 100}%` }}
                  />
                </div>
              </div>

              {/* 卡片统计 */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-accent-bg rounded-lg p-2 text-center">
                  <p className="font-bold text-xs text-gray-500">累计</p>
                  <p className="font-display font-black text-lg text-ink">{totalCards}</p>
                </div>
                <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-xs text-gray-500">种类</p>
                  <p className="font-display font-black text-lg text-purple-600">{uniqueCards}</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCollection(true)}
                  className="flex-1 bg-accent hover:bg-accent-hover text-white border-2 border-ink rounded-xl font-display font-bold text-xs px-3 py-2 transition-all active:translate-y-0.5"
                >
                  查看全部图鉴
                </button>
                <button
                  onClick={() => setShowRedeem(true)}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white border-2 border-ink rounded-xl font-display font-bold text-xs px-3 py-2 transition-all active:translate-y-0.5"
                >
                  兑换实物
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 Tab */}
      <BottomTab />

      {/* 卡片掉落弹窗 */}
      {showCardModal && (
        <CardDropModal
          cards={droppedCards}
          onClose={() => setShowCardModal(false)}
          onContinue={() => {
            setShowCardModal(false);
            handleMoyu();
          }}
        />
      )}

      {/* 卡片图鉴弹窗 */}
      {showCollection && (
        <CardCollection
          onClose={() => setShowCollection(false)}
        />
      )}

      {/* 兑换弹窗 */}
      {showRedeem && (
        <RedeemModal
          totalCount={totalCards}
          uniqueCount={uniqueCards}
          onClose={() => setShowRedeem(false)}
        />
      )}

      {/* 装饰商店弹窗 */}
      {showDecorationShop && (
        <DecorationShop
          circleId={activeCircleId}
          onClose={() => setShowDecorationShop(false)}
        />
      )}
    </div>
  );
}
