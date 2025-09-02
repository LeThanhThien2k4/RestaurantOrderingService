import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute kiểm tra token + role
const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('authToken'); // 🔹 đồng bộ với AdminLogin.jsx
  const userRole = localStorage.getItem('role');

  // Nếu không có token thì về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu role cụ thể nhưng user không đủ quyền
  if (roleRequired && userRole !== roleRequired) {
    // Admin luôn có quyền cao nhất
    if (userRole !== 'admin') {
      return <Navigate to="/login" replace />;
    }
  }

  // ✅ Cho phép truy cập
  return children;
};

export default PrivateRoute;
