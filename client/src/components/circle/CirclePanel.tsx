import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { AVATARS } from '../../avatars';

interface Circle {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  isPrivate: boolean;
  memberCount: number;
}

interface Member {
  id: string;
  nickname: string;
  avatar: string;
  isOwner: boolean;
  isMe: boolean;
}

interface CirclePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CirclePanel({ isOpen, onClose }: CirclePanelProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加入鱼圈表单
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // 创建鱼圈表单
  const [circleName, setCircleName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // 踢出成员确认
  const [kickTarget, setKickTarget] = useState<Member | null>(null);
  const [kicking, setKicking] = useState(false);

  // 退出确认
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // 加载当前鱼圈信息
  useEffect(() => {
    if (!isOpen) return;

    async function loadCircleInfo() {
      try {
        setLoading(true);
        const userRes = await api.get('/auth/me');
        const user = userRes.data.data.user;

        if (user.joinedCircleId) {
          const circleRes = await api.get(`/circles/${user.joinedCircleId}`);
          setCircle(circleRes.data.data.circle);
          setMembers(circleRes.data.data.members);
        }
      } catch (err) {
        console.error('加载鱼圈信息失败:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCircleInfo();
  }, [isOpen]);

  // 加入鱼圈
  const handleJoin = async () => {
    if (!inviteCode || inviteCode.length !== 6) {
      setJoinError('请输入正确的6位邀请码');
      return;
    }

    setJoining(true);
    setJoinError('');

    try {
      const res = await api.post('/circles/join', { code: inviteCode });
      setCircle(res.data.data.circle);
      setInviteCode('');
      // 重新加载成员列表
      const circleRes = await api.get(`/circles/${res.data.data.circle.id}`);
      setMembers(circleRes.data.data.members);
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setJoinError(errData.response?.data?.message || '加入失败');
    } finally {
      setJoining(false);
    }
  };

  // 创建鱼圈
  const handleCreate = async () => {
    if (!circleName.trim()) {
      setCreateError('请输入鱼圈名称');
      return;
    }

    if (circleName.length > 50) {
      setCreateError('名称超长，鱼圈名限50字以内哦~');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      const res = await api.post('/circles', { name: circleName });
      setCircle(res.data.data.circle);
      setCircleName('');
      // 重新加载成员列表
      const circleRes = await api.get(`/circles/${res.data.data.circle.id}`);
      setMembers(circleRes.data.data.members);
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setCreateError(errData.response?.data?.message || '创建失败');
    } finally {
      setCreating(false);
    }
  };

  // 退出鱼圈
  const handleLeave = async () => {
    if (!circle) return;

    setLeaving(true);
    try {
      await api.post(`/circles/${circle.id}/leave`);
      setCircle(null);
      setMembers([]);
      setShowLeaveConfirm(false);
      // 重新加载私有鱼圈信息
      const userRes = await api.get('/auth/me');
      const user = userRes.data.data.user;
      if (user.joinedCircleId) {
        const circleRes = await api.get(`/circles/${user.joinedCircleId}`);
        setCircle(circleRes.data.data.circle);
        setMembers(circleRes.data.data.members);
      }
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(errData.response?.data?.message || '退出失败');
    } finally {
      setLeaving(false);
    }
  };

  // 踢出成员
  const handleKick = async (memberId: string) => {
    if (!circle) return;

    setKicking(true);
    try {
      await api.delete(`/circles/${circle.id}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setCircle((prev) => prev ? { ...prev, memberCount: prev.memberCount - 1 } : null);
      setKickTarget(null);
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(errData.response?.data?.message || '踢出失败');
    } finally {
      setKicking(false);
    }
  };

  // 复制邀请码
  const handleCopyCode = async () => {
    if (!circle) return;
    try {
      await navigator.clipboard.writeText(circle.code);
      alert('📋 6位秘钥邀请码已成功拷贝到主剪贴板！快塞给能玩到一处的打工人同事吧。');
    } catch {
      console.error('复制失败');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* 侧边面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-bg-page border-l-[3px] border-ink z-50 flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b-2 border-ink flex items-center justify-between">
          <h2 className="font-display font-black text-lg text-ink">鱼圈管理</h2>
          <button
            onClick={onClose}
            className="text-ink hover:text-accent transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-accent-bg rounded-full animate-pulse mx-auto mb-4" />
              <p className="font-bold text-sm text-gray-500">加载中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="font-bold text-sm text-red-500">{error}</p>
            </div>
          ) : circle ? (
            <>
              {/* 当前鱼圈信息 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {circle.isPrivate ? (
                    <span className="bg-gray-200 text-ink font-bold text-xs px-2 py-1 rounded-lg">🔒 个人专属静室</span>
                  ) : (
                    <span className="bg-accent-bg text-ink font-bold text-xs px-2 py-1 rounded-lg">⚓️ 同事划水会合点</span>
                  )}
                </div>
                <h3 className="font-display font-black text-xl text-ink mb-1">{circle.name}</h3>
                <p className="font-bold text-xs text-gray-500">通道ID: {circle.id}</p>

                {!circle.isPrivate && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">分享秘钥:</span>
                    <span className="font-display font-black text-2xl text-accent tracking-wider">{circle.code}</span>
                    <button
                      onClick={handleCopyCode}
                      className="bg-accent-bg hover:bg-accent text-ink border-2 border-ink rounded-xl font-bold text-xs px-3 py-1 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                )}

                {circle.isPrivate && (
                  <p className="font-bold text-xs text-gray-500 mt-2">
                    这是你的私有水池。当你无心合群或想要独自发呆、默默记录属于自己的带薪窝囊费、悄悄抽UNO卡片时，就在这里安然度过吧！
                  </p>
                )}

                {!circle.isPrivate && (
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="mt-4 bg-red-100 hover:bg-red-200 text-red-600 border-2 border-ink rounded-xl font-bold text-xs px-4 py-2 transition-colors"
                  >
                    退出此圈
                  </button>
                )}
              </div>

              {/* 成员列表 */}
              <div className="mb-6">
                <h4 className="font-display font-black text-base text-ink mb-3">
                  会合点战友 Roster ({members.length}/10)
                </h4>
                <div className="space-y-2">
                  {members.map((member) => {
                    const avatarEmoji = AVATARS.find((a) => a.id === member.avatar)?.emoji ?? '🦦';
                    return (
                      <div key={member.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border-2 border-ink">
                        <span className="text-2xl">{avatarEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-ink truncate">{member.nickname}</span>
                            {member.isOwner && (
                              <span className="bg-orange-200 text-orange-700 font-bold text-xs px-2 py-0.5 rounded">群主</span>
                            )}
                            {member.isMe && (
                              <span className="bg-green-200 text-green-700 font-bold text-xs px-2 py-0.5 rounded">我</span>
                            )}
                          </div>
                        </div>
                        {circle.ownerId === members.find(m => m.isOwner)?.id && !member.isOwner && !member.isMe && (
                          <button
                            onClick={() => setKickTarget(member)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {/* 操作区 */}
          <div>
            {/* Tab 切换 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 font-display font-black text-xs px-4 py-2 rounded-xl border-2 border-ink transition-all ${
                  activeTab === 'join' ? 'bg-accent text-white shadow-sm' : 'bg-white text-ink hover:bg-accent-bg'
                }`}
              >
                加入同事会合点
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 font-display font-black text-xs px-4 py-2 rounded-xl border-2 border-ink transition-all ${
                  activeTab === 'create' ? 'bg-accent text-white shadow-sm' : 'bg-white text-ink hover:bg-accent-bg'
                }`}
              >
                组建全新鱼圈
              </button>
            </div>

            {/* Tab 内容 */}
            {activeTab === 'join' ? (
              <div>
                <h4 className="font-display font-black text-base text-ink mb-2">通过邀请密匙加入 👇</h4>
                <p className="font-bold text-xs text-gray-500 mb-4">输入同事分享的6位数字秘钥</p>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setInviteCode(val);
                  }}
                  placeholder="输入6位数字邀请码"
                  className="w-full font-display font-black text-2xl text-center tracking-wider bg-white border-[3px] border-ink rounded-2xl px-4 py-3 mb-3 focus:outline-none focus:border-accent"
                  maxLength={6}
                />
                {joinError && (
                  <p className="font-bold text-xs text-red-500 mb-3">{joinError}</p>
                )}
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-base px-6 py-3 transition-all active:translate-y-0.5 shadow-sm disabled:opacity-50"
                >
                  {joining ? '划水中...' : '加入'}
                </button>
              </div>
            ) : (
              <div>
                <h4 className="font-display font-black text-base text-ink mb-2">搭建你的科室根据地 🏗️</h4>
                <p className="font-bold text-xs text-gray-500 mb-4">定制一个专属的摸鱼小分队名称</p>
                <input
                  type="text"
                  value={circleName}
                  onChange={(e) => {
                    setCircleName(e.target.value.slice(0, 50));
                    setCreateError('');
                  }}
                  placeholder="例: 第五工位躺平分会 / 市场部周五早退党"
                  className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-2xl px-4 py-3 mb-1 focus:outline-none focus:border-accent"
                  maxLength={50}
                />
                <p className="font-bold text-xs text-gray-400 text-right mb-3">{circleName.length}/50</p>
                {createError && (
                  <p className="font-bold text-xs text-red-500 mb-3">{createError}</p>
                )}
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-base px-6 py-3 transition-all active:translate-y-0.5 shadow-sm disabled:opacity-50"
                >
                  {creating ? '组建中...' : '建立安全通道'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 退出确认弹窗 */}
      {showLeaveConfirm && circle && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-sm w-full cute-shadow">
            <h3 className="font-display font-black text-lg text-ink mb-3">确认退出</h3>
            <p className="font-bold text-sm text-gray-600 mb-6">
              你确定要告别 [{circle.name}] 的各位划水战友，回到寂静星空的私有水箱吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 bg-white text-ink border-2 border-ink rounded-xl font-bold text-sm px-4 py-2 transition-colors hover:bg-accent-bg"
              >
                取消
              </button>
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-2 border-ink rounded-xl font-bold text-sm px-4 py-2 transition-colors disabled:opacity-50"
              >
                {leaving ? '退出中...' : '确认退出'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 踢出确认弹窗 */}
      {kickTarget && circle && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-sm w-full cute-shadow">
            <h3 className="font-display font-black text-lg text-ink mb-3">确认踢出</h3>
            <p className="font-bold text-sm text-gray-600 mb-6">
              你确信要把 [{kickTarget.nickname}] 移出本划水队伍，使他退回到个人私有水池吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setKickTarget(null)}
                className="flex-1 bg-white text-ink border-2 border-ink rounded-xl font-bold text-sm px-4 py-2 transition-colors hover:bg-accent-bg"
              >
                取消
              </button>
              <button
                onClick={() => handleKick(kickTarget.id)}
                disabled={kicking}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-2 border-ink rounded-xl font-bold text-sm px-4 py-2 transition-colors disabled:opacity-50"
              >
                {kicking ? '踢出中...' : '确认踢出'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
