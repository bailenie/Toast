import { useState } from 'react';
import { apiClient } from '../../lib/api';
import { InviteWaiting } from './InviteWaiting';

interface CreateCircleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCircleModal({ onClose, onSuccess }: CreateCircleModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('请输入鱼圈名称');
      return;
    }

    if (name.length > 50) {
      setError('名称超长，鱼圈名限50字以内哦~');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await apiClient.post('/circles', { name: name.trim() });

      if (response.success) {
        setInviteCode(response.data.invite.code);
        setExpiresAt(response.data.invite.expiresAt);
      } else {
        setError(response.message || '创建失败');
      }
    } catch (error: any) {
      setError(error.message || '创建失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaitingComplete = () => {
    onSuccess();
  };

  // 如果已生成邀请码，显示等待界面
  if (inviteCode && expiresAt) {
    return (
      <InviteWaiting
        inviteCode={inviteCode}
        expiresAt={expiresAt}
        onComplete={handleWaitingComplete}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl cute-shadow-lg border-2 border-ink w-[400px] max-w-[90vw] overflow-hidden">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b-2 border-ink bg-primary/5">
          <h2 className="font-display text-lg text-ink">🐟 组建全新鱼圈</h2>
        </div>

        {/* 内容区 */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block font-display text-sm text-ink mb-2">
              给你的鱼圈起个名字
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="例如：第五工位躺平分会"
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-ink rounded-2xl font-body focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
            <div className="flex justify-between mt-1">
              {error && (
                <span className="text-danger text-sm font-body">{error}</span>
              )}
              <span className="text-secondary text-sm font-body ml-auto">
                {name.length}/50
              </span>
            </div>
          </div>

          <p className="text-secondary text-sm font-body mb-6">
            创建后会生成邀请码，分享给同事加入，至少需要2人才能激活鱼圈~
          </p>
        </div>

        {/* 按钮栏 */}
        <div className="px-6 py-4 border-t-2 border-ink bg-surface flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-ink rounded-2xl font-display text-sm text-ink hover:bg-surface transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
            className="flex-1 px-4 py-2.5 bg-primary text-white border-2 border-ink rounded-2xl font-display text-sm font-bold cute-shadow hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '创建中...' : '建立安全通道'}
          </button>
        </div>
      </div>
    </div>
  );
}
