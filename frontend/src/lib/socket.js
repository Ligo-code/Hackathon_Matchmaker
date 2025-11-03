// src/lib/socket.js
import { io } from "socket.io-client";

// Choose a solid URL, with fallbacks:
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ??
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? `import.meta.env.VITE_API_URL` : window.location.origin);

// Export a single shared socket instance
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false, // <-- IMPORTANT: connect manually after login
});

// (optional) small helpers
export function connectSocket() {
  if (!socket.connected) socket.connect();
}
export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}
