interface ProgressBarProps {
  progress: number;
  isCensored: boolean;
}

export default function ProgressBar({ progress, isCensored }: ProgressBarProps) {
  // 进度百分比（精确到2位小数）
  const percent = Math.round(progress * 100) / 100;

  return (
    <div className="relative">
      {/* 进度条容器 */}
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-ink">
        {/* 进度填充 */}
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 动画水獭 */}
      <div
        className="absolute -top-8 transition-all duration-300"
        style={{ left: `calc(${Math.min(95, percent)}% - 16px)` }}
      >
        <span className="text-3xl animate-bounce inline-block">🦦</span>
      </div>

      {/* 进度文字 */}
      <div className="text-center mt-2">
        <span className="font-bold text-sm text-gray-500">
          {isCensored
            ? '今日下班进度: ***%'
            : `今日下班进度: ${percent.toFixed(2)}%`
          }
        </span>
      </div>
    </div>
  );
}
