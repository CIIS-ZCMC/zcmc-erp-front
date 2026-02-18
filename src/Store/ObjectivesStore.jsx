import { create } from "zustand";

const useObjectivesStore = create((set, get) => ({
  objectives: [],
  isLoading: false,
  isObjLoading: false,
  isIndicatorLoading: false,
  isBtnLoading: false,
  isShowLoading: false,
  aopApplication: {},
  objectiveByType: [],
  successIndicatorByObjective: [],

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
    setIsObjectiveLoading: (isObjLoading) => set({ isObjLoading }),
    setIsIndicatorLoading: (isIndicatorLoading) => set({ isIndicatorLoading }),
    setIsShowLoading: (isShowLoading) => set({ isShowLoading }),
    setIsBtnLoading: (isBtnLoading) => set({ isBtnLoading }),
    setAopApplication: (aopApplication) => set({ aopApplication }),

    setObjectiveByType: (objectiveByType) => set({ objectiveByType }),
    setSuccessIndicatorByObjective: (successIndicatorByObjective) =>
      set({ successIndicatorByObjective }),

    setApplicationObjectives: (applicationObjectives) =>
      set({ applicationObjectives }),
    setApplicationObjective: (applicationObjective) =>
      set({ applicationObjective }),

    setFunctionType: (functionType) => set({ functionType }),
    setObjective: (objective) => set({ objective }),
    setSuccessIndicator: (successIndicator) => set({ successIndicator }),

    setOtherObjective: (otherObjective) => set({ otherObjective }),
    setOtherSuccessIndicator: (otherSuccessIndicator) =>
      set({ otherSuccessIndicator }),

    clearFields: () =>
      set({
        functionType: null,
        objective: null,
        successIndicator: null,

        objectiveByType: [],
        successIndicatorByObjective: [],

        otherObjective: null,
        otherSuccessIndicator: null,
      }),
  },
}));

export default useObjectivesStore;

export const useObjectives = () =>
  useObjectivesStore((state) => state.objectives);
export const useIsLoading = () =>
  useObjectivesStore((state) => state.isLoading);
export const useIsObjLoading = () =>
  useObjectivesStore((state) => state.isObjLoading);
export const useIsIndicatorLoading = () =>
  useObjectivesStore((state) => state.isIndicatorLoading);
export const useIsShowLoading = () =>
  useObjectivesStore((state) => state.isShowLoading);
export const useIsBtnLoading = () =>
  useObjectivesStore((state) => state.isBtnLoading);
export const useAopApplication = () =>
  useObjectivesStore((state) => state.aopApplication);

export const useApplicationObjectives = () =>
  useObjectivesStore((state) => state.applicationObjectives);
export const useApplicationObjective = () =>
  useObjectivesStore((state) => state.applicationObjective);

export const useFunctionType = () =>
  useObjectivesStore((state) => state.functionType);
export const useObjective = () =>
  useObjectivesStore((state) => state.objective);
export const useSuccessIndicator = () =>
  useObjectivesStore((state) => state.successIndicator);
export const useOtherObjective = () =>
  useObjectivesStore((state) => state.otherObjective);
export const useOtherSuccessIndicator = () =>
  useObjectivesStore((state) => state.otherSuccessIndicator);
export const useObjectivesActions = () =>
  useObjectivesStore((state) => state.actions);
export const useObjectiveByType = () =>
  useObjectivesStore((state) => state.objectiveByType);
export const useSuccessIndicatorByObjective = () =>
  useObjectivesStore((state) => state.successIndicatorByObjective);
