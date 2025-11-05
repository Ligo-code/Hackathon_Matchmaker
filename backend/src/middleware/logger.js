// Request logging middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
};

// ✅ CORS configuration (Safari-safe)
export const corsConfig = {
  origin: [
    process.env.FRONTEND_URL || "https://hackathon-matchmaker-app.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true, // allow cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
