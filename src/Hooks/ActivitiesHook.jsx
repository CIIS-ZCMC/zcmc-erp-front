import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { post } from "../Services/RequestMethods";
import { setNestedValue } from "../Utils/SetNestedValue";

const NEXT_YEAR = new Date().getFullYear() + 1;
const DEFAULT_START_MONTH = `${NEXT_YEAR}-01`;

const initialActivity = (rowId = 1, parentId = null) => ({
    id: uuid(),
    parentId: parentId,
    rowId: rowId,
    name: "",
    isGadRelated: false,
    cost: 0,
    startMonth: DEFAULT_START_MONTH,
    endMonth: DEFAULT_START_MONTH,
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
            updatedActivities: [],
            initialRender: true,

            setActivities: (data) => {
                set(() => ({
                    activities: data
                }))
            },

            setUpdatedActivities: (data) => {
                set(() => ({
                    activities: data,
                }))
            },

            clearActivities: () => {
                set(() => ({
                    activities: []
                }));
            },

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
            addActivity: (parentId) => {
                // console.log(parentId)
                const current = get().activities;
                // console.log("Adding activity");
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

            updateCost: (parentId, cost) => {
                set((state) => ({
                    activities: state.activities.map((activity) => {
                        if (activity.id === parentId) {
                            return {
                                ...activity,
                                cost: cost,
                            };
                        }
                        return activity;
                    }),
                    initialRender: false,
                }));
            },

            setInitialRender: (value) => set({ initialRender: value }),

            removeItem: async (body, callback) => {
                post({
                    url: `check-pin`,
                    // param: { id: params },
                    form: body,
                    success: (response) => {
                        const { message, data } = response.data;
                        callback(response.status, message, data);
                    },
                    failed: callback,
                });
            },

            removeActivity: (id) => {
                console.log(id)
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
                return get().activities.filter((item) =>
                    item.parentId === objID
                );
            },
        }),
        {
            name: "activities-storage",
            getStorage: () => localStorage,
        }
    )
);

export default useActivitiesHook;
