import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const exportService = {
  async exportToPdf(reportId: number): Promise<Blob> {
    const response = await axios.get(`${BASE_URL}/report/export/${reportId}/`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async exportAllToPdf(filters?: any): Promise<Blob> {
    const response = await axios.get(`${BASE_URL}/report/export-all/`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
}; 