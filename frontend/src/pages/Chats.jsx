import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`); // socket server

export default function Chats({ currentUserId }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load user chat rooms
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${currentUserId}`
      );
      const data = await res.json();
      setChatRooms(data);
    };
    fetchChats();
  }, [currentUserId]);

  // Join active chat room for real-time messages
  useEffect(() => {
    if (!activeChat) return;

    socket.emit("joinRoom", activeChat._id);

    // Listen for new messages
    socket.on("newMessage", (message) => {
      if (message.chatRoom === activeChat._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Load initial messages
    const fetchMessages = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${activeChat._id}`
      );
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();

    return () => {
      socket.off("newMessage");
    };
  }, [activeChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    socket.emit("sendMessage", {
      chatRoomId: activeChat._id,
      senderId: currentUserId,
      content: newMessage,
    });

    setNewMessage("");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <div className="w-80 border-r border-gray-800 bg-[#111111] flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatRooms.map((chat) => {
            const otherParticipants = chat.participants.filter(
              (p) => p._id !== currentUserId
            );
            const participantNames = otherParticipants
              .map((p) => p.name)
              .join(", ");

            return (
              <div
                key={chat._id}
                className={`p-4 cursor-pointer border-b border-gray-800 transition-colors ${
                  activeChat?._id === chat._id
                    ? "bg-gray-900 border-l-4 border-lime-300"
                    : "hover:bg-gray-900/50"
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-300 to-green-500 flex items-center justify-center text-black font-bold">
                    {participantNames.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {participantNames}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage || "Start a conversation..."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a chat
              </h3>
              <p className="text-gray-400">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-800 bg-[#111111] p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-300 to-green-500 flex items-center justify-center text-black font-bold">
                  {activeChat.participants
                    .filter((p) => p._id !== currentUserId)
                    .map((p) => p.name.charAt(0).toUpperCase())
                    .join("")}
                </div>
                <div>
                  <h2 className="font-semibold text-white">
                    {activeChat.participants
                      .filter((p) => p._id !== currentUserId)
                      .map((p) => p.name)
                      .join(", ")}
                  </h2>
                  <p className="text-sm text-gray-400">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender._id === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender._id === currentUserId
                          ? "bg-lime-300 text-black rounded-br-none"
                          : "bg-gray-800 text-white rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm">{msg.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender._id === currentUserId
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.createdAt || new Date())}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-800 bg-[#111111] p-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-lime-300 focus:outline-none transition-colors"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="bg-lime-300 text-black px-6 rounded-lg font-medium hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
