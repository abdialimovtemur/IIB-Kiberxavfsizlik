import axios from 'axios';
import { User } from '../types/api.types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const settingsService = {
  async updateProfile(formData: FormData): Promise<User> {
    const response = await axios.patch(`${BASE_URL}/users/profile/update/`, formData);
    return response.data;
  },

  async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password2: string;
  }): Promise<void> {
    const response = await axios.post(`${BASE_URL}/users/change-password/`, data);
    return response.data;
  },

  async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axios.patch(`${BASE_URL}/users/avatar/update/`, formData);
    return response.data;
  }
}; 