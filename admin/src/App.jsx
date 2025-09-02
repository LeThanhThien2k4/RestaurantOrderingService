// admin/src/App.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AddItems from "./components/AddItems";
import List from "./components/List";
import Order from "./components/Order";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AdminChat from "./components/AdminChat";
import AdminLogin from "./pages/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import StaffPanel from "./pages/StaffPanel";
import AccessDenied from "./pages/AccessDenied"; // thêm import


const App = () => {
  return (
    <>
      <Navbar /> {/* Navbar tự check token */}
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<AdminLogin />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/"
          element={
            <PrivateRoute roleRequired={["admin"]}>
              <AddItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/list"
          element={
            <PrivateRoute roleRequired={["admin"]}>
              <List />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roleRequired={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* STAFF PANEL */}
        <Route
          path="/admin/staff"
          element={
            <PrivateRoute roleRequired={["staff"]}>
              <StaffPanel />
            </PrivateRoute>
          }
        />

        {/* ADMIN + STAFF */}
        <Route
          path="/orders"
          element={
            <PrivateRoute roleRequired={["admin", "staff"]}>
              <Order />
            </PrivateRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDenied />} />

        <Route
          path="/admin/chat"
          element={
            <PrivateRoute roleRequired={["admin", "staff"]}>
              <AdminChat />
            </PrivateRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
