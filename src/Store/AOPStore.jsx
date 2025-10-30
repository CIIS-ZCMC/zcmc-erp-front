import { create } from "zustand";

const useAOPStore = create((set) => ({
    aop: null,
    mission: "",
    fiscalYear: new Date().getFullYear() + 1,

    aopChecklist: null,

    actions: {
        setAop: (aop) => set({ aop }),
        setMission: (mission) => set({ mission }),
        clearMission: () => set({ mission: "" }),
        setFiscalYear: (fiscalYear) => set({ fiscalYear }),
        setAopCheckList: (aopChecklist) => set({ aopChecklist })
    }

}))

export default useAOPStore;

export const useAop = () => useAOPStore((state) => state.aop);
export const useAOPActions = () => useAOPStore((state) => state.actions);