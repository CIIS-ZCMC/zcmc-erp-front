import { create } from "zustand";

const useObjectivesStore = create((set) => ({
    mission: "",
    functionType: "",
    objective: "",
    successIndicator: "",

    actions: {
        setMission: (mission) => set({ mission }),
        clearMission: () => set({ mission: "" }),
        setFunctionType: (functionType) => set({ functionType }),
        setObjective: (objective) => set({ objective }),
        setSuccessIndicator: (successIndicator) => set({ successIndicator }),
    }

}))

export default useObjectivesStore

export const useMission = () => useObjectivesStore((state) => state.mission)
export const useFunctionType = () => useObjectivesStore((state) => state.functionType)
export const useObjective = () => useObjectivesStore((state) => state.objective)
export const useSuccessIndicator = () => useObjectivesStore((state) => state.successIndicator)
export const useObjectivesActions = () => useObjectivesStore((state) => state.actions)