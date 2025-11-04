import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";
import EmojiPicker from "emoji-picker-react";
import { Smile, ArrowLeft } from "lucide-react";

const socket = io(`${import.meta.env.VITE_API_URL}`);

export default function Chats() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?._id;

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  
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

  
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatRoom === activeChat?._id) {
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
    return () => socket.off("newMessage", handleNewMessage);
  }, [activeChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`,
      sender: { _id: currentUserId, name: "You" },
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

  // === MOBILE LAYOUT ===
  const mobileLayout = (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-black">
      {!activeChat ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatRooms.map((chat) => {
            const other = chat.participants.find((p) => p._id !== currentUserId);
            return (
              <div
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className="bg-(--color-surface) border border-(--color-border-soft) rounded-xl p-4 flex items-center gap-3 text-white"
              >
                <div className="w-10 h-10 rounded-full bg-(--color-primary) text-black flex items-center justify-center font-bold">
                  {other?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{other?.name}</p>
                  <p className="text-xs text-gray-400">
                    {chat.lastMessage || "No messages"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative flex flex-col h-full bg-black">
          
          <div className="sticky top-[170px] z-20 flex items-center justify-center px-4 py-3 bg-black border-b border-(--color-border-soft)">
            <button
              onClick={() => setActiveChat(null)}
              className="absolute left-4 text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <span className="text-white font-semibold text-base">
              {activeChat.participants.find((p) => p._id !== currentUserId)?.name}
            </span>
          </div>

          
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 space-y-3"
          >
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  isMyMessage(msg) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    isMyMessage(msg)
                      ? "bg-[#303326] text-white rounded-br-none"
                      : "bg-white text-black rounded-bl-none"
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div
                    className={`text-[11px] mt-1 ${
                      isMyMessage(msg) ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="fixed bottom-0 left-0 right-0 bg-black px-3 py-3 border-t border-(--color-border-soft)">
            <div className="flex items-center gap-2" ref={emojiPickerRef}>
              <div className="relative flex-1">
                <input
                  className="w-full p-3 pr-10 rounded-lg bg-white text-black border border-gray-300 text-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker((prev) => !prev);
                  }}
                >
                  <Smile size={23} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        setNewMessage((prev) => prev + emojiData.emoji)
                      }
                      theme="light"
                    />
                  </div>
                )}
              </div>
              <button
                className="bg-(--color-primary) text-black px-5 py-3 rounded-lg font-medium hover:bg-(--color-secondary)"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // === DESKTOP LAYOUT  ===
  const desktopLayout = (
    <main className="flex flex-col items-center pt-14">
      <h2 className="text-[26px] font-bold text-primary mb-2">Messages</h2>
      <p className="text-[16px] text-[var(--color-muted)] mb-10">
        Chat with your matches
      </p>
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex h-[750px] bg-transparent rounded-[var(--radius-xl)] overflow-hidden">
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
                </div>

                {/* Input with emoji inside field */}
                <div className="bg-transparent p-4">
                  <div
                    className="relative flex items-center gap-2"
                    ref={emojiPickerRef}
                  >
                    <div className="relative flex-1">
                      <input
                        className="w-full p-3 pr-10 rounded-lg bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-(--color-primary) focus:outline-none transition-colors text-sm"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />

                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-(--color-primary)"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmojiPicker((prev) => !prev);
                        }}
                      >
                        <Smile size={23} />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute bottom-12 right-0 z-50">
                          <EmojiPicker
                            onEmojiClick={(emojiData) =>
                              setNewMessage((prev) => prev + emojiData.emoji)
                            }
                            theme="light"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      className="bg-(--color-primary) text-black px-6 py-3 rounded-lg font-medium hover:bg-(--color-secondary) transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
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

  // === RENDER ===
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

return isMobile ? mobileLayout : desktopLayout;
}
