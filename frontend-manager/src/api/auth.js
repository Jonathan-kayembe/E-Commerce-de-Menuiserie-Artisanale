import api from './axios';
import axios from 'axios';

export const authAPI = {
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
          required_role: 'manager', // Demander explicitement le rôle manager
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
      
      // Le backend retourne { success, message, data: { user, token } }
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      const user = data.data?.user;
      if (user?.role !== 'manager') {
        const currentRole = user?.role || 'non défini';
        throw new Error(`Accès réservé aux managers. Votre rôle actuel est : "${currentRole}". Veuillez contacter un administrateur pour obtenir le rôle manager.`);
      }
      
      return data;
    } catch (error) {
      // Gérer les erreurs spécifiques
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Erreur de connexion';
        
        if (status === 429) {
          throw new Error('Trop de tentatives. Veuillez réessayer dans quelques instants.');
        } else if (status === 403) {
          throw new Error(message || 'Accès refusé. Rôle manager requis.');
        } else if (status === 401) {
          throw new Error(message || 'Identifiants invalides.');
        }
        
        throw new Error(message);
      }
      
      throw error;
    }
  },

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

  register: async (data) => {
    // Utiliser axios directement pour éviter l'intercepteur
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/register`,
        {
          full_name: data.full_name,
          email: data.email.trim(), // Nettoyer l'email
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: 'manager', // Spécifier le rôle manager
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      
      // Le backend retourne { success, message, data: { user, token } }
      const responseData = response.data;
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Erreur d\'inscription');
      }

      const user = responseData.data?.user;
      if (user?.role !== 'manager') {
        throw new Error('Erreur: le compte n\'a pas été créé avec le rôle manager');
      }
      
      return responseData;
    } catch (error) {
      // Gérer les erreurs spécifiques
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Erreur d\'inscription';
        
        if (status === 422) {
          // Erreur de validation
          const errors = error.response.data?.errors;
          if (errors) {
            const firstError = Object.values(errors)[0];
            throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
          }
        }
        
        throw new Error(message);
      }
      
      throw error;
    }
  },

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
      
      // Extraire l'utilisateur
      const user = responseData.data?.user;
      
      if (!user) {
        throw new Error('Données utilisateur invalides');
      }
      
      if (user.role !== 'manager') {
        const currentRole = user.role || 'non défini';
        // Créer une erreur avec un status 403 pour que l'intercepteur la gère
        const error = new Error(`Accès réservé aux managers. Votre rôle actuel est : "${currentRole}". Veuillez contacter un administrateur pour obtenir le rôle manager.`);
        error.response = { status: 403 };
        throw error;
      }
      
      // Retourner la structure complète pour que le contexte puisse l'utiliser
      return responseData;
    } catch (error) {
      // Propager l'erreur pour que le contexte puisse la gérer
      throw error;
    }
  },
};
