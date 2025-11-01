import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chats from "./pages/Chats";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/chats"
        element={<Chats currentUserId="6905424ea9721c59da7f1ffd" />}
      />
      {/* add more routes later */}
    </Routes>
  );
}
