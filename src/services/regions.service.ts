import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api/v1';

export const regionsService = {
  getRegions: async () => {
    const response = await axios.get(`${baseUrl}/regions/`);
    return response.data;
  },
  getRegionById: async (id: number) => {
    const response = await axios.get(`${baseUrl}/regions/${id}/`);
    return response.data;
  },
  createRegion: async (data: any) => {
    const response = await axios.post(`${baseUrl}/regions/`, data);
    return response.data;
  },
  updateRegion: async (id: number, data: any) => {
    const response = await axios.put(`${baseUrl}/regions/${id}/`, data);
    return response.data;
  },
  deleteRegion: async (id: number) => {
    const response = await axios.delete(`${baseUrl}/regions/${id}/`);
    return response.data;
  },
}; 