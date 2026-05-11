import { create } from "zustand";

const useActivitiesStore = create((set, get) => ({
  applicationActivities: {},
  applicationActivity: null,
  aopApplication: {},

  isEditLoading: false,
  isCreateLoading: false,
  isUpdateLoading: false,

  activity: null,
  cost: null,
  startMonth: null,
  endMonth: null,
  isGadRelated: false,

  target: {
    firstQuarter: "",
    secondQuarter: "",
    thirdQuarter: "",
    fourthQuarter: "",
  },

  actions: {
    setApplicationActivities: (applicationActivities) =>
      set({ applicationActivities }),
    setApplicationActivity: (applicationActivity) =>
      set({ applicationActivity }),

    setIsEditLoading: (isEditLoading) => set({ isEditLoading }),
    setIsCreateLoading: (isCreateLoading) => set({ isCreateLoading }),
    setIsUpdateLoading: (isUpdateLoading) => set({ isUpdateLoading }),

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
          firstQuarter: "",
          secondQuarter: "",
          thirdQuarter: "",
          fourthQuarter: "",
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
