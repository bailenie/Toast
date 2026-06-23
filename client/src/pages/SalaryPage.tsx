import { useState } from 'react';
import { useSalary } from '../hooks/useSalary';
import EarningsDisplay from '../components/salary/EarningsDisplay';
import ProgressBar from '../components/salary/ProgressBar';
import SalaryConfig from '../components/salary/SalaryConfig';
import FunConversion from '../components/salary/FunConversion';

export function SalaryPage() {
  const {
    config,
    earned,
    progress,
    status,
    countdown,
    teaCount,
    lunchCount,
    unoCount,
    updateConfig,
    loading,
  } = useSalary();

  const [isCensored, setIsCensored] = useState(true);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-3xl text-ink mb-2">
            带薪躺平·实时窝囊费
          </h1>
          <p className="font-bold text-sm text-gray-500">
            将枯燥的职场时间，换算成一分一秒流入口袋的治愈系数字 📈
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setIsCensored(!isCensored)}
            className={`border-[3px] border-ink rounded-2xl font-display font-black text-sm px-6 py-3 transition-all active:translate-y-0.5 shadow-sm ${
              isCensored
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-accent-bg text-ink'
            }`}
          >
            {isCensored ? '解锁查看' : '防窥键'}
          </button>
        </div>

        {/* 收入展示 */}
        <EarningsDisplay earned={earned} status={status} countdown={countdown} isCensored={isCensored} />

        {/* 进度条 */}
        <ProgressBar progress={progress} isCensored={isCensored} />

        {/* 趣味换算 */}
        <FunConversion
          teaCount={teaCount}
          lunchCount={lunchCount}
          unoCount={unoCount}
          isCensored={isCensored}
        />

        {/* 薪资配置 */}
        <SalaryConfig config={config} onSave={updateConfig} loading={loading} error="" />
      </div>
    </div>
  );
}

export default SalaryPage;
