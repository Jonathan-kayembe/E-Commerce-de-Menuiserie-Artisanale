import api from './axios';

export const ordersAPI = {
  create: async (userId, shippingAddressId, billingAddressId = null, items = [], totalPrice = 0, paymentMethod = 'carte_bancaire', notes = null) => {
    const response = await api.post('/orders', {
      user_id: userId,
      shipping_address_id: shippingAddressId,
      billing_address_id: billingAddressId || shippingAddressId,
      total_price: totalPrice,
      items: items.map(item => ({
        product_id: item.product_id || item.product?.id,
        quantity: item.quantity,
        price: item.price || item.product?.price || 0,
        customization: item.customization || null,
      })),
      payment_method: paymentMethod,
      notes: notes || 'Commande créée depuis le site web',
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getMyOrders: async (userId) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      // Fallback sur /orders si l'endpoint spécifique n'existe pas
      const allOrders = await api.get('/orders');
      return allOrders.data;
    }
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
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

