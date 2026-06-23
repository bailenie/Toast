import { useState } from 'react';
import { useLottie } from '../../utils/lottieLoader';

const PREVIEW_TABS = [
  {
    id: 'chat',
    label: '蛐蛐蛐',
    emoji: '💬',
    description: '消息发送、5 分钟倒计时、自动销毁',
    color: 'bg-accent-bg',
    lottieSrc: '/animations/chat.json',
  },
  {
    id: 'game',
    label: '摸鱼鱼',
    emoji: '🎮',
    description: '点击摸鱼、卡牌掉落、收集动画',
    color: 'bg-accent-bg-2',
    lottieSrc: '/animations/game.json',
  },
  {
    id: 'salary',
    label: '窝囊费',
    emoji: '💰',
    description: '金额实时增长、进度条推进',
    color: 'bg-accent-bg-3',
    lottieSrc: '/animations/salary.json',
  },
  {
    id: 'pet',
    label: '宠物鱼',
    emoji: '🐟',
    description: '宠物鱼互动、升级动画',
    color: 'bg-[#EDF7F6]',
    lottieSrc: '/animations/pet.json',
  },
] as const;

type TabId = (typeof PREVIEW_TABS)[number]['id'];

/** Lottie 动画组件，加载失败时显示静态内容 */
function LottieAnimation({ src, fallbackEmoji }: { src: string; fallbackEmoji: string }) {
  const { containerRef, loading, error } = useLottie({ src });

  if (error) {
    return (
      <div className="text-6xl mb-4 select-none animate-cute-float">
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-accent-bg rounded-full animate-pulse" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export default function FeaturePreview() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');

  const current = PREVIEW_TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="home-section dot-pattern flex items-center justify-center relative px-4">
      {/* 装饰光斑 */}
      <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-accent-bg-3 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 bg-accent-bg rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-1">
            功能预览
          </h2>
          <p className="font-bold text-sm text-gray-500">
            先体验，再上车
          </p>
        </div>

        {/* Tab 切换栏 */}
        <div className="flex justify-center gap-2 mb-6">
          {PREVIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                font-display font-black text-xs px-4 py-2 rounded-xl border-2 border-ink transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-white text-ink hover:bg-accent-bg'
                }
              `}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 动画展示区 */}
        <div
          className={`${current.color} border-[3px] border-ink rounded-2xl p-6 text-center cute-shadow transition-all duration-300`}
        >
          <LottieAnimation src={current.lottieSrc} fallbackEmoji={current.emoji} />
          <h3 className="font-display font-black text-lg text-ink mb-2">
            {current.label}
          </h3>
          <p className="font-bold text-sm text-gray-500">
            {current.description}
          </p>
        </div>
      </div>
    </section>
  );
}
