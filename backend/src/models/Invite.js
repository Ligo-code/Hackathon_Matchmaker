import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who sent invite
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // Who receives invite
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  
  // Match score when invite was sent
  matchScore: { type: Number, min: 0, max: 100 },
  
  respondedAt: { type: Date } // When user accepted/rejected
}, { timestamps: true });

// Compound index to prevent duplicate invites
inviteSchema.index({ from: 1, to: 1 }, { unique: true });

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;