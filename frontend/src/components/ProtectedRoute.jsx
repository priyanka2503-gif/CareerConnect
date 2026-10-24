import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loading-spinner-wrap">
        <div className="loading-spinner"></div>
        <p className="loading-text">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user?.role !== allowedRole && user?.role !== 'ROLE_ADMIN') {
    // If logged in as wrong role, redirect to appropriate home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
