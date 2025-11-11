import axios, { type InternalAxiosRequestConfig, type AxiosRequestHeaders } from 'axios';

export const getToken = (): string | null => localStorage.getItem('flow_token');

const baseURL = import.meta.env.VITE_API_URL || (window as any).BACKEND_URL || '/api';

console.log('API baseURL:', baseURL);

const api = axios.create({
  baseURL: baseURL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    console.log('Attaching token to request:', token);

    if (token) {
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
