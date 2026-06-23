import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { AVATARS } from '../../avatars';
import ConfirmModal from '../common/ConfirmModal';
import ProfileEditModal from './ProfileEditModal';
import PasswordChangeModal from './PasswordChangeModal';

export default function UserMenu() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userAvatar = AVATARS.find((a) => a.id === user?.avatar);

  // 点击外部关闭菜单
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <div ref={menuRef} className="relative">
        {/* 头像按钮 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-8 rounded-full bg-accent-bg border-2 border-ink flex items-center justify-center text-sm select-none hover:brightness-95 transition-all active:translate-y-0.5"
        >
          {userAvatar?.emoji || '🦦'}
        </button>

        {/* 下拉菜单 */}
        {isMenuOpen && (
          <div className="absolute right-0 top-10 w-48 bg-bg-card border-2 border-ink rounded-xl shadow-sm py-1 animate-page-fade z-50">
            {/* 用户信息 */}
            <div className="px-3 py-2 border-b border-gray-200">
              <p className="font-display font-black text-xs text-ink truncate">
                {user.nickname}
              </p>
              <p className="font-mono text-[9px] text-gray-400 truncate">
                {user.email}
              </p>
            </div>

            {/* 菜单项 */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowProfileModal(true);
              }}
              className="w-full text-left px-3 py-2 font-bold text-xs text-ink hover:bg-accent-bg/50 transition-colors flex items-center gap-2"
            >
              <span>👤</span> 个人资料
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowPasswordModal(true);
              }}
              className="w-full text-left px-3 py-2 font-bold text-xs text-ink hover:bg-accent-bg/50 transition-colors flex items-center gap-2"
            >
              <span>🔒</span> 修改密码
            </button>
            <div className="border-t border-gray-200 my-0.5" />
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full text-left px-3 py-2 font-bold text-xs text-red-500 hover:bg-danger-bg transition-colors flex items-center gap-2"
            >
              <span>🚪</span> 下班跑路
            </button>
          </div>
        )}
      </div>

      {/* 个人资料编辑弹窗 */}
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* 修改密码弹窗 */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* 登出确认弹窗 */}
      <ConfirmModal
        open={showLogoutModal}
        title="确认操作"
        message="你确信要收拾公文包下线，离开今天的带薪阵地吗？"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
