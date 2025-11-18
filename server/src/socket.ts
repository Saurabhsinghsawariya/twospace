import { Server, Socket } from "socket.io";
import Message from "./models/Message";

// 1. Create a variable to hold the IO instance
let ioInstance: Server;

export const initializeSocket = (io: Server) => {
  ioInstance = io; // Store it

  io.on("connection", (socket: Socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    socket.on("joinRoom", (coupleId) => {
      socket.join(coupleId);
      // console.log(`User joined room: ${coupleId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { coupleId, senderId, content } = data;
      try {
        const newMessage = await Message.create({ coupleId, senderId, content });
        await newMessage.populate("senderId", "name");
        io.to(coupleId).emit("newMessage", newMessage);
      } catch (error) {
        console.error("Socket Error:", error);
      }
    });
    
    socket.on("sendHeart", (coupleId) => {
      io.to(coupleId).emit("showHeart");
    });

    socket.on("disconnect", () => {});
  });
};

// 2. Export a function to get the IO instance anywhere
export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
};