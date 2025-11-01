import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";

export const createMessage = async (req, res) => {
  try {
    const { chatRoomId, senderId, content } = req.body;

    const message = await Message.create({
      chatRoom: chatRoomId,
      sender: senderId,
      content,
    });

    await ChatRoom.findByIdAndUpdate(chatRoomId, {
      lastMessageAt: new Date(),
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatRoom: req.params.chatRoomId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
