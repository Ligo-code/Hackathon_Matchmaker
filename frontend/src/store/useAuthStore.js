import { create } from "zustand";
import { apiGet, apiPost } from "../api/client";
import { connectSocket, disconnectSocket } from "../lib/socket";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGet("/api/auth/me");
      set({ user: data.user, loading: false });
      connectSocket();
    } catch {
      set({ user: null, loading: false });
      disconnectSocket();
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await apiPost("/api/auth/register", payload);
      set({ user: data.user, loading: false });
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
      connectSocket();
      return true;
    } catch (e) {
      set({ error: e.data?.message || "Login failed", loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await apiPost("/api/auth/logout");
    } finally {
      disconnectSocket();
      set({ user: null });
    }
  },
}));
