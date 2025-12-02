import api from './axios';

export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data) => {
    // Envoyer les données en JSON (l'image est déjà uploadée via imagesAPI)
    const response = await api.post('/products', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    // Envoyer les données en JSON (le backend n'accepte pas FormData pour l'instant)
    // Si vous voulez uploader des images, il faudra ajouter cette fonctionnalité au backend
    const response = await api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

