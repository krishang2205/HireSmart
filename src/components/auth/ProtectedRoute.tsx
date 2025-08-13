import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth/login" replace />;
  return children;
};
export default ProtectedRoute;
