import { useState, useRef, useEffect } from 'react';
import { apiClient } from '../../lib/api';

interface JoinCircleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function JoinCircleModal({ onClose, onSuccess }: JoinCircleModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // 自动聚焦第一个输入框
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // 只允许数字
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // 自动跳转到下一个输入框
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 输满自动提交
    if (newCode.every((c) => c !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // 按退格键跳转到上一个输入框
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setCode(pastedData.split(''));
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (codeStr: string) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await apiClient.post('/circles/join', { code: codeStr });

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || '加入失败');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setError(error.message || '加入失败，请重试');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl cute-shadow-lg border-2 border-ink w-[400px] max-w-[90vw] overflow-hidden">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b-2 border-ink bg-primary/5">
          <h2 className="font-display text-lg text-ink">🔑 加入同事的鱼圈</h2>
        </div>

        {/* 内容区 */}
        <div className="p-6">
          <p className="text-secondary text-sm font-body mb-6">
            请输入同事分享的6位邀请码
          </p>

          {/* 邀请码输入框 */}
          <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-ink rounded-xl focus:outline-none focus:border-primary transition-colors"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-center text-danger text-sm font-body mb-4">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-center text-secondary text-sm font-body">
              正在加入...
            </div>
          )}
        </div>

        {/* 按钮栏 */}
        <div className="px-6 py-4 border-t-2 border-ink bg-surface">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border-2 border-ink rounded-2xl font-display text-sm text-ink hover:bg-surface transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
