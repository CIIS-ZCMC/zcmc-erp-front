import { create } from "zustand";

const useObjectivesStore = create((set, get) => ({
  objectives: [],
  isLoading: false,
  aopApplication: {},

  applicationObjectives: [], //application objectives
  applicationObjective: null, //single application objective

  functionType: null,
  objective: null,
  successIndicator: null,

  otherObjective: null,
  otherSuccessIndicator: null,

  actions: {
    setObjectives: (objectives) => set({ objectives }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setAopApplication: (aopApplication) => set({ aopApplication }),

    setApplicationObjectives: (applicationObjectives) => set({ applicationObjectives }),
    setApplicationObjective: (applicationObjective) => set({ applicationObjective }),

    setFunctionType: (functionType) => set({ functionType }),
    setObjective: (objective) => set({ objective }),
    setSuccessIndicator: (successIndicator) => set({ successIndicator }),

    setOtherObjective: (otherObjective) => set({ otherObjective }),
    setOtherSuccessIndicator: (otherSuccessIndicator) => set({ otherSuccessIndicator }),

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
export const useIsLoading = () => useObjectivesStore((state) => state.isLoading);
export const useAopApplication = () => useObjectivesStore((state) => state.aopApplication);

export const useApplicationObjectives = () => useObjectivesStore((state) => state.applicationObjectives);
export const useApplicationObjective = () => useObjectivesStore((state) => state.applicationObjective);

export const useFunctionType = () => useObjectivesStore((state) => state.functionType);
export const useObjective = () => useObjectivesStore((state) => state.objective);
export const useSuccessIndicator = () => useObjectivesStore((state) => state.successIndicator);
export const useOtherObjective = () => useObjectivesStore((state) => state.otherObjective)
export const useOtherSuccessIndicator = () => useObjectivesStore((state) => state.otherSuccessIndicator)
export const useObjectivesActions = () => useObjectivesStore((state) => state.actions);
