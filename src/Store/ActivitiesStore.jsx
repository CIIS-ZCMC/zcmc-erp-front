import { create } from 'zustand';

const useActivitiesStore = create((set, get) => ({

    applicationActivities: [],
    applicationActivity: null,

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
        setApplicationActivities: (applicationActivities) => set({ applicationActivities }),
        setApplicationAcivity: (applicationActivity) => set({ applicationActivity }),

        setActivity: (activity) => set({ activity }),
        setCost: (cost) => set({ cost }),
        setStartMonth: (startMonth) => set({ startMonth }),
        setEndMonth: (endMonth) => set({ endMonth }),
        setIsGadRelated: (isGadRelated) => set({ isGadRelated }),

        setTarget: (target) =>
            set((state) => ({
                target: { ...state.target, ...target },
            })),

        clearFields: () =>
            set({
                applicationActivities: [],
                applicationActivity: null,
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
            }),
    },

}))

export default useActivitiesStore;

export const useActivitiesActions = () => useActivitiesStore((state) => state.actions);