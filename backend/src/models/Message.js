import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  content: { type: String, required: true },
  
  // Message metadata
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Index for efficient chat loading
messageSchema.index({ chatRoom: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;