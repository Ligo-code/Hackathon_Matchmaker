import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import express from "express";
import app from "./app.js";
import connectDB from "./config/db.js";
import chatSocket from "./socket/chatSocket.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hackathon-matchmaker-app.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
chatSocket(io);

// --- Connect DB and start server ---
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // --- Serve frontend build when in production ---
    if (process.env.NODE_ENV === "production") {
      const frontendPath = path.join(__dirname, "../../frontend/dist");
      app.use(express.static(frontendPath));
    
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
      });
    }

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server error:", err);
  }
};

start();
