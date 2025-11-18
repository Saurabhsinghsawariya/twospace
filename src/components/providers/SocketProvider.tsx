"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", {
      withCredentials: true,
    });

    // 👂 LISTEN FOR HEART EVENTS
    newSocket.on("showHeart", () => {
      // We check if the function exists on the window (added by FloatingHearts.tsx)
      // @ts-ignore
      if (typeof window !== "undefined" && window.triggerHeart) {
        // @ts-ignore
        window.triggerHeart();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}