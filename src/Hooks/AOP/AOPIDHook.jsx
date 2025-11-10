import { create } from "zustand";

const useAOPId = create((set) => ({
  aopId: null,
  objectiveId: null,
  activityId: null,

  // setters
  setAopId: (id) => set({ aopId: id }),
  setObjectiveId: (id) => set({ objectiveId: id }),
  setActivityId: (id) => set({ activityId: id }),

  // clear all when user exits AOP
  clearAOP: () => set({ aopId: null, objectiveId: null, activityId: null }),
}));

export default useAOPId;
