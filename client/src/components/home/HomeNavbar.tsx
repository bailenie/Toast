import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { AVATARS } from '../../avatars';

interface HomeNavbarProps {
  onLogoClick?: () => void;
}

export default function HomeNavbar({ onLogoClick }: HomeNavbarProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();

  const avatarEmoji = AVATARS.find((a) => a.id === user?.avatar)?.emoji ?? '🦦';

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-page/80 backdrop-blur-sm border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="font-display font-black text-lg text-ink select-none hover:opacity-80 transition-opacity active:translate-y-0.5"
        >
          🦦 吐司
        </button>

        {/* 右侧按钮组 */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* 已登录：头像 + 进入应用 */}
              <span className="text-2xl select-none">{avatarEmoji}</span>
              <button
                onClick={() => navigate('/home')}
                className="bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-xl font-display font-black text-xs px-4 py-1.5 transition-all active:translate-y-0.5 shadow-sm"
              >
                进入应用
              </button>
            </>
          ) : (
            <>
              {/* 未登录：登录 + 注册 */}
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-ink border-2 border-ink rounded-xl font-display font-bold text-xs px-4 py-1.5 transition-all hover:bg-accent-bg active:translate-y-0.5"
              >
                登录
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-xl font-display font-black text-xs px-4 py-1.5 transition-all active:translate-y-0.5 shadow-sm"
              >
                注册
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
