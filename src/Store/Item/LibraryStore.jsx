import { create } from "zustand";

const useLibraryStore = create((set, get) => ({

    name: "",
    classification: "",
    category: "",
    variant: "",
    unitOfMeasurement: "",
    estimateBudget: "",
    specs: []

}))

export default useLibraryStore;
