import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/api';

interface PendingCircle {
  circleId: string;
  circleName: string;
  circleIcon: string;
  inviteCode: string;
  expiresAt: string;
  memberCount: number;
  createdAt: string;
}

interface SidebarPendingProps {
  onOpenInvite: (data: {
    circleId: string;
    circleName: string;
    inviteCode: string;
    expiresAt: string;
  }) => void;
}

export function SidebarPending({ onOpenInvite }: SidebarPendingProps) {
  const [pendingCircles, setPendingCircles] = useState<PendingCircle[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      const response = await apiClient.get('/circles/pending');
      if (response.success) {
        setPendingCircles(response.data.pendingCircles);
      }
    } catch {
      // 静默失败
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, [fetchPending]);

  if (pendingCircles.length === 0) return null;

  return (
    <div className="border-t-2 border-ink pt-2 mt-2">
      {/* 折叠头部 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">⏳</span>
          <span className="font-display text-xs text-secondary">等待加入</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-1.5 py-0.5 rounded">
            {pendingCircles.length}
          </span>
          <span className={`text-xs text-secondary transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
        </div>
      </button>

      {/* 展开列表 */}
      {isExpanded && (
        <div className="space-y-1 mt-1">
          {pendingCircles.map((circle) => (
            <PendingItem
              key={circle.circleId}
              circle={circle}
              onClick={() =>
                onOpenInvite({
                  circleId: circle.circleId,
                  circleName: circle.circleName,
                  inviteCode: circle.inviteCode,
                  expiresAt: circle.expiresAt,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PendingItem({
  circle,
  onClick,
}: {
  circle: PendingCircle;
  onClick: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date(circle.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('已过期');
        return false;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setIsUrgent(minutes < 10);
      return true;
    };

    updateTimer();
    const interval = setInterval(() => {
      if (!updateTimer()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [circle.expiresAt]);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-all opacity-70"
      title={circle.circleName}
    >
      <span className="text-lg flex-shrink-0 opacity-60">{circle.circleIcon}</span>
      <div className="flex-1 text-left min-w-0">
        <div className="font-display text-xs text-ink truncate">{circle.circleName}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-xs font-mono tabular-nums ${isUrgent ? 'text-danger font-bold' : 'text-secondary'}`}>
            {timeLeft}
          </span>
          <span className="text-xs text-secondary">·</span>
          <span className="text-xs text-secondary">{circle.memberCount}/1人</span>
        </div>
      </div>
    </button>
  );
}
