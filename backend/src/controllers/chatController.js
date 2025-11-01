import ChatRoom from "../models/ChatRoom.js";

export const createChatRoom = async (req, res) => {
  try {
    const { participants, inviteId } = req.body;

    let existing = await ChatRoom.findOne({
      participants: { $all: participants },
    });

    if (existing) return res.status(200).json(existing);

    const chat = await ChatRoom.create({ participants, inviteId });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await ChatRoom.find({ participants: req.params.userId })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
