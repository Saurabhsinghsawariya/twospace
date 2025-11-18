import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import coupleRoutes from "./routes/couple.routes";
import diaryRoutes from "./routes/diary.routes";
import memoryRoutes from "./routes/memory.routes";
import { initializeSocket } from "./socket";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://twospace-ldh2h876w-saurabh-singhs-projects-d3507bc7.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 🔴 COMMENTED OUT RATE LIMITER TO FIX CRASH
// import rateLimit from "express-rate-limit";
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// app.use("/api", limiter);

const io = new Server(server, { cors: corsOptions });
initializeSocket(io);

app.get("/", (req, res) => { res.send("API is running efficiently... 🚀"); });

app.use("/api/auth", authRoutes);
app.use("/api/couple", coupleRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/memories", memoryRoutes); 
app.use("/api/diary", diaryRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`🚀 Server (HTTP + Socket) running on port ${PORT}`);
});
