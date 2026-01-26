import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Predefined options for dropdowns
const INTEREST_OPTIONS = [
  "Ecology",
  "Economics",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AI&ML",
  "Blockchain",
  "GameDev",
  "IoT",
  "Cybersecurity",
  "Social Impact",
  "E-commerce",
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },

    // Profile data for matching
    interests: [
      {
        type: String,
        enum: INTEREST_OPTIONS,
        required: true,
      },
    ],
    experience: {
      type: String,
      enum: ["junior", "middle", "senior"],
      required: true,
    },
    role: { type: String, enum: ["frontend", "backend"], required: true },

    // Bio field for enhanced profile
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // Bio quality score (0-100)
    bioScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Track if bio was AI-generated (for analytics)
    bioGeneratedByAI: {
      type: Boolean,
      default: false,
    },

    // Track when bio was last updated
    bioLastUpdated: {
      type: Date,
    },

    // Dashboard tracking
    seenUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users already shown
    skippedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users skipped

    // Settings
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password if changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Calculate bio quality score automatically
userSchema.methods.calculateBioScore = function () {
  if (!this.bio) return 0;

  let score = 0;
  const bioLength = this.bio.length;

  // Length score (0-30 points)
  if (bioLength >= 150 && bioLength <= 300) {
    score += 30;
  } else if (bioLength >= 100 && bioLength < 150) {
    score += 20;
  } else if (bioLength > 300 && bioLength <= 500) {
    score += 25;
  } else if (bioLength >= 50 && bioLength < 100) {
    score += 10;
  }

  // Has emoji (0-10 points)
  if (/[\p{Emoji}]/u.test(this.bio)) {
    score += 10;
  }

  // Mentions interests (0-20 points)
  const interestsMentioned = this.interests.some((interest) =>
    this.bio.toLowerCase().includes(interest.toLowerCase())
  );
  if (interestsMentioned) score += 20;

  // Has call to action words (0-15 points)
  const ctaWords = [
    "looking",
    "seeking",
    "excited",
    "ready",
    "love",
    "passionate",
  ];
  if (ctaWords.some((word) => this.bio.toLowerCase().includes(word))) {
    score += 15;
  }

  // Proper capitalization (0-10 points)
  if (/^[A-Z]/.test(this.bio) && this.bio.includes(".")) {
    score += 10;
  }

  // Has tech keywords (0-15 points)
  const techKeywords = [
    "react",
    "node",
    "python",
    "javascript",
    "api",
    "database",
    "ui",
    "ux",
    "typescript",
    "mongodb",
  ];
  if (techKeywords.some((tech) => this.bio.toLowerCase().includes(tech))) {
    score += 15;
  }

  return Math.min(100, score);
};

// Auto-update bioScore and bioLastUpdated when bio changes
userSchema.pre("save", function (next) {
  if (this.isModified("bio")) {
    this.bioScore = this.calculateBioScore();
    this.bioLastUpdated = new Date();
  }
  next();
});

// Virtual field for profile completeness
userSchema.virtual("profileCompleteness").get(function () {
  let completeness = 0;

  completeness += 20; // name, email (required)
  completeness += 30; // interests, experience, role (required)

  if (this.bio && this.bio.length >= 100) {
    completeness += 50; // bio is optional but valuable
  } else if (this.bio && this.bio.length > 0) {
    completeness += 25; // partial credit
  }

  return completeness;
});

// Include virtuals in JSON/Object output
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Helper for login
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Export options for frontend use
export { INTEREST_OPTIONS };

const User = mongoose.model("User", userSchema);

export default User;
