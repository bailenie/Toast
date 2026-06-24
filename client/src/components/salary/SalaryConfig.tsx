import { useState } from 'react';
import type { SalaryConfig as SalaryConfigType } from '../../hooks/useSalary';
import TimeSelect from '../common/TimeSelect';

interface SalaryConfigProps {
  config: SalaryConfigType;
  onSave: (config: Partial<SalaryConfigType>) => Promise<void>;
  loading: boolean;
  error: string;
}

export default function SalaryConfig({ config, onSave, loading, error }: SalaryConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [salary, setSalary] = useState(config.salary);
  const [workStart, setWorkStart] = useState(config.workStart);
  const [workEnd, setWorkEnd] = useState(config.workEnd);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setSalary(0);
      setValidationError('');
    } else {
      const num = Number(val);
      if (num > 9999999) {
        setValidationError('单日工资不能超过9999999');
        return;
      }
      setSalary(num);
      setValidationError('');
    }
  };

  const handleSave = async () => {
    if (salary <= 0) {
      setValidationError('单日工资为必填项，且必须大于0');
      return;
    }
    setSaving(true);
    try {
      await onSave({ salary, workStart, workEnd });
      setIsOpen(false);
    } catch {
      // 错误已由父组件处理
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSalary(config.salary);
    setWorkStart(config.workStart);
    setWorkEnd(config.workEnd);
    setIsOpen(false);
  };

  return (
    <div>
      {/* 切换按钮 */}
      <button
        onClick={() => {
          if (isOpen) {
            handleCancel();
          } else {
            setIsOpen(true);
          }
        }}
        className="bg-white hover:bg-accent-bg text-ink border-[3px] border-ink rounded-2xl font-display font-black text-sm px-6 py-3 transition-all active:translate-y-0.5 shadow-sm"
      >
        {isOpen ? '取消配置' : '修改上班参数'}
      </button>

      {/* 编辑表单 */}
      {isOpen && (
        <div className="mt-4 bg-white border-[3px] border-ink rounded-2xl p-6">
          <h3 className="font-display font-black text-lg text-ink mb-4">
            填写你的带薪底牌 💼
          </h3>

          <div className="space-y-4">
            {/* 工资输入 */}
            <div>
              <label className="font-bold text-sm text-gray-600 block mb-1">
                单日工资（元）
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={salary === 0 ? '' : salary}
                onChange={handleSalaryChange}
                min={1}
                max={9999999}
                placeholder="请输入1-9999999的正整数"
                className="w-full font-bold text-sm bg-bg-page border-[3px] border-ink rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>

            {/* 上班时间 */}
            <TimeSelect
              label="上班时间"
              value={workStart}
              onChange={setWorkStart}
            />

            {/* 下班时间 */}
            <TimeSelect
              label="下班时间"
              value={workEnd}
              onChange={setWorkEnd}
            />
          </div>

          {/* 错误提示 */}
          {(validationError || error) && (
            <p className="font-bold text-sm text-red-500 mt-3">{validationError || error}</p>
          )}

          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full mt-4 bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存更新'}
          </button>
        </div>
      )}
    </div>
  );
}
