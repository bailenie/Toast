import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';

interface SignCalendarProps {
  circleId: string;
  onSignSuccess?: (newBalance: number) => void;
}

export default function SignCalendar({ circleId, onSignSuccess }: SignCalendarProps) {
  const [isSignedToday, setIsSignedToday] = useState(false);
  const [signInDates, setSignInDates] = useState<string[]>([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 加载签到状态
  useEffect(() => {
    const loadSignStatus = async () => {
      try {
        const res = await api.get(`/circles/${circleId}/sign-status`);
        if (res.data.success) {
          setIsSignedToday(res.data.data.isSignedToday);
          setSignInDates(res.data.data.signInDates);
          setCoinBalance(res.data.data.coinBalance);
        }
      } catch (err) {
        console.error('加载签到状态失败:', err);
      }
    };

    loadSignStatus();
  }, [circleId]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  // 签到
  const handleSign = async () => {
    if (isSignedToday || loading) return;

    try {
      setLoading(true);
      setMessage('');
      const res = await api.post(`/circles/${circleId}/sign`);
      if (res.data.success) {
        setIsSignedToday(true);
        setCoinBalance(res.data.data.coinBalance);
        setMessage(res.data.data.message);
        
        // 更新签到日期列表
        const today = new Date().toISOString().split('T')[0];
        setSignInDates(prev => [...prev, today]);

        // 通知父组件鱼币余额更新
        if (onSignSuccess) {
          onSignSuccess(res.data.data.coinBalance);
        }

        // 1.5秒后自动消失
        if (messageTimerRef.current) {
          clearTimeout(messageTimerRef.current);
        }
        messageTimerRef.current = setTimeout(() => {
          setMessage('');
        }, 1500);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '签到失败';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 本周日期
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // 周一为0
  
  // 获取本周的日期列表
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };
  
  const weekDates = getWeekDates();

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-black text-lg text-ink">📅 本周签到</h2>
        <span className="text-sm font-bold text-gray-500">鱼币: {coinBalance}</span>
      </div>

      {/* 签到日历 */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => {
          const dateStr = weekDates[index];
          const isSigned = signInDates.includes(dateStr);
          const isToday = index === todayIndex;

          return (
            <div
              key={day}
              className={`text-center p-2 rounded-lg ${
                isToday
                  ? 'bg-primary/10 border-2 border-primary'
                  : isSigned
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <div className="text-xs font-bold text-gray-500">{day}</div>
              <div className="text-lg mt-1">
                {isSigned ? '✅' : isToday ? '📍' : '⬜'}
              </div>
            </div>
          );
        })}
      </div>

      {/* 签到提示消息 */}
      {message && (
        <div className={`mb-3 p-2 rounded-lg text-sm font-bold text-center ${
          message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* 签到按钮 */}
      <button
        onClick={handleSign}
        disabled={isSignedToday || loading}
        className={`w-full py-3 rounded-xl font-display font-bold text-sm transition-all ${
          isSignedToday
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 text-white border-2 border-ink cute-shadow active:translate-y-0.5'
        }`}
      >
        {loading ? '签到中...' : isSignedToday ? '已签到' : '签到领鱼币'}
      </button>
    </div>
  );
}
