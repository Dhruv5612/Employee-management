import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authStorage from '../../../services/authStorage.js';

export default function ProtectedRoute() {
  const token = authStorage.getToken();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
