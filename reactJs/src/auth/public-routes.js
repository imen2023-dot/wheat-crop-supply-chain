import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PublicRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />; // Redirect to home page or any other appropriate page
  }

  return children;
};

export default PublicRoute;
