import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { getToken, setToken, removeToken } from '../utils/token';
import type { User, Circle, AuthData, MeData, ApiResponse } from '../types';

interface AuthState {
  user: User | null;
  circle: Circle | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    circle: null,
    loading: true,
  });

  // 初始化：有 token 则加载用户信息
  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState({ user: null, circle: null, loading: false });
      return;
    }
    try {
      const res = await api.get<ApiResponse<MeData>>('/auth/me');
      if (res.data.success && res.data.data) {
        setState({
          user: res.data.data.user,
          circle: res.data.data.circle,
          loading: false,
        });
      } else {
        removeToken();
        setState({ user: null, circle: null, loading: false });
      }
    } catch {
      removeToken();
      setState({ user: null, circle: null, loading: false });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 注册
  const register = useCallback(
    async (data: { email: string; password: string; nickname: string; avatar: string }) => {
      const res = await api.post<ApiResponse<AuthData>>('/auth/register', data);
      if (res.data.success && res.data.data) {
        setToken(res.data.data.token);
        setState({
          user: res.data.data.user,
          circle: null,
          loading: false,
        });
      }
      return res.data;
    },
    [],
  );

  // 登录
  const login = useCallback(async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    if (res.data.success && res.data.data) {
      setToken(res.data.data.token);
      // 登录后加载完整用户信息（含鱼圈）
      const meRes = await api.get<ApiResponse<MeData>>('/auth/me');
      if (meRes.data.success && meRes.data.data) {
        setState({
          user: meRes.data.data.user,
          circle: meRes.data.data.circle,
          loading: false,
        });
      }
    }
    return res.data;
  }, []);

  // 登出
  const logout = useCallback(() => {
    removeToken();
    setState({ user: null, circle: null, loading: false });
  }, []);

  // 更新用户信息
  const updateUser = useCallback((updatedUser: User) => {
    setState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  }, []);

  return {
    user: state.user,
    circle: state.circle,
    loading: state.loading,
    isAuthenticated: !!state.user,
    register,
    login,
    logout,
    updateUser,
  };
}
