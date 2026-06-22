import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveCircle } from '../../contexts/ActiveCircleContext';
import { CreateCircleModal } from './CreateCircleModal';
import { JoinCircleModal } from './JoinCircleModal';
import { SidebarPending } from './SidebarPending';
import { InviteWaiting } from './InviteWaiting';

export function CircleSidebar() {
  const { circles, activeCircleId, setActiveCircle, refreshCircles } = useActiveCircle();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [pendingInvite, setPendingInvite] = useState<{
    circleId: string;
    circleName: string;
    inviteCode: string;
    expiresAt: string;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCircleClick = (circleId: string) => {
    setActiveCircle(circleId);
    // 如果当前在摸鱼鱼页面，保持；否则默认进入聊天室
    if (location.pathname !== '/home/game') {
      navigate('/home/chat');
    }
  };

  const handleAddClick = () => {
    setShowMenu(!showMenu);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setShowMenu(false);
    refreshCircles();
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
    setShowMenu(false);
    refreshCircles();
  };

  const handleSalaryClick = () => {
    navigate('/home/salary');
  };

  return (
    <div className="w-[200px] h-full flex flex-col bg-surface border-r-2 border-ink">
      {/* 顶部操作区 */}
      <div className="p-3 border-b-2 border-ink relative">
        <button
          onClick={handleAddClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-2xl cute-shadow border-2 border-ink hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-lg">+</span>
          <span className="font-display text-sm">加入/创建鱼圈</span>
        </button>

        {/* 下拉菜单 */}
        {showMenu && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-white border-2 border-ink rounded-2xl cute-shadow-lg overflow-hidden z-50">
            <button
              onClick={() => {
                setShowJoinModal(true);
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-surface transition-colors font-display text-sm"
            >
              🔑 加入同事的鱼圈
            </button>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-surface transition-colors font-display text-sm border-t-2 border-ink"
            >
              🐟 组建全新鱼圈
            </button>
          </div>
        )}
      </div>

      {/* 鱼圈列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {circles.length === 0 ? (
          <div className="text-center text-secondary py-8 font-display text-sm">
            还没有加入鱼圈哦~
          </div>
        ) : (
          <div className="space-y-1">
            {circles.map((circle) => (
              <button
                key={circle.id}
                onClick={() => handleCircleClick(circle.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeCircleId === circle.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'border-2 border-transparent hover:bg-surface'
                }`}
                title={circle.name}
              >
                {/* 鱼圈图标 */}
                <span className="text-2xl flex-shrink-0">{circle.icon}</span>

                {/* 鱼圈名称 */}
                <span
                  className={`flex-1 text-left font-display text-sm truncate ${
                    activeCircleId === circle.id ? 'text-primary font-bold' : 'text-ink'
                  }`}
                >
                  {circle.name}
                </span>

                {/* 未读消息数角标 */}
                {circle.unreadCount > 0 && (
                  <span className="flex-shrink-0 bg-danger text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {circle.unreadCount > 99 ? '99+' : circle.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SidebarPending */}
      <SidebarPending onOpenInvite={setPendingInvite} />

      {/* 底部个人功能区 */}
      <div className="p-2 border-t-2 border-ink">
        <button
          onClick={handleSalaryClick}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            location.pathname === '/home/salary'
              ? 'bg-accent/10 border-2 border-accent'
              : 'border-2 border-transparent hover:bg-surface'
          }`}
        >
          <span className="text-2xl">💰</span>
          <span className="font-display text-sm text-ink">我的窝囊费</span>
        </button>
      </div>

      {/* 弹窗 */}
      {showCreateModal && (
        <CreateCircleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {showJoinModal && (
        <JoinCircleModal
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
      {pendingInvite && (
        <InviteWaiting
          inviteCode={pendingInvite.inviteCode}
          expiresAt={pendingInvite.expiresAt}
          onComplete={() => {
            setPendingInvite(null);
            refreshCircles();
          }}
          onClose={() => setPendingInvite(null)}
        />
      )}
    </div>
  );
}
