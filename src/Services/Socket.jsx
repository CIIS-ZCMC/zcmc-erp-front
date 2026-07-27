import { io } from "socket.io-client";
import { BASE_URL } from "./Config";

const SOCKET_URL =
  BASE_URL.socket_production ||
  BASE_URL.socket_development ||
  "http://localhost:3025/";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

const BASE_ENDPOINT = "erp";
export const SOCKET_ENDPOINT = {
  notifications: `${BASE_ENDPOINT}-notifications`,
};

// Listen to events
export const listenToEvent = (event, callback) => {
  socket.on(event, callback);
};

// Emit events
export const emitToEvent = (event, data) => {
  socket.emit(event, data);
};

// Remove listeners
export const removeListener = (event, callback) => {
  socket.off(event, callback);
};

// Explicit connect/disconnect helpers
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};