import express from "express";
import http from "http";
import socketIO from "socket.io";
import morgan from "morgan";
import cors from "cors";
import corsConfig from "./config/corsConfig.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import conversationRoutes from "./routes/conversation.route.js";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connectedUsers = new Set();

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  if (userId) {
    connectedUsers.add(userId);
    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
    });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors(corsConfig));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversation", conversationRoutes);

export { io, connectedUsers };

export default app;
