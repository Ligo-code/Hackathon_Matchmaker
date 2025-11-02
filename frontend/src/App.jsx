import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chats from "./pages/Chats";

export default function App() {
  const location = useLocation();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  // Check user session on app load
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-text overflow-hidden">
      {/* === Background glow circles (from AuthLayout) === */}
      <div className="pointer-events-none absolute -top-16 -left-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

      {/* Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Routes */}
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <Requests />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <Chats />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
