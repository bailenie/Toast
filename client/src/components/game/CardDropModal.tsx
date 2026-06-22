import { CARD_COLOR_MAP, RARITY_MAP } from '../../data/unoCards';

interface CardInfo {
  id: string;
  name: string;
  color: string;
  value: string;
  rarity: string;
  bonusText: string;
  isNew?: boolean;
}

interface CardDropModalProps {
  cards: CardInfo[];
  onClose: () => void;
  onContinue: () => void;
}

export default function CardDropModal({ cards, onClose, onContinue }: CardDropModalProps) {
  // 不掉卡时不弹窗
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-md w-full cute-shadow">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-2xl text-ink mb-2">
            摸鱼成功！抽得神牌
          </h2>
          <p className="font-bold text-sm text-gray-500">
            今日工作时间在此凝固，转化为可爱的能量 card！
          </p>
        </div>

        {/* 卡片展示 */}
        <div className="flex gap-4 justify-center mb-6">
          {cards.map((card) => {
            const colorStyle = CARD_COLOR_MAP[card.color] || CARD_COLOR_MAP.Wild;
            const rarityStyle = RARITY_MAP[card.rarity] || RARITY_MAP.N;

            return (
              <div
                key={card.id}
                className={`
                  w-40 rounded-2xl border-[3px] border-ink p-4 text-center
                  ${colorStyle.bg}
                `}
                title={card.bonusText}
              >
                {/* 稀有度标签 + 新卡/重复标签 */}
                <div className="flex justify-between items-center mb-2">
                  <span className={`${rarityStyle.bg} ${rarityStyle.text} font-bold text-xs px-2 py-0.5 rounded`}>
                    {rarityStyle.label}
                  </span>
                  {card.isNew !== undefined && (
                    <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                      card.isNew
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {card.isNew ? '新卡' : '重复'}
                    </span>
                  )}
                </div>

                {/* 卡片值 */}
                <div className={`font-display font-black text-4xl mb-2 ${colorStyle.text}`}>
                  {card.value}
                </div>

                {/* 卡片名称 */}
                <p className={`font-bold text-sm ${colorStyle.text}`}>
                  {card.name}
                </p>

                {/* 彩蛋文字 */}
                <p className="font-bold text-xs text-gray-500 mt-2 line-clamp-2">
                  {card.bonusText}
                </p>
              </div>
            );
          })}
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm"
          >
            继续摸鱼
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-accent-bg text-ink border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm"
          >
            收下卡牌 🦦
          </button>
        </div>
      </div>
    </div>
  );
}
