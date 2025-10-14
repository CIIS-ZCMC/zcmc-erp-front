import { create } from "zustand";

const useObjectivesStore = create((set) => ({
    mission: "",

    actions: {
        setMission: (mission) => set({ mission }),
        clearMission: () => set({ mission: "" })
    }

}))

export default useObjectivesStore

export const useMission = () => useObjectivesStore((state) => state.mission)
export const useObjectivesActions = () => useObjectivesStore((state) => state.actions)