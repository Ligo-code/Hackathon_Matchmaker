import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="min-h-screen bg-dark text-text">
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
