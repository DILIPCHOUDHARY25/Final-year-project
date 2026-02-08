const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const moodRoutes = require("./routes/moodRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.json({ status: "MindfulStudent backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

const activeRooms = new Map();
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", ({ room, userId, username }) => {
    try {
      socket.join(room);

      if (!activeRooms.has(room)) {
        activeRooms.set(room, new Set());
      }
      activeRooms.get(room).add(socket.id);
      activeUsers.set(socket.id, { userId, username, room });

      socket.emit("roomJoined", { room, users: Array.from(activeRooms.get(room)).length });
      io.to(room).emit("userJoined", {
        userId,
        username,
        users: Array.from(activeRooms.get(room)).length,
      });
      console.log(`User ${username} joined room: ${room}`);
    } catch (error) {
      socket.emit("error", { message: "Failed to join room" });
      console.error("Join room error:", error);
    }
  });

  socket.on("leaveRoom", ({ room }) => {
    try {
      socket.leave(room);

      if (activeRooms.has(room)) {
        activeRooms.get(room).delete(socket.id);
        if (activeRooms.get(room).size === 0) {
          activeRooms.delete(room);
        }
      }

      const user = activeUsers.get(socket.id);
      if (user) {
        io.to(room).emit("userLeft", {
          userId: user.userId,
          username: user.username,
          users: activeRooms.has(room) ? Array.from(activeRooms.get(room)).length : 0,
        });
        activeUsers.delete(socket.id);
      }

      socket.emit("roomLeft", { room });
      console.log(`Socket ${socket.id} left room: ${room}`);
    } catch (error) {
      socket.emit("error", { message: "Failed to leave room" });
      console.error("Leave room error:", error);
    }
  });

  socket.on("chatMessage", ({ room, userId, username, message }) => {
    try {
      const messageData = {
        id: Date.now(),
        userId,
        username,
        message,
        timestamp: new Date().toISOString(),
      };

      io.to(room).emit("newMessage", messageData);
      console.log(`Message in ${room} from ${username}: ${message}`);
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
      console.error("Chat message error:", error);
    }
  });

  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      const { room, userId, username } = user;

      if (activeRooms.has(room)) {
        activeRooms.get(room).delete(socket.id);
        if (activeRooms.get(room).size === 0) {
          activeRooms.delete(room);
        } else {
          io.to(room).emit("userLeft", {
            userId,
            username,
            users: Array.from(activeRooms.get(room)).length,
          });
        }
      }
      activeUsers.delete(socket.id);
    }
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
