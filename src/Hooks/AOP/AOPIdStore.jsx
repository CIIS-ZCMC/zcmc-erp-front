// Store/useAOPIdStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAOPIdStore = create(
  persist(
    (set) => ({
      aopId: null,
      objectiveId: null,
      activityId: null,

      setAopId: (id) => set({ aopId: id }),
      setObjectiveId: (id) => set({ objectiveId: id }),
      setActivityId: (id) => set({ activityId: id }),

      clearAOP: () => set({ aopId: null, objectiveId: null, activityId: null }),
    }),
    {
      name: "aop-ids", // stored in localStorage
    }
  )
);

export default useAOPIdStore;
