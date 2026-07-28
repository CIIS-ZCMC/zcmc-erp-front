import { create } from "zustand";
import { useNotifications } from "./NotificationsHook";
import { useMemo } from "react";

// Zustand store for manual/API-driven sidebar badge counts
export const useSidebarBadgeStore = create((set) => ({
  badges: {},

  // Set badge count for a specific route path (e.g., "/planning-ops/approval", 5)
  setBadgeCount: (path, count) =>
    set((state) => ({
      badges: {
        ...state.badges,
        [path]: count,
      },
    })),

  // Clear badge count for a route
  clearBadge: (path) =>
    set((state) => {
      const newBadges = { ...state.badges };
      delete newBadges[path];
      return { badges: newBadges };
    }),

  // Reset all badges
  resetBadges: () => set({ badges: {} }),
}));

// Custom hook that combines notification-driven badges and store-driven badges
export const useRouteBadgeCount = (path) => {
  const manualBadges = useSidebarBadgeStore((state) => state.badges);
  const notifications = useNotifications();

  return useMemo(() => {
    // 1. Check if a manual badge count was set
    const manualCount = manualBadges[path] || 0;

    // 2. Count unread notifications matching this route path
    const notificationCount = notifications?.filter(
      (notif) =>
        notif.seen === 0 &&
        notif.module_path &&
        (notif.module_path === path || notif.module_path.startsWith(`${path}/`))
    ).length || 0;

    return manualCount + notificationCount;
  }, [manualBadges, notifications, path]);
};
