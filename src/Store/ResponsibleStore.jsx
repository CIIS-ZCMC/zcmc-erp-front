import { create } from 'zustand';

const useResponsibleStore = create((set, get) => ({
    responsiblePeople: [],

    actions: {
        setResponsiblePeople: (responsible) => {
            set((state) => {
                const currentList = [...state.responsiblePeople];
                const newItems = Array.isArray(responsible)
                    ? personOrArray
                    : [responsible];

                const merged = [
                    ...currentList,
                    ...newItems.filter(
                        (item) => !currentList.some((p) => p.id === item.id)
                    ),
                ];

                console.log('Updated responsible people list:', merged);
                return { responsiblePeople: merged };
            });
        },

        clearResponsiblePeople: () => set({ responsiblePeople: [] })
    }

}))

export default useResponsibleStore;

export const useResponsiblePeopleActions = () => useResponsibleStore((state) => state.actions)
