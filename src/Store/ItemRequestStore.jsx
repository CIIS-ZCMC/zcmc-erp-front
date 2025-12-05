import { create } from "zustand";

const useItemRequestStore = create((set) => ({
    requests: [],
    isLoading: false,

    actions: {
        setRequests: (requests) => set({ requests }),
        setIsLoading: (isLoading) => set({ isLoading })
    }
}))

export default useItemRequestStore;

export const useItemRequestActions = () =>
    useItemRequestStore((state) => state.actions);

export const useItemRequestLoading = () =>
    useItemRequestStore((state) => state.isLoading);