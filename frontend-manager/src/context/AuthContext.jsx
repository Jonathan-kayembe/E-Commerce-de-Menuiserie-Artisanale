import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, requiredRole = null }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkingRef = useRef(false);

  // Restore optimistically from localStorage to avoid flicker
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Vérifier le rôle si requiredRole est spécifié
        if (!requiredRole || parsed.role === requiredRole) {
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          // Rôle incorrect, nettoyer
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Always check with API
    checkAuth();

    // Listen for global logout events (from axios interceptor)
    const onLogout = () => {
      clearAuth();
      toast.info('Session expirée. Veuillez vous reconnecter.');
    };

    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        clearAuth();
        setLoading(false);
        checkingRef.current = false;
        return;
      }

      const res = await api.get('/auth/me');
      
      // Adapter à la structure du backend: { success: true, data: { user: {...} } }
      const userData = res?.data?.data?.user || res?.data?.user || res?.data;

      if (!userData) {
        clearAuth();
      } else {
        // Si un requiredRole est passé, vérifier le rôle
        if (requiredRole && userData.role !== requiredRole) {
          clearAuth();
        } else {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData)); // refresh stored user
        }
      }
    } catch (error) {
      // 401/403 gérés par l'intercepteur qui déclenche auth:logout
      // Pour les erreurs réseau, si on avait un user+token sauvegardé, garder l'état optimiste
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (!requiredRole || parsed.role === requiredRole) {
            setUser(parsed);
            setIsAuthenticated(true);
          } else {
            clearAuth();
          }
        } catch {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } finally {
      setLoading(false);
      checkingRef.current = false;
    }
  };

  const login = async (email, password) => {
    try {
      // Cleanup before attempting login
      clearAuth();

      // Utiliser axios directement pour éviter l'intercepteur (même si la route est publique)
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/login`,
        { 
          email: email.trim(), 
          password,
          ...(requiredRole && { required_role: requiredRole })
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      // Backend peut répondre { success, data: { user, token } } ou { user, token } - normaliser
      const data = res?.data?.data || res?.data;
      const token = data?.token;
      const userData = data?.user;

      if (!token || !userData) {
        throw new Error('Réponse API invalide');
      }

      // Vérification optionnelle du rôle
      if (requiredRole && userData.role !== requiredRole) {
        clearAuth();
        throw new Error(`Accès réservé au rôle ${requiredRole}`);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast.success('Connexion réussie', { autoClose: 2000 });
      return { success: true, user: userData };
    } catch (err) {
      clearAuth();
      const message = err.response?.data?.message || err.message || 'Erreur de connexion';
      toast.error(message, { autoClose: 3000 });
      return { success: false, error: message };
    }
  };

  const register = async (payload) => {
    try {
      clearAuth();

      // Utiliser axios directement pour éviter l'intercepteur (même si la route est publique)
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/register`,
        {
          ...payload,
          ...(requiredRole && { role: requiredRole })
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const data = res?.data?.data || res?.data;
      const token = data?.token;
      const userData = data?.user;

      if (!token || !userData) {
        throw new Error('Réponse API invalide');
      }

      if (requiredRole && userData.role !== requiredRole) {
        clearAuth();
        throw new Error(`Accès réservé au rôle ${requiredRole}`);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast.success('Inscription réussie', { autoClose: 2000 });
      return { success: true, user: userData };
    } catch (err) {
      clearAuth();
      
      // Gérer les erreurs de validation (422)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const message = err.response?.data?.message || 'Erreurs de validation.';
        
        // Ne pas afficher de toast pour les erreurs de validation, elles seront affichées dans les champs
        // Retourner les erreurs pour que le composant puisse les afficher
        return { 
          success: false, 
          error: message,
          errors: validationErrors // Retourner les erreurs par champ
        };
      }
      
      const message = err.response?.data?.message || err.message || 'Erreur d\'inscription';
      toast.error(message, { autoClose: 3000 });
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Tenter le logout serveur mais toujours nettoyer côté client
      await api.post('/auth/logout').catch(() => {});
    } finally {
      clearAuth();
      toast.info('Déconnecté', { autoClose: 1500 });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth, // Exposer si nécessaire
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
