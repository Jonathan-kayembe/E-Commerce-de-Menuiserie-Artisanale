import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  // Attendre la vérification de l'authentification
  if (loading) {
    return <Loading />;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Pour le manager, vérifier le rôle
  if (user?.role !== 'manager') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
