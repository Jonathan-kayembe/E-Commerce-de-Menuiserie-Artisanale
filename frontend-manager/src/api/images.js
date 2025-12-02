import api from './axios';

export const imagesAPI = {
  upload: async (imageFile) => {
    // Vérifier que le token est présent avant l'upload
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous reconnecter.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Ne pas forcer Content-Type pour FormData - Axios le gère automatiquement avec le boundary
    // Le token sera ajouté automatiquement par l'intercepteur axios
    const response = await api.post('/images/upload', formData);
    return response.data;
  },

  delete: async (imageUrl) => {
    const response = await api.delete('/images/delete', {
      data: { image_url: imageUrl },
    });
    return response.data;
  },
};

