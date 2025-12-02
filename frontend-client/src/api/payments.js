import api from './axios';

export const paymentsAPI = {
  getByOrder: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },

  create: async (orderId, method, amount, transactionId = null) => {
    const response = await api.post('/payments', {
      order_id: orderId,
      method,
      amount,
      status: 'en attente',
      transaction_id: transactionId,
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },
};

