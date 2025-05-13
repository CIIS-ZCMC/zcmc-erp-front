import { create } from "zustand";

const useSidebarHook = create((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (value) => set({ isCollapsed: value }),
}));

export default useSidebarHook;
