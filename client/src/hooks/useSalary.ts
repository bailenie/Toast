import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

export interface SalaryConfig {
  salary: number;
  workStart: string;
  workEnd: string;
}

export type TimeStatus = 'before' | 'working' | 'after';

export interface SalaryData {
  // 配置
  config: SalaryConfig;
  // 计算结果
  earned: number;
  progress: number;
  status: TimeStatus;
  countdown: string;
  // 趣味换算
  teaCount: number;
  lunchCount: number;
  unoCount: number;
  // 操作
  updateConfig: (newConfig: Partial<SalaryConfig>) => Promise<void>;
  loading: boolean;
  error: string;
}

/**
 * 解析 HH:MM 格式时间为当天的 Date 对象
 */
function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * 格式化倒计时文本
 */
function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return '';

  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  return `${hours}小时${minutes}分钟${seconds}秒`;
}

/**
 * 计算窝囊费核心逻辑
 */
function calculateSalary(config: SalaryConfig): {
  earned: number;
  progress: number;
  status: TimeStatus;
  countdown: string;
} {
  const now = new Date();
  const workStart = parseTime(config.workStart);
  const workEnd = parseTime(config.workEnd);

  // 总工作时间（秒）
  const totalWorkMs = workEnd.getTime() - workStart.getTime();
  if (totalWorkMs <= 0) {
    return { earned: 0, progress: 0, status: 'before', countdown: '' };
  }

  // 上班前
  if (now < workStart) {
    const countdownMs = workStart.getTime() - now.getTime();
    return {
      earned: 0,
      progress: 0,
      status: 'before',
      countdown: `离带薪躺平启动还有: ${formatCountdown(countdownMs)}`,
    };
  }

  // 下班后
  if (now >= workEnd) {
    return {
      earned: config.salary,
      progress: 100,
      status: 'after',
      countdown: '工作日圆满结束！今日辛劳犒赏满天飞！',
    };
  }

  // 工作中
  const workedMs = now.getTime() - workStart.getTime();
  const progress = (workedMs / totalWorkMs) * 100;
  const earned = (workedMs / totalWorkMs) * config.salary;

  const remainingMs = workEnd.getTime() - now.getTime();

  return {
    earned,
    progress: Math.max(3, Math.min(100, progress)), // 最小3%，最大100%
    status: 'working',
    countdown: `离准点跑路仅剩: ${formatCountdown(remainingMs)}`,
  };
}

/**
 * 窝囊费核心 Hook
 */
export function useSalary(): SalaryData {
  const [config, setConfig] = useState<SalaryConfig>({
    salary: 250,
    workStart: '09:00',
    workEnd: '18:00',
  });
  const [earned, setEarned] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<TimeStatus>('before');
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 加载配置
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await api.get('/salary/config');
        setConfig(res.data.data);
      } catch (err) {
        console.error('加载工资配置失败:', err);
        setError('加载配置失败');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  // 实时计算（每200ms更新）
  useEffect(() => {
    const update = () => {
      const result = calculateSalary(config);
      setEarned(result.earned);
      setProgress(result.progress);
      setStatus(result.status);
      setCountdown(result.countdown);
    };

    update();
    timerRef.current = setInterval(update, 200);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [config]);

  // 更新配置
  const updateConfig = useCallback(async (newConfig: Partial<SalaryConfig>) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.put('/salary/config', newConfig);
      setConfig(res.data.data);
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(errData.response?.data?.message || '保存失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 趣味换算
  const teaCount = earned / 18;
  const lunchCount = earned / 30;
  const unoCount = earned / 45;

  return {
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
    error,
  };
}
