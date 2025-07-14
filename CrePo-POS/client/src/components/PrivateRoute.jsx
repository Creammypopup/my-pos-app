import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // หากมีข้อมูล user (login แล้ว) ให้แสดงผล children (ซึ่งก็คือหน้าเว็บทั้งหมด)
  // หากไม่มี ให้เด้งกลับไปหน้า login
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;