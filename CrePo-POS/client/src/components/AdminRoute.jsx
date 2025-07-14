import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // Check if user is logged in and has the 'Admin' role
  return user && user.role === 'Admin' ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
