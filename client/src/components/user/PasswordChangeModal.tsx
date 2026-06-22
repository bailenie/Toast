import { useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../../utils/api';
import { useAuthContext } from '../../contexts/AuthContext';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const { logout } = useAuthContext();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    // 输入验证
    if (!oldPassword) {
      setError('请输入原密码');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('新密码不少于6位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.put('/auth/password', {
        oldPassword,
        newPassword,
      });

      // 清除本地认证状态，跳转登录页
      logout();
      onClose();
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(errData.response?.data?.message || '修改失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-md w-full cute-shadow">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-2xl text-ink">
            修改密码
          </h2>
        </div>

        {/* 旧密码 */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-600 block mb-1">
            原密码
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••"
            className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
        </div>

        {/* 新密码 */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-600 block mb-1">
            新密码
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••"
            className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
          <p className="font-bold text-xs text-gray-400 mt-1">
            不少于6位
          </p>
        </div>

        {/* 确认新密码 */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-600 block mb-1">
            确认新密码
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••"
            className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="font-bold text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm disabled:opacity-50"
          >
            {saving ? '飞速处理中...' : '确认修改'}
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
