import { create } from 'zustand';

const useTimelinesStore = create((set) => ({
    timelines: [],
    approverTimelines: [],

    isLoading: false,

    actions: {
        setTimelines: (timelines) => set({ timelines }),
        setApproverTimelines: (approverTimelines) => set({ approverTimelines }),
        setIsLoading: (isLoading) => set({ isLoading })
    }
}))

export default useTimelinesStore;

export const useTimelinesActions = () =>
    useTimelinesStore((state) => state.actions);