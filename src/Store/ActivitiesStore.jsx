import { create } from "zustand";

const useActivitiesStore = create((set, get) => ({
  applicationActivities: {},
  applicationActivity: null,
  aopApplication: {},

  activity: null,
  cost: null,
  startMonth: null,
  endMonth: null,
  isGadRelated: false,

  target: {
    firstQuarter: null,
    secondQuarter: null,
    thirdQuarter: null,
    fourthQuarter: null,
  },

  actions: {
    setApplicationActivities: (applicationActivities) =>
      set({ applicationActivities }),
    setApplicationActivity: (applicationActivity) =>
      set({ applicationActivity }),

    setActivity: (activity) => set({ activity }),
    setCost: (cost) => set({ cost }),
    setStartMonth: (startMonth) => set({ startMonth }),
    setEndMonth: (endMonth) => set({ endMonth }),
    setIsGadRelated: (isGadRelated) => set({ isGadRelated }),

    setTarget: (target) => {
      set((state) => {
        return {
          target: { ...state.target, ...target },
        };
      });
    },

    clearActivity: () => set({ activity: null }),
    clearStartMonth: () => set({ startMonth: null }),
    clearEndMonth: () => set({ endMonth: null }),
    clearIsGadRelated: () => set({ isGadRelate: false }),
    clearTarget: () =>
      set({
        target: {
          firstQuarter: null,
          secondQuarter: null,
          thirdQuarter: null,
          fourthQuarter: null,
        },
      }),

    clearFields: () => {
      const {
        clearActivity,
        clearStartMonth,
        clearEndMonth,
        clearIsGadRelated,
        clearTarget,
      } = get().actions;
      clearActivity();
      clearStartMonth();
      clearEndMonth();
      clearIsGadRelated();
      clearTarget();
    },
  },
}));

export default useActivitiesStore;

export const useActivitiesActions = () =>
  useActivitiesStore((state) => state.actions);
