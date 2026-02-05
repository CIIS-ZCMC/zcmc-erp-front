import { nextYear } from "../Utils/Functions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAOPStore = create(
  persist(
    (set) => ({
      aop: null,
      mission: "",
      fiscalYear: nextYear,
      yearDetails: [],
      aopChecklist: null,

      actions: {
        setAop: (aop) => set({ aop }),
        setMission: (mission) => set({ mission }),
        setFiscalYear: (fiscalYear) => set({ fiscalYear }),
        setAopCheckList: (aopChecklist) => set({ aopChecklist }),
        setYears: (yearDetails) => set({ yearDetails }),

        clearMission: () => set({ mission: "" }),

        resetAll: () => ({
          aop: null,
          mission: "",
          fiscalYear: nextYear,
          yearDetails: [],
          aopChecklist: null,
        }),
      },
    }),
    {
      name: "aop-storage",
      partialize: (state) => ({
        aop: state.aop,
        fiscalYear: state.fiscalYear,
      }),
    },
  ),
);

export default useAOPStore;

export const useAop = () => useAOPStore((state) => state.aop);
export const useAOPActions = () => useAOPStore((state) => state.actions);
