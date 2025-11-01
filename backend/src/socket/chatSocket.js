import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a chat room (frontend sends chatRoomId)
    socket.on("joinRoom", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`User joined chatRoom ${chatRoomId}`);
    });

    // Listen for new messages
    socket.on("sendMessage", async ({ chatRoomId, senderId, content }) => {
      try {
        const message = await Message.create({
          chatRoom: chatRoomId,
          sender: senderId,
          content,
        });

        await ChatRoom.findByIdAndUpdate(chatRoomId, {
          lastMessageAt: new Date(),
        });

        // Broadcast to everyone in room
        io.to(chatRoomId).emit("newMessage", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
