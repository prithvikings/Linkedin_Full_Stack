import { io } from "socket.io-client";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const socket = io(serverUrl, { withCredentials: true });

export const registerSocket = (userId) => {
  if (userId) {
    socket.emit("register", userId); // send plain string (backend now accepts this)
  }
};
