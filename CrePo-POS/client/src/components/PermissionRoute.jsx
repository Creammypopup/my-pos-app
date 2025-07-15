import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PermissionRoute = ({ children, permission }) => {
  const { permissions, isAuthLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  
  const hasPermission = permissions.includes(permission);

  if (!hasPermission) {
    // Redirect them to the / page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they log in,
    // which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PermissionRoute;