import { useState } from 'react';
import { useActiveCircle } from '../../contexts/ActiveCircleContext';
import { CreateCircleModal } from './CreateCircleModal';
import { JoinCircleModal } from './JoinCircleModal';

export function NewUserGuide() {
  const { refreshCircles } = useActiveCircle();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleSuccess = () => {
    setShowCreateModal(false);
    setShowJoinModal(false);
    refreshCircles();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* 图标 */}
        <div className="text-8xl mb-6">🐟</div>

        {/* 标题 */}
        <h1 className="font-display text-2xl text-ink mb-4">
          欢迎来到摸鱼圈！
        </h1>

        {/* 描述 */}
        <p className="text-secondary font-body mb-8">
          加入鱼圈解锁摸鱼鱼、UNO卡片等功能，和同事一起快乐摸鱼~
        </p>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full px-6 py-4 bg-primary text-white border-2 border-ink rounded-2xl font-display text-lg font-bold cute-shadow hover:scale-105 active:scale-95 transition-transform"
          >
            🔑 加入同事的鱼圈
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-6 py-4 bg-surface text-ink border-2 border-ink rounded-2xl font-display text-lg font-bold cute-shadow hover:scale-105 active:scale-95 transition-transform"
          >
            🐟 创建新鱼圈
          </button>
        </div>

        {/* 跳过选项 */}
        <button
          onClick={() => refreshCircles()}
          className="mt-6 text-secondary font-body text-sm hover:text-ink transition-colors"
        >
          暂时跳过，我先看看
        </button>
      </div>

      {/* 弹窗 */}
      {showCreateModal && (
        <CreateCircleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}
      {showJoinModal && (
        <JoinCircleModal
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
