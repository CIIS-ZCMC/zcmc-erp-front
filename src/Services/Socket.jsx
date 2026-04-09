import { io } from "socket.io-client";
import { SOCKET_URL } from "./Config";

export const socket = io(SOCKET_URL, (attempt) => {
  console.log(attempt);
});

const BASE_ENDPOINT = "erp";
export const SOCKET_ENDPOINT = {
  notifications: `${BASE_ENDPOINT}-notifications`,
};

//listen to events
export const listenToEvent = (event, callback) => {
  socket.on(event, callback);
};

//emit to events
export const emitToEvent = (event, data) => {
  socket.emit(event, callback)
};

//remove listeners
export const removeListener = (event, callback) => {
  socket.off(event, callback)
}