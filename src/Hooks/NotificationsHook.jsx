// src/hooks/useNotifications.js
import { create } from "zustand";
import useSocketStore from "./Socket/SocketHook";
import { NOTIFICATIONS } from "../Data/TestData";
import { useAuth } from "../Store/AuthStore";
import { useEffect } from "react";

// Zustand store
const useNotificationsHook = create((set) => ({
  // notifications: NOTIFICATIONS ?? [],
  notifications: [],

  // Store actions
  addNotification: (newNotification) =>
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    })),

  getNotifications: () => {
    // Placeholder for API fetch logic
  },
}));

// Hook to read notifications
export const useNotifications = () =>
  useNotificationsHook((state) => state.notifications);

// Hook to register for socket events
export const useNotificationEvents = () => {
  const { socket } = useSocketStore();
  const addNotification = useNotificationsHook(
    (state) => state.addNotification
  );

  const { user } = useAuth();

  useEffect(() => {
    if (socket && user) {
      socket.on(`erp-notification-${user.id}`, (data) => {
        addNotification(data);
        console.log(data);
      });
    }

    return () => {
      socket.off(`erp-notification-${user.id}`);
    };
  }, [socket]);
};
