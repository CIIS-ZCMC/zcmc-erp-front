import { create } from "zustand";

const useFunctionTypesStore = create((set) => ({
    function_types: [] || null,

    actions: {
        setFunctionTypes: (function_types) => set({ function_types }),
        clearFunctionTypes: () => set({ function_types: [] })
    }

}))

export default useFunctionTypesStore

export const useFunctionTypes = () =>
    useFunctionTypesStore((state) => state.function_types);

export const useFunctionTypesActions = () =>
    useFunctionTypesStore((state) => state.actions);