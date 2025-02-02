import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api/v1';

export const departmentsService = {
  getDepartments: async () => {
    const response = await axios.get(`${baseUrl}/departments/`);
    return response.data;
  },

  getDepartmentById: async (id: number) => {
    const response = await axios.get(`${baseUrl}/departments/${id}/`);
    return response.data;
  },

  createDepartment: async (data: FormData) => {
    const response = await axios.post(`${baseUrl}/departments/`, data);
    return response.data;
  },

  updateDepartment: async (id: number, data: FormData) => {
    const response = await axios.put(`${baseUrl}/departments/${id}/`, data);
    return response.data;
  },

  deleteDepartment: async (id: number) => {
    const response = await axios.delete(`${baseUrl}/departments/${id}/`);
    return response.data;
  },

  getDepartmentStats: async (id: number) => {
    const response = await axios.get(`${baseUrl}/departments/${id}/stats/`);
    return response.data;
  },

  getDepartmentReports: async (id: number) => {
    const response = await axios.get(`${baseUrl}/departments/${id}/reports/`);
    return response.data;
  },

  bulkDeleteDepartments: async (ids: number[]) => {
    const response = await axios.post(`${baseUrl}/departments/bulk-delete/`, { ids });
    return response.data;
  },

  searchDepartments: async (query: string) => {
    const response = await axios.get(`${baseUrl}/departments/search/`, {
      params: { query }
    });
    return response.data.results;
  }
}; 