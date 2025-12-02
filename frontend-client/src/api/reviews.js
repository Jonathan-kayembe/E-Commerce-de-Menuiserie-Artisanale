import api from './axios';

export const reviewsAPI = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  create: async (userId, productId, rating, comment) => {
    const response = await api.post('/reviews', {
      user_id: userId,
      product_id: productId,
      rating,
      comment,
    });
    return response.data;
  },

  update: async (id, rating, comment) => {
    const response = await api.put(`/reviews/${id}`, {
      rating,
      comment,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

