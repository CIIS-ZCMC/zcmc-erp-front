import { create } from 'zustand';

const useJobPositionStore = create((set) => ({
    jobPositions: [],

    actions: {
        setJobPositions: (jobPositions) => set({ jobPositions }),
        clearJobPositions: () => set({ jobPositions: [] })
    }
}))

export default useJobPositionStore;

export const useJobPositionActions = () =>
    useJobPositionStore((state) => state.actions)