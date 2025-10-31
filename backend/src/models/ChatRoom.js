import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  
  // Reference to the invite that created this chat
  inviteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invite', required: true },
  
  // Chat metadata
  isActive: { type: Boolean, default: true },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure only 2 participants per room
chatRoomSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('ChatRoom must have exactly 2 participants'));
  }
  next();
});

// Index for finding rooms by participants
chatRoomSchema.index({ participants: 1 });

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;