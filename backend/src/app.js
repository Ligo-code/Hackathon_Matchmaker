import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import User from "./models/User.js";
import optionsRouter from "./routes/options.js";
import dashboardRouter from "./routes/dashboard.js";
import profileRouter from "./routes/profile.js";
import requestsRouter from "./routes/requests.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger, corsConfig } from "./middleware/logger.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import bioRoutes from "./routes/bio.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(requestLogger);
app.use(cors({ ...corsConfig, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hackathon Matchmaker Backend API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api", optionsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/profile/bio", bioRoutes);
app.use("/api/requests", requestsRouter);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Example API routes for hackathon matchmaker
app.get("/api/hackathons", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Tech Innovation Hackathon",
      date: "2025-11-15",
      location: "San Francisco",
    },
    {
      id: 2,
      name: "AI/ML Challenge",
      date: "2025-12-01",
      location: "New York",
    },
  ]);
});

app.get("/api/participants", (req, res) => {
  res.json([
    { id: 1, name: "John Doe", skills: ["JavaScript", "React", "Node.js"] },
    {
      id: 2,
      name: "Jane Smith",
      skills: ["Python", "Machine Learning", "Data Science"],
    },
  ]);
});

//for testing
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, interests, experience, role } = req.body;
    const user = new User({
      name,
      email,
      password,
      interests,
      experience,
      role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
});

//for testing
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//for testing - calculate match score between two users
app.get("/api/test/match/:userId1/:userId2", async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).json({ error: "User(s) not found" });
    }

    // Import scoring functions
    const { weightedScore01 } = await import("./utils/score.js");
    const { calculateMatchScore } = await import("./utils/matching.js");

    const score01 = weightedScore01(user1, user2);
    const scorePercent = calculateMatchScore(user1, user2);

    res.json({
      user1: { name: user1.name, interests: user1.interests, role: user1.role },
      user2: { name: user2.name, interests: user2.interests, role: user2.role },
      matchScore01: score01,
      matchScorePercent: scorePercent,
      breakdown: {
        roleCompatible: user1.role !== user2.role,
        interestsJaccard: calculateInterestsJaccard(
          user1.interests,
          user2.interests
        ),
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to calculate match", details: err.message });
  }
});

//for testing - get next candidate for matching
app.get("/api/test/next-candidate/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Import matching functions
    const { getNextCandidate } = await import("./utils/matching.js");
    const Invite = (await import("./models/Invite.js")).default;

    const candidate = await getNextCandidate(currentUser, User, Invite);

    if (!candidate) {
      return res.json({
        message: "No more candidates available",
        suggestion: "Reset your matching lists to start over",
      });
    }

    res.json({
      candidate: {
        _id: candidate._id,
        name: candidate.name,
        interests: candidate.interests,
        experience: candidate.experience,
        role: candidate.role,
      },
      matchScore: candidate.matchScore,
      currentUser: {
        name: currentUser.name,
        seenCount: currentUser.seenUsers.length,
        skippedCount: currentUser.skippedUsers.length,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to get next candidate", details: err.message });
  }
});

//for testing - simulate skip action
app.post("/api/test/skip/:userId/:candidateId", async (req, res) => {
  try {
    const { userId, candidateId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          skippedUsers: candidateId,
          seenUsers: candidateId,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Candidate skipped successfully",
      skippedCount: user.skippedUsers.length,
      seenCount: user.seenUsers.length,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to skip candidate", details: err.message });
  }
});

// Helper function for breakdown
function calculateInterestsJaccard(interests1, interests2) {
  const A = new Set(interests1),
    B = new Set(interests2);
  const inter = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...interests1, ...interests2]).size || 1;
  return +(inter / union).toFixed(3);
}

// Error handling middleware
app.use(errorHandler);

export default app;
