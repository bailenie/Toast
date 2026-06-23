import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { id: 'chat', label: '蛐蛐间', icon: '💬', path: '/home/chat' },
  { id: 'game', label: '摸鱼鱼', icon: '🎮', path: '/home/game' },
] as const;

export function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="border-t-2 border-ink bg-white">
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-sm font-bold transition-all ${
                isActive
                  ? 'text-primary bg-primary/5 border-t-2 border-primary'
                  : 'text-secondary hover:text-ink'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
