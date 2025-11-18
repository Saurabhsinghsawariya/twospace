import { Server, Socket } from "socket.io";
import Message from "./models/Message";

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join a specific couple room
    socket.on("joinRoom", (coupleId) => {
      socket.join(coupleId);
      console.log(`User joined room: ${coupleId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      const { coupleId, senderId, content } = data;

      // 1. Save to Database (Async)
      const newMessage = await Message.create({
        coupleId,
        senderId,
        content,
      });

      // 2. Populate sender info for the frontend
      await newMessage.populate("senderId", "name avatarUrl");

      // 3. Emit to the specific room (Instant)
      io.to(coupleId).emit("newMessage", newMessage);
    });

    // Typing indicators
    socket.on("typing", ({ coupleId, userId }) => {
      socket.to(coupleId).emit("partnerTyping", userId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};