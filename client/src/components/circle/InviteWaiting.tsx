import { useState, useEffect } from 'react';
import { useActiveCircle } from '../../contexts/ActiveCircleContext';

interface InviteWaitingProps {
  inviteCode: string;
  expiresAt: string;
  onComplete: () => void;
  onClose: () => void;
}

export function InviteWaiting({ inviteCode, expiresAt, onComplete, onClose }: InviteWaitingProps) {
  const { refreshCircles } = useActiveCircle();
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const expireTime = new Date(expiresAt);
      const diff = expireTime.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('已过期');
        clearInterval(timer);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = inviteCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    refreshCircles();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl cute-shadow-lg border-2 border-ink w-[400px] max-w-[90vw] overflow-hidden">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b-2 border-ink bg-primary/5">
          <h2 className="font-display text-lg text-ink">🎉 鱼圈创建成功！</h2>
        </div>

        {/* 内容区 */}
        <div className="p-6 text-center">
          <p className="text-secondary text-sm font-body mb-6">
            分享邀请码给同事，至少需要1人加入才能激活鱼圈
          </p>

          {/* 邀请码显示 */}
          <div className="mb-6">
            <div className="text-sm text-secondary font-body mb-2">邀请码</div>
            <div
              className="text-5xl font-bold font-display text-primary tracking-widest cursor-pointer hover:scale-105 transition-transform"
              onClick={handleCopy}
              title="点击复制"
            >
              {inviteCode}
            </div>
            {copied && (
              <div className="text-sm text-success font-body mt-2">已复制！</div>
            )}
          </div>

          {/* 倒计时 */}
          <div className="mb-6">
            <div className="text-sm text-secondary font-body mb-1">剩余有效期</div>
            <div className={`text-2xl font-bold font-display ${isExpired ? 'text-danger' : 'text-ink'}`}>
              {timeLeft}
            </div>
          </div>

          {isExpired ? (
            <div className="text-danger font-body text-sm mb-4">
              邀请已过期，请重新创建鱼圈
            </div>
          ) : (
            <div className="text-secondary font-body text-sm mb-4">
              等待同事加入中...
            </div>
          )}
        </div>

        {/* 按钮栏 */}
        <div className="px-6 py-4 border-t-2 border-ink bg-surface flex gap-3">
          {isExpired ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border-2 border-ink rounded-2xl font-display text-sm text-ink hover:bg-surface transition-colors"
              >
                关闭
              </button>
              <button
                onClick={handleRefresh}
                className="flex-1 px-4 py-2.5 bg-primary text-white border-2 border-ink rounded-2xl font-display text-sm font-bold cute-shadow hover:scale-105 active:scale-95 transition-transform"
              >
                刷新状态
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border-2 border-ink rounded-2xl font-display text-sm text-ink hover:bg-surface transition-colors"
              >
                稍后再说
              </button>
              <button
                onClick={handleRefresh}
                className="flex-1 px-4 py-2.5 bg-primary text-white border-2 border-ink rounded-2xl font-display text-sm font-bold cute-shadow hover:scale-105 active:scale-95 transition-transform"
              >
                刷新状态
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
