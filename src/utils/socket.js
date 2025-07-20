const socket = require("socket.io");
const crypto = require("crypto");

const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat room
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    // Handle chat messages
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          console.log(firstName + " " + text);
          const roomId = getSecretRoomId(userId, targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log(err);
        }
      }
    );

    // Handle code editor toggle
    socket.on("toggleCodeEditor", ({ userId, targetUserId, isVisible }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("codeEditorToggled", { isVisible });
      console.log(`Code editor toggled in room ${roomId}: ${isVisible}`);
    });

    // Handle real-time code changes
    socket.on("codeChange", ({ userId, targetUserId, code, cursorPosition }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("codeChanged", { 
        newCode: code, 
        cursorPosition 
      });
    });

    // Handle language changes
    socket.on("languageChange", ({ userId, targetUserId, language }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("languageChanged", { newLanguage: language });
    });

    // Handle cursor movement
    socket.on("cursorMove", ({ userId, targetUserId, cursorPosition }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("cursorMoved", { cursorPosition });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;