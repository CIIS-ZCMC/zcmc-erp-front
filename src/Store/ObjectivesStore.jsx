import { create } from "zustand";

const useObjectivesStore = create((set, get) => ({
  objectives: [],
  functionType: null,
  objective: null,
  successIndicator: null,

  actions: {
    setObjectives: (objectives) => set({ objectives }),
    setFunctionType: (functionType) => set({ functionType }),
    setObjective: (objective) => set({ objective }),
    setSuccessIndicator: (successIndicator) => set({ successIndicator }),

    // clear individual fields
    clearFunctionType: () => set({ functionType: "" }),
    clearObjective: () => set({ objective: "" }),
    clearSuccessIndicator: () => set({ successIndicator: "" }),

    //clear all fields
    clearFields: () => {
      const { clearFunctionType, clearObjective, clearSuccessIndicator } = get().actions;
      clearFunctionType();
      clearObjective();
      clearSuccessIndicator();
    },
  }

}))

export default useObjectivesStore

export const useObjectives = () => useObjectivesStore((state) => state.objectives);
export const useFunctionType = () => useObjectivesStore((state) => state.functionType);
export const useObjective = () => useObjectivesStore((state) => state.objective);
export const useSuccessIndicator = () => useObjectivesStore((state) => state.successIndicator);
export const useObjectivesActions = () => useObjectivesStore((state) => state.actions);
