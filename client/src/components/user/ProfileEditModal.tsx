import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AVATARS } from '../../avatars';
import api from '../../utils/api';
import { useAuthContext } from '../../contexts/AuthContext';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, updateUser } = useAuthContext();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'moyu_otter');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError('昵称不能为空，给职场花名留个位置~');
      return;
    }

    if (nickname.length > 40) {
      setError('昵称不能超过40个字符');
      return;
    }

    if (bio.length > 200) {
      setError('个人简介不能超过200个字符');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await api.put('/auth/profile', {
        nickname: nickname.trim(),
        avatar,
        bio,
      });

      // 更新全局用户状态
      updateUser(res.data.data.user);
      onClose();
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(errData.response?.data?.message || '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // 恢复原始值
    setNickname(user.nickname);
    setAvatar(user.avatar);
    setBio(user.bio || '');
    setError('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-md w-full cute-shadow">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-2xl text-ink">
            编辑个人资料
          </h2>
        </div>

        {/* 头像选择 */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-600 block mb-2">
            选择头像
          </label>
          <div className="grid grid-cols-4 gap-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                className={`
                  w-full aspect-square rounded-xl border-2 flex items-center justify-center text-2xl
                  transition-all hover:scale-105
                  ${avatar === a.id
                    ? 'border-accent bg-accent-bg scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 昵称输入 */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-600 block mb-1">
            摸鱼专属花名
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 40))}
            placeholder="例: 第五工室如厕家 / 下班预言师"
            className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
          <p className="font-bold text-xs text-gray-400 mt-1">
            {nickname.length}/40
          </p>
        </div>

        {/* 个人简介 */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-600 block mb-1">
            个人简介（选填）
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            placeholder="写点什么介绍下自己..."
            className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-accent"
            rows={3}
          />
          <p className="font-bold text-xs text-gray-400 mt-1">
            {bio.length}/200
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="font-bold text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm disabled:opacity-50"
          >
            {saving ? '飞速处理中...' : '保存修改'}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="flex-1 bg-white hover:bg-accent-bg text-ink border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
