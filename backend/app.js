import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import authRoutes from ".routes/auth.js";
import matchRoutes from "./routes/match.js";
import chatRoutes from "./routes/chat.js";
import bioRoutes from "./routes/bio.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile/bio", bioRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
