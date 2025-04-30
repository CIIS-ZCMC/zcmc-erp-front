import { create } from "zustand";

const useResponsiblePeopleHook = create((set, get) => ({
    responsible_people: [],

    selectedResponsibleValue: {
        users: [],
        designations: [],
        areas: [],
        isAssigned: false,
    },

    setAssignmentStatus: (activityIndex, status) => {
        set((state) => {
            const updated = state.responsible_people.map((item) => {
                if (item.activity_index === activityIndex) {
                    return {
                        ...item,
                        isAssigned: status
                    };
                }
                return item;
            });

            return {
                responsible_people: updated
            };
        });
    },

    //add activity row index/id basta unique identifier
    addActivityIndex: (rowId) => {
        const { responsible_people, selectedResponsibleValue } = get();

        const exists = responsible_people.some(item => item.activity_index === rowId);

        if (!exists) {
            set({
                responsible_people: [
                    ...responsible_people,
                    {
                        activity_index: rowId,
                        ...selectedResponsibleValue,
                        isAssigned: false
                    }
                ]
            });
        }
    },

    //handle select value for users, designation and areas 
    handleValue: (activityIndex, key, value) => {
        set((state) => {
            const updated = state.responsible_people.map(item => {
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
                responsible_people: updated
            };
        });
    },

    removeData: (id, key, activityIndex) => set((state) => {
        const updatedResponsiblePeople = state.responsible_people.map((activity) => {

            if (activity.activity_index !== activityIndex) return activity;

            return {
                ...activity,
                [key]: activity[key]?.filter((item) => item.id !== id) || []
            };
        });

        return {
            responsible_people: updatedResponsiblePeople
        };
    }),

    // reset value of responsible person selected values
    resetValues: (activityIndex) => {
        const { isAssigned, responsible_people } = get()

        if (isAssigned) return

        const updated = responsible_people.map((activity) => {
            if (activity.activity_index === activityIndex) {
                return {
                    ...activity,
                    users: [],
                    designations: [],
                    areas: []
                };
            }
            return activity;
        });

        set({ responsible_people: updated });

    },

    // setActivityIndex: (row) => {
    //     set((state) => {
    //         const { responsible_people } = state;

    //         const exists = responsible_people?.every(element => element.activity_index === row);

    //         if (!exists) {
    //             return {
    //                 responsible_people: {
    //                     activity_index: `${row}-1`,
    //                     ...state.selectedResponsibleValue,
    //                 },

    //             }
    //         }
    //     })
    // },

}));

export const addActivityIndexHook = () => useResponsiblePeopleHook(state => state.addActivityIndex)
export default useResponsiblePeopleHook;