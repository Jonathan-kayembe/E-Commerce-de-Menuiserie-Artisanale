import api from './axios';

export const cartAPI = {
  get: async (userId) => {
    const response = await api.get(`/carts/user/${userId}`);
    return response.data;
  },

  create: async (userId) => {
    // Le backend utilise l'utilisateur authentifié depuis le token, pas besoin d'envoyer user_id
    // On garde userId en paramètre pour compatibilité mais on ne l'envoie plus
    const response = await api.post('/carts', {});
    return response.data;
  },

  addItem: async (cartId, productId, quantity, customization = null) => {
    const response = await api.post('/cart-items', {
      cart_id: cartId,
      product_id: productId,
      quantity,
      customization,
    });
    return response.data;
  },

  updateItem: async (itemId, quantity, customization = null) => {
    const response = await api.put(`/cart-items/${itemId}`, { 
      quantity,
      customization 
    });
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/cart-items/${itemId}`);
    return response.data;
  },

  clear: async (cartId) => {
    const response = await api.delete(`/carts/${cartId}`);
    return response.data;
  },

  getCartItems: async (cartId) => {
    const response = await api.get(`/cart-items/cart/${cartId}`);
    return response.data;
  },
};

