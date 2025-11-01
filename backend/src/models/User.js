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
// Helper for login
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Export options for frontend use
export { INTEREST_OPTIONS };

const User = mongoose.model("User", userSchema);

export default User;
