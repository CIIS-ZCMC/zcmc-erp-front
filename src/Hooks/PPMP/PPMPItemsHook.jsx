import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePPMPTotalStore = create(
  persist(
    (set) => ({
      ppmpTotal: 0,
      setPPMPTotal: (newTotal) => set({ ppmpTotal: newTotal }),
      reset: () => set({ ppmpTotal: 0 }),
    }),
    {
      name: "ppmp-total-storage", // 🔐 localStorage key
    }
  )
);
