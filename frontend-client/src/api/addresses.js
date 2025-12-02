import api from './axios';

export const addressesAPI = {
  getAll: async (userId) => {
    const response = await api.get(`/addresses/user/${userId}`);
    return response.data;
  },

  getUserAddresses: async (userId) => {
    const response = await api.get(`/addresses/user/${userId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};

