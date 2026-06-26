import axios from 'axios';
import { getToken, removeToken } from './token';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截：自动注入 Token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：401 自动清除 Token，提取后端友好错误消息
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
    }

    // 提取后端返回的友好错误消息
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
      error.message = backendMessage;
    }

    return Promise.reject(error);
  },
);

export default api;
