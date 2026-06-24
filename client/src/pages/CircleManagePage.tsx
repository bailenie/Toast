import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCircle } from '../contexts/ActiveCircleContext';
import { apiClient } from '../lib/api';
import { useAuthContext } from '../contexts/AuthContext';

interface Member {
  id: string;
  nickname: string;
  avatar: string;
  isOwner: boolean;
  isMe: boolean;
}

interface CircleDetail {
  id: string;
  name: string;
  icon: string;
  ownerId: string;
  isActive: boolean;
  memberCount: number;
  inviteCode: string | null;
  inviteExpiresAt: string | null;
}

export default function CircleManagePage() {
  const { activeCircle } = useActiveCircle();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [circle, setCircle] = useState<CircleDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeCircle) {
      setLoading(false);
      return;
    }

    const loadCircleData = async () => {
      try {
        const response = await apiClient.get(`/circles/${activeCircle.id}`);
        setCircle(response.data.circle);
        setMembers(response.data.members);
      } catch (error) {
        console.error('加载鱼圈数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCircleData();
  }, [activeCircle]);

  const handleKick = async (memberId: string) => {
    if (!circle) return;
    try {
      await apiClient.delete(`/circles/${circle.id}/members/${memberId}`);
      setMembers(members.filter(m => m.id !== memberId));
      if (circle) {
        setCircle({ ...circle, memberCount: circle.memberCount - 1 });
      }
    } catch (error) {
      console.error('踢出成员失败:', error);
    }
  };

  const handleLeave = async () => {
    if (!circle) return;
    try {
      await apiClient.post(`/circles/${circle.id}/leave`);
      navigate('/home');
    } catch (error) {
      console.error('退出鱼圈失败:', error);
    }
  };

  const handleDissolve = async () => {
    // TODO: 实现解散鱼圈功能
    console.log('解散鱼圈');
  };

  if (!activeCircle) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-display text-gray-400">请先选择一个鱼圈</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-display text-gray-400">加载中...</p>
      </div>
    );
  }

  const isOwner = circle?.ownerId === user?.uid;

  const handleCopyCode = async () => {
    if (!circle?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(circle.inviteCode);
      alert('📋 邀请码已复制到剪贴板！');
    } catch {
      console.error('复制失败');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto overflow-y-auto h-full">
      {/* 鱼圈信息区 */}
      <div className="cute-shadow rounded-2xl border-2 border-ink p-6 bg-surface">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{circle?.icon || '🐟'}</span>
          <div>
            <h1 className="font-display font-black text-2xl text-ink">
              {circle?.name}
            </h1>
            <p className="font-sans text-sm text-gray-500">
              {circle?.memberCount} 位成员
            </p>
          </div>
        </div>
      </div>

      {/* 邀请码区 */}
      {circle?.inviteCode && (
        <div className="cute-shadow rounded-2xl border-2 border-ink p-6 bg-surface">
          <h2 className="font-display font-bold text-lg text-ink mb-3">
            邀请码
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-3xl text-accent tracking-wider">
              {circle.inviteCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="bg-accent hover:bg-accent-hover text-white font-display font-bold text-xs px-4 py-2 rounded-xl border-2 border-ink transition-colors"
            >
              复制
            </button>
          </div>
          {circle.inviteExpiresAt && (
            <p className="font-sans text-xs text-gray-500 mt-2">
              邀请码有效期至：{new Date(circle.inviteExpiresAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* 成员列表区 */}
      <div className="cute-shadow rounded-2xl border-2 border-ink p-6 bg-surface">
        <h2 className="font-display font-bold text-lg text-ink mb-4">
          成员列表
        </h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦦</span>
                <div>
                  <span className="font-display text-sm font-bold text-ink">
                    {member.nickname}
                  </span>
                  {member.isOwner && (
                    <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                      👑 群主
                    </span>
                  )}
                </div>
              </div>
              {isOwner && !member.isMe && (
                <button
                  onClick={() => handleKick(member.id)}
                  className="text-xs text-danger hover:text-danger/80 font-display font-bold"
                >
                  踢出
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 操作区 */}
      <div className="cute-shadow rounded-2xl border-2 border-ink p-6 bg-surface">
        {isOwner ? (
          <button
            onClick={handleDissolve}
            className="w-full py-3 bg-danger text-white font-display font-bold rounded-2xl cute-shadow border-2 border-ink hover:scale-105 active:scale-95 transition-transform"
          >
            解散鱼圈
          </button>
        ) : (
          <button
            onClick={handleLeave}
            className="w-full py-3 bg-danger text-white font-display font-bold rounded-2xl cute-shadow border-2 border-ink hover:scale-105 active:scale-95 transition-transform"
          >
            退出鱼圈
          </button>
        )}
      </div>
    </div>
  );
}
