// src/Hooks/Socket/SocketHook.jsx
import { create } from "zustand";
import { socket } from "../../Services/Socket";

const useSocketStore = create((set) => {
  // Bind connection lifecycle listeners to keep store in sync
  if (socket) {
    socket.on("connect", () => {
      set({ connected: true, isConnecting: false, error: null });
    });

    socket.on("disconnect", () => {
      set({ connected: false, isConnecting: false });
    });

    socket.on("connect_error", (err) => {
      set({
        connected: false,
        isConnecting: false,
        error: err?.message || "Connection error",
      });
    });

    socket.on("reconnect", () => {
      set({ connected: true, isConnecting: false, error: null });
    });
  }

  return {
    socket,
    connected: socket ? socket.connected : false,
    isConnecting: false,
    error: null,

    connect: () => {
      if (socket && !socket.connected) {
        set({ isConnecting: true });
        socket.connect();
      }
    },

    disconnect: () => {
      if (socket && socket.connected) {
        socket.disconnect();
        set({ connected: false, isConnecting: false });
      }
    },

    emit: (event, data) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
  };
});

export const useSocketStatus = () => {
  const connected = useSocketStore((state) => state.connected);
  const isConnecting = useSocketStore((state) => state.isConnecting);
  const error = useSocketStore((state) => state.error);
  return { connected, isConnecting, error };
};

export default useSocketStore;

