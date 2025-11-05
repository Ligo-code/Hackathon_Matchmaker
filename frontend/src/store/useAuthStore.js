import { create } from "zustand";
import { apiGet, apiPost } from "../api/client";
import { connectSocket, disconnectSocket } from "../lib/socket";

// Try to restore user from localStorage (for faster UI before backend check)
const savedUser = JSON.parse(localStorage.getItem("user") || "null");

export const useAuthStore = create((set, get) => ({
  user: savedUser,
  loading: false,
  error: null,

  // === Automatically validate user session on app load ===
  // Called from App.jsx to restore session from cookie (fixes Safari reload issue)
  initAuth: async () => {
    try {
      const data = await apiGet("/api/auth/me", { withCredentials: true });
      set({ user: data.user });
      localStorage.setItem("user", JSON.stringify(data.user));
      connectSocket();
    } catch {
      // If token/cookie is missing → clear user and disconnect
      set({ user: null });
      localStorage.removeItem("user");
      disconnectSocket();
    }
  },

  // === Manual user validation (used in PrivateRoute etc.) ===
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGet("/api/auth/me");
      set({ user: data.user, loading: false });
      localStorage.setItem("user", JSON.stringify(data.user));
      connectSocket();
    } catch {
      set({ user: null, loading: false });
      localStorage.removeItem("user");
      disconnectSocket();
    }
  },

  // === Register new user ===
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await apiPost("/api/auth/register", payload);
      set({ user: data.user, loading: false });
      localStorage.setItem("user", JSON.stringify(data.user));
      connectSocket();
      return true;
    } catch (e) {
      set({ error: e.data?.message || "Registration failed", loading: false });
      return false;
    }
  },

  // === Login existing user ===
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await apiPost("/api/auth/login", payload);
      set({ user: data.user, loading: false });
      localStorage.setItem("user", JSON.stringify(data.user));
      connectSocket();
      return true;
    } catch (e) {
      set({ error: e.data?.message || "Login failed", loading: false });
      return false;
    }
  },

  // === Logout and clear all local/session data ===
  logout: async () => {
    try {
      await apiPost("/api/auth/logout");
    } finally {
      disconnectSocket();
      localStorage.removeItem("user");
      set({ user: null });
    }
  },
}));
