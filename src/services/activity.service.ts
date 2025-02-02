import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const activityService = {
  async getLogs(params?: any) {
    const response = await axios.get(`${BASE_URL}/activity-logs/`, { params });
    return response.data;
  },

  async getLogById(id: number) {
    const response = await axios.get(`${BASE_URL}/activity-logs/${id}/`);
    return response.data;
  },

  async clearLogs() {
    const response = await axios.post(`${BASE_URL}/activity-logs/clear/`);
    return response.data;
  }
}; 