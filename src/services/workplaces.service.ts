import axios from 'axios';
import { WorkPlace } from '../types/api.types';

const baseUrl = 'http://127.0.0.1:8000/api/v1';

export const workplacesService = {
  getWorkplaces: async () => {
    const response = await axios.get(`${baseUrl}/workplaces/`);
    return response.data;
  },
  getWorkPlaceById: async (id: number) => {
    const response = await axios.get(`${baseUrl}/workplaces/${id}/`);
    return response.data;
  },
  createWorkPlace: async (data: any) => {
    const response = await axios.post(`${baseUrl}/workplaces/`, data);
    return response.data;
  },
  updateWorkPlace: async (id: number, data: any) => {
    const response = await axios.put(`${baseUrl}/workplaces/${id}/`, data);
    return response.data;
  },
  deleteWorkPlace: async (id: number) => {
    const response = await axios.delete(`${baseUrl}/workplaces/${id}/`);
    return response.data;
  },
  getWorkplaceStats: async (id: number) => {
    const response = await axios.get(`${baseUrl}/workplaces/${id}/stats/`);
    return response.data;
  },
  getWorkplaceUsers: async (id: number) => {
    const response = await axios.get(`${baseUrl}/workplaces/${id}/users/`);
    return response.data;
  },
  getWorkplaceReports: async (id: number) => {
    const response = await axios.get(`${baseUrl}/workplaces/${id}/reports/`);
    return response.data;
  },
  bulkDeleteWorkplaces: async (ids: number[]) => {
    const response = await axios.post(`${baseUrl}/workplaces/bulk-delete/`, { ids });
    return response.data;
  },
  searchWorkplaces: async (query: string) => {
    const response = await axios.get(`${baseUrl}/workplaces/search/`, {
      params: { query }
    });
    return response.data.results;
  }
}; 