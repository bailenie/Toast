import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const handleCTA = () => {
    navigate(isAuthenticated ? '/salary' : '/login');
  };

  return (
    <section className="home-section dot-pattern flex items-center justify-center relative">
      {/* 装饰光斑 */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-accent-bg rounded-full opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-accent-bg-2 rounded-full opacity-40 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* 插画占位 */}
        <div className="text-8xl mb-6 select-none animate-cute-float">🦦</div>

        {/* 主标语 */}
        <h1 className="font-display font-black text-4xl sm:text-5xl text-ink leading-tight mb-4">
          上班如上坟？
          <br />
          <span className="text-accent">来这喘口气</span>
        </h1>

        {/* 副标语 */}
        <p className="font-bold text-base sm:text-lg text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          吐司 —— 打工人的情绪避风港。
          <br />
          吐槽、摸鱼、算工资，一个都不少。
        </p>

        {/* CTA 按钮 */}
        <button
          onClick={handleCTA}
          className="bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-base px-8 py-3 transition-all active:translate-y-0.5 shadow-sm"
        >
          {isAuthenticated ? '进入摸鱼现场 🐟' : '开始带薪摸鱼 🦦'}
        </button>

        {/* 提示文字 */}
        <p className="font-bold text-xs text-gray-400 mt-4">
          {isAuthenticated ? '点击进入你的摸鱼阵地' : '免费注册，3 秒加入'}
        </p>
      </div>
    </section>
  );
}
