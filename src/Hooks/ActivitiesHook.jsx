import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from 'uuid';

import { setNestedValue } from "../Utils/SetNestedValue";

const initialActivity = (rowId = 1, parentId = null) => ({
    id: uuid(),
    parentId: parentId,
    rowId: rowId,
    name: '',
    isGadRelated: false,
    cost: 0,
    startMonth: '',
    endMonth: '',
    target: {
        firstQuarter: '',
        secondQuarter: '',
        thirdQuarter: '',
        fourthQuarter: '',
    },
});

const useActivitiesHook = create(
    persist(
        (set) => ({
            activities: [],

            //Update specific field in an activity row
            updateActivityField: (id, fieldPath, value) => {
                set((state) => ({
                    activities: state.activities.map((activity) => {
                        if (activity.id === id) {
                            return setNestedValue(activity, fieldPath, value);
                        }
                        return activity;
                    }
                    ),
                }));
            },

            //add activity Row
            addActivity: (parentId = null) => {
                set((state) => ({
                    activities: [...state.activities,
                    initialActivity(
                        state.activities.length + 1,
                        parentId)
                    ]
                }))
            },
        }),
        {
            name: "activities-storage",
            getStorage: () => localStorage,
        }

    )
);

export default useActivitiesHook;
