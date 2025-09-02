// admin/src/App.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AddItems from './components/AddItems';
import List from './components/List';
import Order from './components/Order';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AdminChat from './components/AdminChat';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <>
      {/* Navbar giờ tự ẩn nếu chưa login */}
      <Navbar />
      <Routes>
        {/* Trang Login không cần đăng nhập */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Các trang yêu cầu đăng nhập + role admin */}
        <Route
          path="/"
          element={
            <PrivateRoute roleRequired="admin">
              <AddItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/list"
          element={
            <PrivateRoute roleRequired="admin">
              <List />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute roleRequired="admin">
              <Order />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roleRequired="admin">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/chat"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminChat />
            </PrivateRoute>
          }
        />

        {/* Redirect tất cả route không tồn tại */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
