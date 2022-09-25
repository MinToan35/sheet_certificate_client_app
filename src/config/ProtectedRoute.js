import React from "react";

import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
const ProtectedRoute = ({ children }) => {
  const { authState } = useAuthContext();

  return authState.isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
