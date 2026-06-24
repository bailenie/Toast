import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { key: 'chat', label: '💬 蛐蛐间', path: '/home/chat' },
  { key: 'game', label: '🎮 摸鱼鱼', path: '/home/game' },
  { key: 'manage', label: '⚙️ 鱼圈管理', path: '/home/circle-manage' },
];

export function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="border-t-2 border-ink bg-bg-page flex">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`flex-1 py-2.5 font-display font-bold text-xs transition-colors ${
              isActive
                ? 'bg-accent text-white border-2 border-ink'
                : 'text-gray-500 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
