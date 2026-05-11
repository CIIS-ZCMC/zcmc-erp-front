import { create } from "zustand";

const useResponsibleStore = create((set, get) => ({
  responsiblePeople: [],
  selectedPeople: [],
  isSubmitting: false,
  isDeleting: false,

  actions: {
    setResponsiblePeople: (responsiblePeople) => set({ responsiblePeople }),

    setSelectedPeople: (responsible) => {
      set((state) => {
        const currentList = state.selectedPeople?.filter(Boolean) || [];
        const newItems = Array.isArray(responsible)
          ? responsible.filter(Boolean)
          : responsible
            ? [responsible]
            : [];

        // Only proceed if we have valid items
        if (newItems.length === 0) return state;

        const merged = [
          ...currentList,
          ...newItems.filter(
            (item) => item && !currentList.some((p) => p.id === item.id),
          ),
        ];

        console.log("Updated responsible people list: ", merged);
        return { selectedPeople: merged };
      });
    },

    removeResponsiblePerson: (id) => {
      set((state) => {
        // Check if the list exists and has items
        if (!state.selectedPeople || state.selectedPeople.length === 0) {
          console.warn("No responsible people to remove.");
          return state; // Do nothing
        }

        return {
          selectedPeople: state.selectedPeople.filter((p) => p.id !== id),
        };
      });
    },

    clearResponsiblePeople: () => set({ responsiblePeople: [] }),
    clearSelectedPeople: () => set({ selectedPeople: [] }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),
  },
}));

export default useResponsibleStore;

export const useResponsiblePeopleActions = () =>
  useResponsibleStore((state) => state.actions);
