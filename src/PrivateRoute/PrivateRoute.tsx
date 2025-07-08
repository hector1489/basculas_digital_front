import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface PrivateRouteProps {
  requiredRole: string;
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, element }) => {
  const { user, isAdmin, isCustomer, isEmployee, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/access-denied" />;
  }

  if (requiredRole === 'customer' && !isCustomer) {
    return <Navigate to="/access-denied" />;
  }

  if (requiredRole === 'employee' && !isEmployee) {
    return <Navigate to="/access-denied" />;
  }

  return <>{element}</>;
};

export default PrivateRoute;