const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || "http://localhost:5173"],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ room }) => {
      if (room) {
        socket.join(room);
      }
    });

    socket.on("leave", ({ room }) => {
      if (room) {
        socket.leave(room);
      }
    });

    socket.on("disconnect", () => {
      // Client disconnected
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
};

module.exports = { initSocket, getIo };
