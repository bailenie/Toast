import { useAuthContext } from '../../contexts/AuthContext';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  todayCount: number;
  totalCount: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

// 排名奖牌emoji
function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '🐟';
  }
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const { user } = useAuthContext();

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-6">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🏆</span>
        <h3 className="font-display font-black text-lg text-ink">带薪战斗排行榜</h3>
      </div>
      <p className="font-bold text-xs text-gray-500 mb-4">今日划水次数 + 历史功勋簿</p>

      {/* 排行列表 */}
      {entries.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🤫</div>
          <p className="font-bold text-sm text-gray-500">暂无数据，快来摸鱼上榜！</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isMe = entry.userId === user?.id;

            return (
              <div
                key={entry.userId}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border-2
                  ${isMe
                    ? 'bg-accent-bg border-dashed border-accent'
                    : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                {/* 排名 */}
                <span className="text-2xl w-10 text-center">{getRankEmoji(rank)}</span>

                {/* 用户信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink truncate">{entry.userName}</span>
                    {isMe && (
                      <span className="bg-accent text-white font-bold text-xs px-2 py-0.5 rounded">我</span>
                    )}
                  </div>
                </div>

                {/* 摸鱼次数 */}
                <div className="text-right">
                  <p className="font-display font-black text-lg text-ink">{entry.todayCount}</p>
                  <p className="font-bold text-xs text-gray-500">今日</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-lg text-purple-600">{entry.totalCount}</p>
                  <p className="font-bold text-xs text-gray-500">历史</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
