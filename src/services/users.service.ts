import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api/v1';

export const usersService = {
  getUsers: async () => {
    const response = await axios.get(`${baseUrl}/users/`);
    return response.data;
  },
  getUserById: async (id: number) => {
    const response = await axios.get(`${baseUrl}/users/detail/${id}/`);
    return response.data;
  },
  createUser: async (data: FormData) => {
    const response = await axios.post(`${baseUrl}/users/register/`, data);
    return response.data;
  },
  updateUser: async (id: number, data: FormData) => {
    const response = await axios.put(`${baseUrl}/users/update/${id}/`, data);
    return response.data;
  },
  deleteUser: async (id: number) => {
    const response = await axios.delete(`${baseUrl}/users/delete/${id}/`);
    return response.data;
  },
  changeUserStatus: async (id: number, isActive: boolean) => {
    const response = await axios.patch(`${baseUrl}/users/status/${id}/`, { is_active: isActive });
    return response.data;
  },
  changeUserRole: async (id: number, role: string) => {
    const response = await axios.patch(`${baseUrl}/users/role/${id}/`, { role });
    return response.data;
  },
  getUserStats: async (id: number) => {
    const response = await axios.get(`${baseUrl}/users/stats/${id}/`);
    return response.data;
  },
  bulkDeleteUsers: async (ids: number[]) => {
    const response = await axios.post(`${baseUrl}/users/bulk-delete/`, { ids });
    return response.data;
  },
  searchUsers: async (query: string) => {
    const response = await axios.get(`${baseUrl}/users/search/`, {
      params: { query }
    });
    return response.data.results;
  }
}; 