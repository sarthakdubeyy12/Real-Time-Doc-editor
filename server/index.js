import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import Document from "./models/Document.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", docRoutes);

// =======================
// ✅ Realtime Collaboration via Socket.IO
// =======================
const docUsers = {};        // { docId: Set of usernames }
const socketMap = {};       // { socket.id: { docId, username } }

io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on("join-document", async ({ docId, username }) => {
    socket.join(docId);
    socketMap[socket.id] = { docId, username };

    // Add user to doc's collaborator list
    if (!docUsers[docId]) docUsers[docId] = new Set();
    docUsers[docId].add(username);

    // Send existing doc content
    try {
      const doc = await Document.findById(docId);
      if (doc) {
        socket.emit("load-document", doc.content);
      }
    } catch (err) {
      console.error("Error loading document:", err.message);
    }

    // Broadcast current collaborators
    io.to(docId).emit("collaborators", Array.from(docUsers[docId]));
    console.log(`👤 ${username} joined document ${docId}`);
  });

  socket.on("send-changes", ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", content);
  });

  socket.on("save-document", async ({ docId, content }) => {
    try {
      await Document.findByIdAndUpdate(docId, {
        content,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      console.error("Error saving document:", err.message);
    }
  });

  socket.on("disconnect", () => {
    const data = socketMap[socket.id];
    const username = data?.username || "unknown user";
    const docId = data?.docId;

    if (docId && docUsers[docId]) {
      docUsers[docId].delete(username);
      io.to(docId).emit("collaborators", Array.from(docUsers[docId]));
    }

    delete socketMap[socket.id];
    console.log(`🔴 Disconnected: ${socket.id} (${username})`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));