import { io } from "socket.io-client";
import { BASE_URL } from "./Config";

export const socket = io(BASE_URL.socket_development, (attempt) => {
  console.log(attempt);
});

const BASE_ENDPOINT = "erp";

export const SOCKET_ENDPOINT = {
  notifications: `${BASE_ENDPOINT}-notifications`,
};
