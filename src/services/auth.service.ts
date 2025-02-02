import axios from 'axios';
import {  LoginResponse, User } from '../types/api.types';

const baseUrl = 'http://127.0.0.1:8000/api/v1';

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const response = await axios.post(`${baseUrl}/users/login/`, data);
    return response.data;
  },

  checkUser: async () => {
    const response = await axios.get(`${baseUrl}/auth/checkuser/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  register: async (formData: FormData): Promise<User> => {
    const response = await axios.post(`${baseUrl}/users/register/`, formData);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axios.post(`${baseUrl}/users/refresh/`, { refresh: refreshToken });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axios.post(`${baseUrl}/users/verify-email/`, { token });
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await axios.post(`${baseUrl}/users/reset-password/`, { email });
    return response.data;
  },

  confirmResetPassword: async (token: string, password: string) => {
    const response = await axios.post(`${baseUrl}/users/confirm-reset-password/`, {
      token,
      password
    });
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${baseUrl}/users/logout/`);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axios.post('/auth/refresh/', { refresh: refreshToken });
    return response.data;
  }
};

export const isAdmin = (role?: string) => role === 'admin';
export const isSuperAdmin = (role?: string) => role === 'super_admin';
export const isUser = (role?: string) => role === 'user' || !role; 