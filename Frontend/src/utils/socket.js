import { io } from "socket.io-client";

const serverUrl = "https://linkedin-full-stack.onrender.com";

export const socket = io(serverUrl, { withCredentials: true });

export const registerSocket = (userId) => {
  if (userId) {
    socket.emit("register", userId); // send plain string (backend now accepts this)
  }
};
