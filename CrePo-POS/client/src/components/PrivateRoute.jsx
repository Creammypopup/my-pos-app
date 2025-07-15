import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>; // แสดงสถานะโหลดระหว่างรอเช็ค user
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;