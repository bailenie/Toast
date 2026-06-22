import type { TimeStatus } from '../../hooks/useSalary';

interface EarningsDisplayProps {
  earned: number;
  status: TimeStatus;
  countdown: string;
  isCensored: boolean;
}

export default function EarningsDisplay({ earned, status, countdown, isCensored }: EarningsDisplayProps) {
  const isWorking = status === 'working';

  return (
    <div className="text-center">
      {/* 状态标签 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className={`text-2xl ${isWorking ? 'animate-spin' : ''}`}>⏳</span>
        <span className={`font-bold text-sm px-3 py-1 rounded-lg ${
          isWorking
            ? 'bg-green-100 text-green-700'
            : status === 'before'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
        }`}>
          {isWorking
            ? '带薪奋斗中 · 收益累加'
            : status === 'before'
              ? '等待上班中 · 即将启动'
              : '静息期 · 窝囊费结算状态'
          }
        </span>
      </div>

      {/* 大金额显示 */}
      <div className="mb-2">
        <span className="font-display font-black text-5xl text-ink">
          ¥ {isCensored ? '***.**' : earned.toFixed(5)}
        </span>
      </div>

      {/* 秒级到账标签 */}
      {!isCensored && (
        <span className="inline-block bg-accent-bg text-ink font-bold text-xs px-3 py-1 rounded-lg mb-4">
          秒级到账!
        </span>
      )}

      {/* 倒计时提示 */}
      {countdown && (
        <p className="font-bold text-sm text-gray-500">
          {countdown}
        </p>
      )}
    </div>
  );
}
