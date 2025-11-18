"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { useCouple } from "@/hooks/useCouple";
import { useSound } from "@/hooks/useSound";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NotificationListener() {
  const socket = useSocket();
  const { user } = useCouple();
  const { play } = useSound("/sounds/notification.mp3");
  const pathname = usePathname();

  useEffect(() => {
    if (!socket || !user?.coupleId) return;

    socket.emit("joinRoom", user.coupleId._id);

    const handleNewMessage = (message: any) => {
      // 🔍 1. PRINT THE RAW DATA
      console.log("--------------------------------");
      console.log("📩 MESSAGE RECEIVED");
      
      const msgSenderId = String(message.senderId._id || message.senderId);
      const myId = String(user._id);

      console.log(`👤 Message Sender ID: "${msgSenderId}"`);
      console.log(`👤 My User ID:        "${myId}"`);

      const isMe = msgSenderId === myId;
      console.log(`❓ Is this me? ${isMe ? "YES (Silence)" : "NO (Play Sound)"}`);

      if (isMe) return;

      // 🔍 2. ATTEMPT TO PLAY
      console.log("🔊 Calling play() function...");
      play();

      if (pathname !== "/dashboard") {
        toast.message("New Message 💌", {
          description: message.content,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user, play, pathname]);

  return null;
}