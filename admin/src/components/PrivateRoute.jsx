// admin/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import AccessDenied from "../pages/AccessDenied";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  // Nếu không truyền roleRequired thì cho qua
  if (!roleRequired) return children;

  // Admin luôn full quyền
  if (userRole === "admin") return children;

  // Nếu roleRequired là array => check includes
  if (Array.isArray(roleRequired)) {
    if (!roleRequired.includes(userRole)) return <AccessDenied />;
    return children;
  }

  // Nếu roleRequired là string => check trực tiếp
  if (userRole !== roleRequired) return <AccessDenied />;

  return children;
};

export default PrivateRoute;
