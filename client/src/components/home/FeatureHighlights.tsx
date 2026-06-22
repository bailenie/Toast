const FEATURES = [
  {
    icon: '💬',
    title: '蛐蛐蛐',
    description: '5 分钟自动销毁，不留痕迹',
    bg: 'bg-accent-bg',
  },
  {
    icon: '🎮',
    title: '摸鱼鱼',
    description: '收集 UNO 卡片，养成宠物鱼',
    bg: 'bg-accent-bg-2',
  },
  {
    icon: '💰',
    title: '窝囊费',
    description: '实时计算今日已赚窝囊费',
    bg: 'bg-accent-bg-3',
  },
  {
    icon: '🐟',
    title: '鱼圈',
    description: '组建你的摸鱼小队',
    bg: 'bg-[#EDF7F6]',
  },
];

export default function FeatureHighlights() {
  return (
    <section className="home-section dot-pattern flex items-center justify-center relative px-4">
      {/* 装饰光斑 */}
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-accent-bg-2 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 bg-accent-bg rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
            核心功能
          </h2>
          <p className="font-bold text-sm text-gray-500">
            打工人的快乐工具箱
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`feature-card ${feature.bg} border-[3px] border-ink rounded-2xl p-5 text-center cursor-default transition-all duration-200 hover:-translate-y-1 cute-shadow`}
            >
              <div className="text-4xl mb-3 select-none">{feature.icon}</div>
              <h3 className="font-display font-black text-base text-ink mb-1">
                {feature.title}
              </h3>
              <p className="font-bold text-xs text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
