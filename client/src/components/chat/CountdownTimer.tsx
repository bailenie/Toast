import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  createdAt: number;
  onExpire?: () => void;
}

export default function CountdownTimer({ createdAt, onExpire }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const elapsed = now - createdAt;
      const left = Math.max(0, 5 * 60 * 1000 - elapsed);
      setRemaining(left);

      if (left <= 0 && onExpire) {
        onExpire();
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt, onExpire]);

  if (remaining <= 0) {
    return (
      <span className="font-bold text-xs text-red-500 animate-pulse">
        物理销毁中...
      </span>
    );
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <span className="font-bold text-xs text-red-400">
      🔥 {minutes}分{seconds.toString().padStart(2, '0')}秒后毁灭
    </span>
  );
}
