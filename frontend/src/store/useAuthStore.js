import { create } from "zustand";
import { apiGet, apiPost } from "../api/client";
import { connectSocket, disconnectSocket } from "../lib/socket";


const savedUser = JSON.parse(localStorage.getItem("user") || "null");

export const useAuthStore = create((set, get) => ({
  user: savedUser,
  loading: false,
  error: null,

  
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

  // 
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
