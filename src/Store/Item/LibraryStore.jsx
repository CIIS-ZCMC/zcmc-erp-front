import { create } from "zustand";

const useItemLibraryStore = create((set) => ({
    itemName: '',
    classification: {},
    category: {},
    unit: {},
    variant: {},
    marketResearched: false,
    estimatedBudget: null,
    specification: [],
    isLoading: false,

    actions: {
        setItemName: (itemName) => set({ itemName }),
        setClassification: (classification) => set({ classification }),
        setCategory: (category) => set({ category }),
        setUnit: (unit) => set({ unit }),
        setVariant: (variant) => set({ variant }),
        setMarketResearched: (marketResearched) => set({ marketResearched }),
        setEstimatedBudget: (estimatedBudget) => set({ estimatedBudget }),
        setSpecification: (specification) => set({ specification }),
        setIsLoading: (isLoading) => set({ isLoading })
    }
}))

export default useItemLibraryStore;

export const useItemLibraryActions = () =>
    useItemLibraryStore((state) => state.actions);