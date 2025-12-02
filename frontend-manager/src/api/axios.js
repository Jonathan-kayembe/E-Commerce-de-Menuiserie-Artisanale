import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Routes qui ne nécessitent PAS de token
const publicRoutes = ['/auth/login', '/auth/register'];

// Fonction pour vérifier si une route est publique
const isPublicRoute = (url) => {
  return publicRoutes.some(route => url.includes(route));
};

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    // Ne pas ajouter le token pour les routes publiques
    if (!isPublicRoute(config.url)) {
      const token = localStorage.getItem('token');
      if (token) {
        // Toujours ajouter le token, même pour FormData
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    } else {
      // Pour les routes publiques, s'assurer qu'il n'y a pas de token
      delete config.headers.Authorization;
    }
    
    // Si c'est FormData, ne pas définir Content-Type (Axios le gère automatiquement avec le boundary)
    // IMPORTANT: Faire cela APRÈS avoir ajouté le token pour s'assurer qu'il est bien présent
    if (config.data instanceof FormData) {
      // Supprimer Content-Type pour laisser Axios le gérer avec le boundary
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur réponse : gérer 401/403 globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;
    
    // Ne pas nettoyer pour /auth/me pendant le check initial (géré par AuthContext)
    const isAuthMeRoute = originalRequest?.url?.includes('/auth/me');
    
    // Ne pas nettoyer pour les routes d'upload d'images - laisser ProductEdit gérer l'erreur
    const isImageUploadRoute = originalRequest?.url?.includes('/images/upload');
    
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Pour /auth/me, laisser le contexte gérer le nettoyage
      // Pour /images/upload, laisser ProductEdit gérer l'erreur sans redirection automatique
      if (!isAuthMeRoute && !isImageUploadRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Déclencher un événement global pour forcer le logout
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
