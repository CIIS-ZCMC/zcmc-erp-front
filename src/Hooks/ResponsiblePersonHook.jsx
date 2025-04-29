import { create } from "zustand";


const useResponsiblePersonHook = create((set, get) => ({
    responsible_persons: [],

    temp: {
        users: [],
        designations: [],
        areas: []
    },

    users: [],
    designations: [],
    areas: [],


    addActivityIndex: (row) => {
        const { responsible_persons, temp } = get();

        const exists = responsible_persons.some(item => item.activity_index === row);

        if (!exists) {
            set({
                responsible_persons: [
                    ...responsible_persons,
                    {
                        activity_index: row,
                        ...temp,
                    }
                ]
            });
        }
    },

    handleValue: (activityIndex, key, value) => {
        set((state) => {
            const updated = state.responsible_persons.map(item => {
                if (item.activity_index === activityIndex) {
                    // Prevent duplicate by ID
                    if (item[key].some(el => el.id === value.id)) return item;

                    return {
                        ...item,
                        [key]: [...item[key], value]
                    };
                }
                return item;
            });

            return {
                responsible_persons: updated
            };
        });
    },

    setActivityIndex: (row) => {
        set((state) => {
            const { responsible_persons } = state;

            const exists = responsible_persons?.every(element => element.activity_index === row);

            if (!exists) {
                return {
                    responsible_persons: {
                        activity_index: `${row}-1`,
                        ...state.temp,
                    },

                }
            }
        })
    },

    setData: (key, value) => {
        if (get()[key].find((item) => item.id === value.id)) return;

        set((state) => ({
            [key]: [...state[key], value]
        }))
    },
    removeData: (id, key) => set((state) => ({
        [key]: state[key].filter((data) => data.id !== id)
    })),

}));

export const addActivityIndexHook = () => useResponsiblePersonHook(state => state.addActivityIndex)
export default useResponsiblePersonHook;