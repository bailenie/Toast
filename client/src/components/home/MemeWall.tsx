import { useMemeQuotes, type MemeQuote } from '../../hooks/useMemeQuotes';

/** 轨道垂直位置百分比（5条轨道，从标题下方开始均匀分布） */
const TRACK_POSITIONS = ['25%', '38%', '51%', '64%', '77%'];

function DanmakuItem({ quote }: { quote: MemeQuote }) {
  return (
    <span
      className="danmaku-item font-display font-black text-sm sm:text-base text-ink/70 pointer-events-none select-none"
      style={{
        top: TRACK_POSITIONS[quote.track],
        '--speed': `${quote.speed}s`,
        '--delay': `${quote.delay}s`,
      } as React.CSSProperties}
    >
      {quote.text}
    </span>
  );
}

export default function MemeWall() {
  const quotes = useMemeQuotes();

  return (
    <section className="home-section dot-pattern relative">
      {/* 标题 */}
      <div className="absolute top-20 left-0 right-0 text-center z-10 pointer-events-none">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-1">
          打工人语录墙
        </h2>
        <p className="font-bold text-sm text-gray-500">
          每一句都是真实心声
        </p>
      </div>

      {/* 弹幕容器 */}
      <div className="absolute inset-0 overflow-hidden">
        {quotes.map((quote) => (
          <DanmakuItem key={quote.id} quote={quote} />
        ))}
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFFCF5] to-transparent pointer-events-none z-10" />
    </section>
  );
}
