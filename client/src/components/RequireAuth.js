import React from 'react';
import { Navigate } from 'react-router-dom';

// Komponent Redirect, który sprawdza, czy użytkownik jest zalogowany
export const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default RequireAuth;