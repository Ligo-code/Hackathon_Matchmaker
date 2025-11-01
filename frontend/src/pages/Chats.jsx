import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const socket = io(`${import.meta.env.VITE_API_URL}`);

export default function Chats() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?._id;

   if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access messages</p>
      </div>
    );
  }
  
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  // Join active chat room for real-time messages
  useEffect(() => {
    if (!activeChat) return;

    socket.emit("joinRoom", activeChat._id);

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

  // Listen for new messages separately
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatRoom === activeChat?._id) {
        console.log("Socket message received:", message);

        setMessages((prev) => {
          const filteredPrev = prev.filter(
            (msg) => !(msg.isOptimistic && msg.content === message.content)
          );

          const processedMessage = {
            ...message,
            sender: message.sender || { _id: message.sender },
          };

          return [...filteredPrev, processedMessage];
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`, // temporary ID
      sender: {
        _id: currentUserId,
        name: "You",
      },
      content: newMessage,
      createdAt: new Date().toISOString(),
      chatRoom: activeChat._id,
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    socket.emit("sendMessage", {
      chatRoomId: activeChat._id,
      senderId: currentUserId,
      content: newMessage,
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isMyMessage = (message) => {
    const senderId = message.sender?._id || message.sender;
    return senderId === currentUserId;
  };

  return (
    <main className="flex flex-col items-center pt-14">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex h-[800px] bg-transparent rounded-[var(--radius-xl)] overflow-hidden">
          <div className="w-80 bg-(--color-surface) border border-(--color-border-soft) rounded-[var(--radius-xl)] m-4 flex flex-col overflow-hidden">
            <div className="p-6" />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                    className={`p-3 cursor-pointer transition-colors ${
                      activeChat?._id === chat._id
                        ? "bg-[#303326] text-white"
                        : "bg-transparent hover:bg-gray-900/50"
                    }`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-(--color-primary) to-(--color-secondary) flex items-center justify-center text-black font-bold text-sm">
                        {participantNames.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-sm truncate ${
                            activeChat?._id === chat._id
                              ? "text-white"
                              : "text-(--color-text)"
                          }`}
                        >
                          {participantNames}
                        </h3>
                        <p
                          className={`text-xs truncate mt-1 ${
                            activeChat?._id === chat._id
                              ? "text-gray-300"
                              : "text-(--color-muted)"
                          }`}
                        >
                          {chat.lastMessage || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active chat area */}
          <div className="flex-1 flex flex-col bg-transparent">
            {!activeChat ? (
              <div className="flex-1 flex items-center justify-center bg-transparent">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-(--color-surface) flex items-center justify-center mx-auto mb-4 border border-(--color-border-soft)">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold text-(--color-text) mb-2">
                    Select a chat
                  </h3>
                  <p className="text-(--color-muted) text-sm">
                    Choose a conversation to start messaging
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Messages area with custom scrollbar */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto bg-transparent p-4 space-y-3 custom-scrollbar"
                >
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-(--color-muted) text-sm">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const myMessage = isMyMessage(msg);

                      return (
                        <div
                          key={msg._id}
                          className={`flex ${
                            myMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-md px-3 py-2 rounded-lg ${
                              myMessage
                                ? "bg-[#303326] text-white rounded-br-none"
                                : "bg-white text-black rounded-bl-none"
                            }`}
                          >
                            <div className="text-sm">{msg.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                myMessage ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {formatTime(msg.createdAt || new Date())}
                              {msg.isOptimistic && " (sending...)"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="bg-transparent p-4">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-3 rounded-lg bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-(--color-primary) focus:outline-none transition-colors text-sm"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                      className="bg-(--color-primary) text-black px-4 rounded-lg font-medium hover:bg-(--color-secondary) transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
      </div>
    </main>
  );
}
