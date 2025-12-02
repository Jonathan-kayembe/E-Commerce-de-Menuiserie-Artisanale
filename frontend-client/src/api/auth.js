import api from './axios';
import axios from 'axios';

export const authAPI = {
  // Inscription
  register: async (data) => {
    // Créer une requête SANS token pour l'inscription
    // Utiliser axios directement pour éviter l'intercepteur
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/register`,
      {
        full_name: data.full_name,
        email: data.email.trim(),
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data;
  },

  // Connexion - CRITIQUE : Ne jamais envoyer de token
  login: async (email, password) => {
    // IMPORTANT : Utiliser axios directement pour éviter l'intercepteur
    // qui pourrait envoyer un token résiduel
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/login`,
        {
          email: email.trim(), // Nettoyer l'email
          password: password, // Le mot de passe tel quel
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // S'assurer explicitement qu'aucun token n'est envoyé
            'Authorization': undefined,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Propager l'erreur pour que le contexte puisse la gérer
      throw error;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      // Appeler le backend pour invalider le token côté serveur
      await api.post('/auth/logout');
    } catch (error) {
      // Même si le backend échoue, on continue le logout côté client
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
      // Ne pas throw pour permettre le logout côté client même si le backend échoue
    }
  },

  // Récupérer l'utilisateur connecté
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      // Le backend retourne { success: true, data: { user: {...} } }
      // axios retourne { data: { success: true, data: { user: {...} } }, status: 200, ... }
      // Donc response.data = { success: true, data: { user: {...} } }
      const responseData = response.data;
      
      // Vérifier que la réponse est valide
      if (!responseData || !responseData.success) {
        throw new Error(responseData?.message || 'Réponse invalide du serveur');
      }
      
      // Retourner la structure complète pour que le contexte puisse l'utiliser
      return responseData;
    } catch (error) {
      // Propager l'erreur pour que le contexte puisse la gérer
      throw error;
    }
  },
};
