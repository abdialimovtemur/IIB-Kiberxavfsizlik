import axios from 'axios';
import { authService } from './auth.service';
import { handleError } from '../utils/errorHandler';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token) {
          const response = await authService.refreshToken(refresh_token);
          localStorage.setItem('token', response.access);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    handleError(error);
    return Promise.reject(error);
  }
); 