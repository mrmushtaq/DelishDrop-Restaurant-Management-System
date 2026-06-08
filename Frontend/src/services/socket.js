import { io } from "socket.io-client";

let socket;

export const createSocket = (token) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
    transports: ["websocket"],
    auth: { token },
    withCredentials: true,
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err.message);
  });

  return socket;
};

export const joinRoom = (room) => {
  if (!socket) return;
  socket.emit("join", { room });
};

export const leaveRoom = (room) => {
  if (!socket) return;
  socket.emit("leave", { room });
};

export const getSocket = () => socket;
