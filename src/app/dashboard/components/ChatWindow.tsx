"use client";
import { useSocket } from "@/components/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react"; // <--- Import Heart Icon
import { useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  user: any;
}

export default function ChatWindow({ user }: ChatWindowProps) {
  const socket = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial history
  const { data: history } = useQuery({
    queryKey: ["chat", user.coupleId._id],
    queryFn: async () => {
      const res = await api.get(`/api/chat/${user.coupleId._id}`);
      return res.data;
    },
  });

  // Sync React Query data to local state
  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  // 2. Socket Listeners
  useEffect(() => {
    if (!socket || !user.coupleId._id) return;

    socket.emit("joinRoom", user.coupleId._id);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, user.coupleId._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      coupleId: user.coupleId._id,
      senderId: user._id,
      content: newMessage,
    });

    setNewMessage("");
  };

  // 💖 Heart Logic
  const sendHeart = () => {
    if (!socket) return;
    // Tell server to show heart to partner
    socket.emit("sendHeart", user.coupleId._id);
    
    // Show heart locally for me immediately
    // @ts-ignore
    if (typeof window !== "undefined" && window.triggerHeart) {
      // @ts-ignore
      window.triggerHeart();
    }
  };

  return (
    <div className="flex h-[80vh] flex-col justify-between p-4">
      <Card className="flex-1 overflow-hidden bg-slate-50 p-4 mb-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 flex flex-col">
            {messages.map((msg, i) => {
              const isMe = msg.senderId._id === user._id || msg.senderId === user._id;
              return (
                <div
                  key={i}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow-sm ${
                      isMe
                        ? "bg-pink-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </Card>

      <form onSubmit={handleSend} className="flex gap-2 items-end">
        {/* 💖 Heart Button */}
        <Button 
          type="button" 
          onClick={sendHeart}
          className="bg-white border border-pink-200 hover:bg-pink-50 px-3"
          title="Send Love"
        >
          <Heart className="text-pink-600 h-5 w-5" fill="currentColor" />
        </Button>

        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" className="bg-pink-600">
          Send 🚀
        </Button>
      </form>
    </div>
  );
}