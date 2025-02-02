import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const notificationsService = {
  async getNotifications() {
    const response = await axios.get(`${BASE_URL}/notifications/`);
    return response.data;
  },

  async markAsRead(id: number) {
    const response = await axios.post(`${BASE_URL}/notifications/${id}/read/`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await axios.post(`${BASE_URL}/notifications/read-all/`);
    return response.data;
  },

  async deleteNotification(id: number) {
    await axios.delete(`${BASE_URL}/notifications/${id}/`);
  }
}; 