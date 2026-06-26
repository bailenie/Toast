import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useActiveCircle } from '../../contexts/ActiveCircleContext';
import UserMenu from '../user/UserMenu';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { activeCircle } = useActiveCircle();

  const isSalaryPage = location.pathname === '/home/salary';

  return (
    <header className="sticky top-0 z-40 bg-bg-page/80 backdrop-blur-sm border-b-2 border-ink">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* 左侧：Logo 和鱼圈名称 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="font-display font-black text-lg text-ink select-none hover:opacity-80 transition-opacity active:translate-y-0.5"
          >
            🦦 吐司
          </button>

          {/* 窝囊费页面返回按钮 */}
          {isSalaryPage && (
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-xl border-2 border-ink font-display text-sm font-bold text-ink hover:bg-accent-bg transition-colors active:translate-y-0.5 cute-shadow-sm"
            >
              ← 返回
            </button>
          )}

          {/* 当前鱼圈名称 */}
          {activeCircle && !isSalaryPage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-xl border-2 border-ink">
              <span className="text-lg">{activeCircle.icon}</span>
              <span className="font-display text-sm font-bold text-ink">
                {activeCircle.name}
              </span>
            </div>
          )}
        </div>

        {/* 右侧：用户头像菜单 */}
        {user && <UserMenu />}
      </div>
    </header>
  );
}
