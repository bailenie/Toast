import api from '../utils/api';

// 适配器，将 axios 实例转换为简单的 apiClient
export const apiClient = {
  get: async (url: string) => {
    const response = await api.get(url);
    return response.data;
  },
  post: async (url: string, data?: any) => {
    const response = await api.post(url, data);
    return response.data;
  },
  put: async (url: string, data?: any) => {
    const response = await api.put(url, data);
    return response.data;
  },
  delete: async (url: string) => {
    const response = await api.delete(url);
    return response.data;
  },
};

export default apiClient;
