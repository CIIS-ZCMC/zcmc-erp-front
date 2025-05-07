import { create } from "zustand";
import { NOTIFICATIONS } from "../Data/TestData";

const useNotificationsHook = create((set) => ({
  notifications: NOTIFICATIONS ?? [],

  getNotifications: (id, callback) => {
    // FUNCTION HERE
  },
}));

export const useNotifications = () =>
  useNotificationsHook((state) => state.notifications);
