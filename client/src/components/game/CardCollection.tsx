import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { UNO_CARDS, CARD_COLOR_MAP, RARITY_MAP } from '../../data/unoCards';

interface UserCard {
  cardId: string;
  count: number;
}

interface CardCollectionProps {
  onClose: () => void;
}

export default function CardCollection({ onClose }: CardCollectionProps) {
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await api.get('/moyu/cards');
        setUserCards(res.data.data.cards);
      } catch (err) {
        console.error('加载卡片失败:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

  // 获取用户某张卡片的数量
  const getCardCount = (cardId: string): number => {
    const userCard = userCards.find((c) => c.cardId === cardId);
    return userCard?.count || 0;
  };

  // 计算收集进度
  const uniqueCount = userCards.length;
  const progressPercent = Math.round((uniqueCount / 54) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col cute-shadow">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-black text-2xl text-ink">我的 UNO 摸鱼图鉴</h2>
            <p className="font-bold text-sm text-gray-500 mt-1">
              {progressPercent}% 解锁 · {uniqueCount}/54 种类
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink hover:text-accent transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 收集进度条 */}
        <div className="mb-4">
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 卡片网格 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2 animate-pulse">🃏</div>
              <p className="font-bold text-sm text-gray-500">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {UNO_CARDS.map((card) => {
                const count = getCardCount(card.id);
                const isOwned = count > 0;
                const colorStyle = CARD_COLOR_MAP[card.color] || CARD_COLOR_MAP.Wild;
                const rarityStyle = RARITY_MAP[card.rarity] || RARITY_MAP.N;

                return (
                  <div
                    key={card.id}
                    className={`
                      relative rounded-xl border-2 border-ink p-3 text-center
                      transition-all hover:scale-105
                      ${isOwned
                        ? colorStyle.bg
                        : 'bg-gray-100 opacity-50'
                      }
                    `}
                    title={isOwned ? card.bonusText : '未获得'}
                  >
                    {/* GOT 标签 */}
                    {isOwned && (
                      <div className="absolute top-1 right-1">
                        <span className="bg-green-500 text-white font-bold text-xs px-1.5 py-0.5 rounded">
                          GOT
                        </span>
                      </div>
                    )}

                    {/* 稀有度 */}
                    <div className="mb-1">
                      <span className={`${rarityStyle.bg} ${rarityStyle.text} font-bold text-xs px-1.5 py-0.5 rounded`}>
                        {rarityStyle.label}
                      </span>
                    </div>

                    {/* 卡片值 */}
                    <div className={`font-display font-black text-2xl mb-1 ${isOwned ? colorStyle.text : 'text-gray-400'}`}>
                      {card.value}
                    </div>

                    {/* 卡片名称 */}
                    <p className={`font-bold text-xs truncate ${isOwned ? colorStyle.text : 'text-gray-400'}`}>
                      {card.name}
                    </p>

                    {/* 持有数量 */}
                    <p className={`font-bold text-xs mt-1 ${isOwned ? 'text-ink' : 'text-gray-400'}`}>
                      ×{count}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
