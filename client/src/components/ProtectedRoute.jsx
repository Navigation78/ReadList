import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div id="loading-state" className="min-h-screen flex items-center justify-center bg-white">
        <div id="loading-spinner" className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FEC868] border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
