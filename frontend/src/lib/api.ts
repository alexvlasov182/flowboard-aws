import axios, { type InternalAxiosRequestConfig, type AxiosRequestHeaders } from 'axios';

// Получаем токен из localStorage
export const getToken = (): string | null => localStorage.getItem('flow_token');

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor для токена
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    console.log('Attaching token to request:', token);

    if (token) {
      // Ensure headers exist
      config.headers = config.headers ?? ({} as AxiosRequestHeaders);
      (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token found! Request will be unauthorized.');
    }

    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
