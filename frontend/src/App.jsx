import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chats from "./pages/Chats";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-dark text-text">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chats"
          element={<Chats currentUserId="6905424ea9721c59da7f1ffd" />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
