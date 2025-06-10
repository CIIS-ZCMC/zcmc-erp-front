// src/hooks/useNotifications.js
import { create } from "zustand";
import useSocketStore from "./Socket/SocketHook";
import { useAuth } from "../Store/AuthStore";
import { useEffect } from "react";
import { read } from "../Services/RequestMethods";
import { NOTIFICATIONS } from "../Data/TestData";

// Zustand store
const useNotificationsHook = create((set) => ({
  notifications: NOTIFICATIONS ?? [],

  // notifications: [],

  // Store actions
  addNotification: (newNotification) =>
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    })),

  getNotifications: (id, callback) => {
    read({
      url: `notifications/employee-notifs/${id}`,
      failed: callback,
      success: (res) => {
        // console.log(res.data.data);
        set(() => ({ notifications: res.data.data }));
      },
    });
    // Placeholder for API fetch logic
  },

  actions: {
    seen: (id, callback) => {
      read({
        url: `notifications/seen/${id}`,
        failed: callback,
        success: (res) => {
          callback(200, res.data.data);

          set((state) => ({
            notifications: state.notifications.map((notif) =>
              notif.id === id ? { ...notif, seen: 1 } : notif
            ),
          }));
        },
      });
      // Placeholder for API fetch logic
    },

    markAllAsRead: (employeeProfileId, callback) => {
      read({
        url: `notifications/all-seen/${employeeProfileId}`,
        failed: callback,
        success: (res) => {
          callback(200, res.data.data);

          set((state) => ({
            notifications: state.notifications.map((notif) => ({
              ...notif,
              seen: 1,
            })),
          }));
        },
      });
      // Placeholder for API fetch logic
    },
  },
}));

// Hook to read notifications
export const useNotifications = () =>
  useNotificationsHook((state) => state.notifications);

// Hook to read notifications with a callback
export const useNotificationActions = () =>
  useNotificationsHook((state) => state.actions);

// Hook to register for socket events
export const useNotificationEvents = () => {
  const { socket } = useSocketStore();
  const addNotification = useNotificationsHook(
    (state) => state.addNotification
  );

  const fetchNotifications = useNotificationsHook(
    (state) => state.getNotifications
  );

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }

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

export const useUnseenCount = () => {
  const notifications = useNotificationsHook((state) => state.notifications);

  const unseenCount = notifications.filter((notif) => notif.seen === 0).length;

  return unseenCount;
};
