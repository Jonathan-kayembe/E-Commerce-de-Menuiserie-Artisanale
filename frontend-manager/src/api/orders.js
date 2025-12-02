import api from './axios';

export const ordersAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, trackingNumber = null) => {
    const response = await api.put(`/orders/${id}`, {
      status,
      tracking_number: trackingNumber,
    });
    return response.data;
  },
};

