import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import chatSocket from "./socket/chatSocket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://hackathon-matchmaker-app.onrender.com", 
      "http://localhost:5173" 
    ],
    methods: ["GET", "POST"],
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
});


chatSocket(io);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server error:", err);
  }
};

start();
