interface FunConversionProps {
  teaCount: number;
  lunchCount: number;
  unoCount: number;
  isCensored: boolean;
}

export default function FunConversion({ teaCount, lunchCount, unoCount, isCensored }: FunConversionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 下午茶 */}
      <div className="bg-white border-[3px] border-ink rounded-2xl p-4 text-center">
        <div className="text-3xl mb-2">🧋</div>
        <p className="font-bold text-xs text-gray-500 mb-1">已赚下午茶</p>
        <p className="font-display font-black text-2xl text-ink">
          {isCensored ? '**' : teaCount.toFixed(1)} 杯
        </p>
        <p className="font-bold text-xs text-gray-400 mt-1">芝芝莓莓 ¥18/杯</p>
      </div>

      {/* 带薪午餐 */}
      <div className="bg-white border-[3px] border-ink rounded-2xl p-4 text-center">
        <div className="text-3xl mb-2">🍱</div>
        <p className="font-bold text-xs text-gray-500 mb-1">带薪午餐值</p>
        <p className="font-display font-black text-2xl text-ink">
          {isCensored ? '**' : lunchCount.toFixed(1)} 顿
        </p>
        <p className="font-bold text-xs text-gray-400 mt-1">豪华大便当 ¥30/顿</p>
      </div>

      {/* UNO卡牌 */}
      <div className="bg-white border-[3px] border-ink rounded-2xl p-4 text-center">
        <div className="text-3xl mb-2">🃏</div>
        <p className="font-bold text-xs text-gray-500 mb-1">实体卡牌价值</p>
        <p className="font-display font-black text-2xl text-ink">
          {isCensored ? '**' : unoCount.toFixed(1)} 套
        </p>
        <p className="font-bold text-xs text-gray-400 mt-1">UNO套装 ¥45/套</p>
      </div>
    </div>
  );
}
