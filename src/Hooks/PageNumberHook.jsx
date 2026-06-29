import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePageNumberHook = create(
  persist(
    (set) => ({
      pages: {},

      setPage: (key, page) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [key]: page,
          },
        })),

      getPage: (key) => 1,

      resetPage: (key) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [key]: 1,
          },
        })),

      clearAllPages: () => set({ pages: {} }),
    }),
    {
      name: "pagination-storage",
    },
  ),
);

export default usePageNumberHook;
