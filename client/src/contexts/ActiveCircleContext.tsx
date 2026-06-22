import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '../lib/api';
import { useAuthContext } from './AuthContext';

interface Circle {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  isActive: boolean;
  unreadCount: number;
}

interface ActiveCircleContextValue {
  circles: Circle[];
  activeCircleId: string | null;
  activeCircle: Circle | null;
  setActiveCircle: (circleId: string) => void;
  refreshCircles: () => Promise<void>;
  isLoading: boolean;
}

const STORAGE_KEY = 'activeCircleId';

const ActiveCircleContext = createContext<ActiveCircleContextValue | null>(null);

export function ActiveCircleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [activeCircleId, setActiveCircleId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshCircles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/circles');
      if (response.success) {
        setCircles(response.data.circles);
        // 如果当前 activeCircleId 不在列表中，选择第一个
        if (response.data.circles.length > 0) {
          const currentActive = response.data.circles.find(
            (c: Circle) => c.id === activeCircleId
          );
          if (!currentActive) {
            const firstCircle = response.data.circles[0];
            setActiveCircleId(firstCircle.id);
            localStorage.setItem(STORAGE_KEY, firstCircle.id);
          }
        } else {
          setActiveCircleId(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('加载鱼圈列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCircleId]);

  useEffect(() => {
    if (user) {
      refreshCircles();
    }
  }, [user]);

  const setActiveCircle = useCallback((circleId: string) => {
    setActiveCircleId(circleId);
    localStorage.setItem(STORAGE_KEY, circleId);
  }, []);

  const activeCircle = circles.find((c) => c.id === activeCircleId) || null;

  return (
    <ActiveCircleContext.Provider
      value={{
        circles,
        activeCircleId,
        activeCircle,
        setActiveCircle,
        refreshCircles,
        isLoading,
      }}
    >
      {children}
    </ActiveCircleContext.Provider>
  );
}

export function useActiveCircle(): ActiveCircleContextValue {
  const ctx = useContext(ActiveCircleContext);
  if (!ctx) {
    throw new Error('useActiveCircle must be used within ActiveCircleProvider');
  }
  return ctx;
}
