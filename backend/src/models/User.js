import mongoose from "mongoose";

// Predefined options for dropdowns
const INTEREST_OPTIONS = [
  'Ecology',
  'Economics',
  'FinTech',
  'HealthTech',
  'EdTech',
  'AI&ML',
  'Blockchain',
  'GameDev',
  'IoT',
  'Cybersecurity',
  'Social Impact',
  'E-commerce'
];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile data for matching
  interests: [{ 
    type: String, 
    enum: INTEREST_OPTIONS,
    required: true 
  }],
  experience: { type: String, enum: ['junior', 'middle', 'senior'], required: true },
  role: { type: String, enum: ['frontend', 'backend'], required: true },
  
  // Dashboard tracking
  seenUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users already shown
  skippedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users skipped
  
  // Settings
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Export options for frontend use
export { INTEREST_OPTIONS };

const User = mongoose.model("User", userSchema);

export default User;
