// src/store/useSocketStore.js
import { create } from "zustand";
import { socket } from "../../Services/Socket";

const useSocketStore = create((set, get) => ({
  socket,
  connected: false,

  connect: () => {
    if (!get().connected) {
      socket.connect();
      set({ connected: true });
    }
  },

  disconnect: () => {
    socket.disconnect();
    set({ connected: false });
  },
}));

export default useSocketStore;
