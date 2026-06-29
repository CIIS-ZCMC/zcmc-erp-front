import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSwitchViewHook = create(
  persist(
    (set) => ({
      isCard: true,

      setIsCard: (value) =>
        set({
          isCard: value,
        }),

      toggleView: () =>
        set((state) => ({
          isCard: !state.isCard,
        })),
    }),
    {
      name: "view-storage",
    },
  ),
);

export default useSwitchViewHook;
