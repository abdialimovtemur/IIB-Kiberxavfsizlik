import axios from 'axios';
import { Crime } from '../types/api.types';

const baseUrl = 'http://127.0.0.1:8000/api/v1';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const reportsService = {
  getReports: async (params?: any) => {
    const response = await axios.get(`${baseUrl}/reports/`, { ...getAuthHeaders(), params });
    return response.data;
  },

  createReport: async (data: FormData) => {
    const response = await axios.post(`${baseUrl}/reports/`, data, getAuthHeaders());
    return response.data;
  },

  getReportById: async (id: number) => {
    const response = await axios.get(`${baseUrl}/reports/${id}/`, getAuthHeaders());
    return response.data;
  },

  updateReport: async (id: number, data: FormData) => {
    const response = await axios.put(`${baseUrl}/reports/${id}/`, data, getAuthHeaders());
    return response.data;
  },

  deleteReport: async (id: number) => {
    const response = await axios.delete(`${baseUrl}/reports/${id}/`, getAuthHeaders());
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${baseUrl}/report/file/`, formData, getAuthHeaders());
    return response.data;
  },

  deleteFile: async (id: number) => {
    await axios.delete(`${baseUrl}/report/file/${id}/`, getAuthHeaders());
  },

  getReportsByDate: async (date: string) => {
    const response = await axios.get(`${baseUrl}/report/list/`, {
      ...getAuthHeaders(),
      params: { date },
    });
    return response.data;
  },

  getReportsByRegion: async (region: string) => {
    const response = await axios.get(`${baseUrl}/report/list/`, {
      ...getAuthHeaders(),
      params: { region },
    });
    return response.data;
  },

  getReportsByDepartment: async (department: string) => {
    const response = await axios.get(`${baseUrl}/report/list/`, {
      ...getAuthHeaders(),
      params: { department },
    });
    return response.data;
  },

  searchReports: async (search: string) => {
    const response = await axios.get(`${baseUrl}/report/list/`, {
      ...getAuthHeaders(),
      params: { search },
    });
    return response.data;
  },

  getReportStats: async (): Promise<any> => {
    const response = await axios.get(`${baseUrl}/report/stats/`, getAuthHeaders());
    return response.data;
  },

  getReportsByDateRange: async (startDate: string, endDate: string): Promise<any> => {
    const response = await axios.get(`${baseUrl}/report/list/`, {
      ...getAuthHeaders(),
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getReportFiles: async (reportId: number) => {
    const response = await axios.get(`${baseUrl}/report/files/${reportId}/`, getAuthHeaders());
    return response.data;
  },

  bulkDeleteReports: async (ids: number[]) => {
    const response = await axios.post(`${baseUrl}/report/bulk-delete/`, { ids }, getAuthHeaders());
    return response.data;
  },

  getReportAnalytics: async (params?: any) => {
    const response = await axios.get(`${baseUrl}/reports/analytics/`, { ...getAuthHeaders(), params });
    return response.data;
  },

  exportReportExcel: async (params?: any) => {
    const response = await axios.get(`${baseUrl}/reports/export/excel/`, {
      ...getAuthHeaders(),
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  importReports: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${baseUrl}/report/import/`, formData, getAuthHeaders());
    return response.data;
  }
}; 