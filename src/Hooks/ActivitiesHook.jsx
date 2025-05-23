import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { setNestedValue } from "../Utils/SetNestedValue";

const initialActivity = (rowId = 1, parentId = null) => ({
    id: uuid(),
    parentId: parentId,
    rowId: rowId,
    name: "",
    isGadRelated: false,
    cost: 0,
    startMonth: "",
    endMonth: "",
    target: {
        firstQuarter: "",
        secondQuarter: "",
        thirdQuarter: "",
        fourthQuarter: "",
    },
});

const useActivitiesHook = create(
    persist(
        (set, get) => ({
            activities: [],
            initialRender: true,

            //Update specific field in an activity row
            updateActivityField: (id, fieldPath, value) => {
                set((state) => ({
                    activities: state.activities.map((activity) => {
                        if (activity.id === id) {
                            return setNestedValue(activity, fieldPath, value);
                        }
                        return activity;
                    }),
                }));
            },

            //add activity Row
            addActivity: (parentId = null) => {
                const current = get().activities;
                set((state) => ({
                    activities: [
                        ...state.activities,
                        initialActivity(
                            current.filter((item) => item.parentId == parentId).length + 1,
                            parentId
                        ),
                    ],
                    initialRender: false,
                }));
            },

            setInitialRender: (value) => set({ initialRender: value }),

            removeActivity: (id) => {
                const activities = get().activities;

                const filtered = activities.filter((item) => item.id !== id);

                const groupedByParent = {};

                filtered.forEach((item) => {
                    if (!groupedByParent[item.parentId]) {
                        groupedByParent[item.parentId] = [];
                    }
                    groupedByParent[item.parentId].push(item);
                });

                const newActivities = Object.values(groupedByParent)
                    .flatMap((group) =>
                        group.map((item, index) => ({
                            ...item,
                            rowId: index + 1,
                        }))
                    );

                set({ activities: newActivities });
            },


            findActivitiesByObjectiveID: (objID) => {
                return get().activities.filter((item) => item.parentId == objID);
            },
        }),
        {
            name: "activities-storage",
            getStorage: () => localStorage,
        }
    )
);

export default useActivitiesHook;
