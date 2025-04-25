import { create } from "zustand";


const useResponsiblePersonHook = create((set, get) => ({
    users: [],
    designations: [],
    areas: [],
    setData: (key, value) => {
        if (get()[key].find((item) => item.id === value.id)) return;

        set((state) => ({
            [key]: [...state[key], value]
        }))
    },
    removeData: (id, key) => set((state) => ({
        [key]: state[key].filter((data) => data.id !== id)
    }))
}));

export default useResponsiblePersonHook;