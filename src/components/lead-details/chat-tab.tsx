"use client";

import React, { useRef, useState, useEffect } from "react";
import { IconSend, IconPhoto, IconFile } from "@tabler/icons-react";

interface ChatTabProps {
  leadId: string | number;
}

interface ChatMessage {
  id: string;
  sender: "me" | "other";
  text?: string;
  mediaUrl?: string;
  mediaType?: "image" | "file";
  timestamp: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "other",
    text: "Hi! How can I help you today?",
    timestamp: "2024-05-24T09:00:00Z",
  },
  {
    id: "2",
    sender: "me",
    text: "I want to know more about your services.",
    timestamp: "2024-05-24T09:01:00Z",
  },
  {
    id: "3",
    sender: "other",
    mediaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    mediaType: "image",
    timestamp: "2024-05-24T09:02:00Z",
  },
  {
    id: "4",
    sender: "me",
    mediaUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    mediaType: "file",
    text: "Here is the document.",
    timestamp: "2024-05-24T09:03:00Z",
  },
];

const ChatTab: React.FC<ChatTabProps> = ({ leadId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate fetch
    setTimeout(() => {
      setMessages(MOCK_MESSAGES);
      setLoading(false);
    }, 600);
  }, [leadId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !media) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: input.trim() || undefined,
      mediaUrl: media ? URL.createObjectURL(media) : undefined,
      mediaType: media ? (media.type.startsWith("image/") ? "image" : "file") : undefined,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setMedia(null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30">
      <div className="px-6 py-4 border-b border-white/20 dark:border-neutral-700/30 flex items-center gap-3">
        <span className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Chat</span>
        <span className="ml-auto text-xs text-neutral-400">Lead ID: {leadId}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl text-red-500">!</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">No messages yet. Start the conversation!</div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 shadow-md flex flex-col gap-1 ${
                    msg.sender === "me"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100 rounded-bl-sm border border-white/30 dark:border-neutral-700/40"
                  }`}
                  tabIndex={0}
                  aria-label={msg.text || msg.mediaType || "message"}
                >
                  {msg.mediaUrl && msg.mediaType === "image" && (
                    <img
                      src={msg.mediaUrl}
                      alt="Sent media"
                      className="rounded-lg mb-1 max-w-[200px] max-h-[200px] object-cover"
                    />
                  )}
                  {msg.mediaUrl && msg.mediaType === "file" && (
                    <a
                      href={msg.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-200 underline"
                    >
                      <IconFile className="w-5 h-5" /> Download file
                    </a>
                  )}
                  {msg.text && <span>{msg.text}</span>}
                  <span className="text-xs text-neutral-300 dark:text-neutral-500 mt-1 self-end">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </>
        )}
      </div>
      <form
        className="flex items-center gap-2 p-4 border-t border-white/20 dark:border-neutral-700/30 bg-white/60 dark:bg-neutral-900/60"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        aria-label="Send message"
      >
        <label className="cursor-pointer" aria-label="Attach media">
          <input
            type="file"
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleMediaChange}
          />
          <IconPhoto className="w-6 h-6 text-blue-500" />
        </label>
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Message input"
        />
        {media && (
          <span className="text-xs text-blue-600 dark:text-blue-400 mr-2">
            {media.name}
          </span>
        )}
        <button
          type="submit"
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Send"
        >
          <IconSend className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatTab; 