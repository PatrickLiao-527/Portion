import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext'; // Ensure the path is correct

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  //console.log('ProtectedRoute - User:', user);
  //console.log('ProtectedRoute - Loading:', loading);

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
