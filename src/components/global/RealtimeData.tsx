"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { useCouple } from "@/hooks/useCouple";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function RealtimeData() {
  const socket = useSocket();
  const { user } = useCouple();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !user?.coupleId) return;

    // Ensure we are in the room
    socket.emit("joinRoom", user.coupleId._id);

    // 1. Gallery Listener
    const handleRefreshMemories = () => {
      console.log("📸 New Photo Detected! Refreshing...");
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    };

    // 2. Diary Listener
    const handleRefreshDiary = () => {
      console.log("📔 New Diary Entry! Refreshing...");
      queryClient.invalidateQueries({ queryKey: ["diary"] });
    };

    socket.on("refreshMemories", handleRefreshMemories);
    socket.on("refreshDiary", handleRefreshDiary);

    return () => {
      socket.off("refreshMemories", handleRefreshMemories);
      socket.off("refreshDiary", handleRefreshDiary);
    };
  }, [socket, user, queryClient]);

  return null; // Invisible component
}