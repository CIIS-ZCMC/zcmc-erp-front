import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { persist } from "zustand/middleware";

const useActivityHook = create(
  persist(
    (set) => ({
      activity: null,
      isLoading: false,
      resources: [],
      activityStates: {
        objectiveNumber: 1,
        activityNumber: 1,
      },

      UIStates: {
        activeActivity: null,
      },
      actions: {
        setActiveActivity: (data) => {
          set((state) => ({
            UIStates: { ...state.UIStates, activeActivity: data },
          }));
        },

        getActivityById: (id, callback) => {
          set({ isLoading: true });

          read({
            url: `${API.SHOW_OBJECTIVE}/${id}`,
            failed: () => {
              callback();
              set({ isLoading: false });
            },
            success: (response) => {
              const {
                data,
                data: { resources },
              } = response.data;

              set({ activity: data, resources: resources, isLoading: false });

              callback(response.status, data);
            },
          });
        },

        markAsReviewed: (activity_id, callback) => {
          post({
            url: `/activities/${activity_id}/mark-reviewed`,

            success: (response) => {
              const { message } = response.data;
              callback(response.status, message);
            },
            failed: () => {
              callback();
              set({ isLoading: false });
            },
          });
        },

        markAsUnreviewed: (activity_id, callback) => {
          post({
            url: `/activities/${activity_id}/mark-unreviewed`,
            success: (response) => {
              const { message } = response.data;
              callback(response.status, message);
            },
            failed: () => {
              callback();
              set({ isLoading: false });
            },
          });
        },

        markAllAsReviewed: (aop_id, callback) => {
          post({
            url: `/mark-all-reviewed/${aop_id}`,
            success: (response) => {
              const { message } = response.data;
              callback(response.status, message);
            },
            failed: () => {
              callback();
              set({ isLoading: false });
            },
          });
        },

        markAllAsUnreviewed: (aop_id, callback) => {
          post({
            url: `/mark-all-unreviewed/${aop_id}`,
            success: (response) => {
              const { message } = response.data;
              callback(response.status, message);
            },
            failed: () => {
              callback();
              set({ isLoading: false });
            },
          });
        },

        // ---------------------------------------------------
        // CLEAR ACTIVITY STORE
        // ---------------------------------------------------
        clearActivityStore: () => {
          set({
            activity: null,
            resources: [],
            activityStates: { objectiveNumber: 1, activityNumber: 1 },
            UIStates: { activeActivity: null },
            isLoading: false,
          });
        },
      },
    }),
    {
      name: "activeActivity",
      partialize: (state) => ({
        UIStates: { activeActivity: state.UIStates.activeActivity },
      }), // only persist UIStates.activeActivity, not actions
    },
  ),
);

export const useActivity = () => useActivityHook((state) => state.activity);
export const useActivityLoadingState = () =>
  useActivityHook((state) => state.isLoading);
export const useResources = () => useActivityHook((state) => state.resources);
export const useActivityStates = () =>
  useActivityHook((state) => state.activityStates);

export const useActivityUIStates = () =>
  useActivityHook((state) => state.UIStates);

export const useActivityActions = () =>
  useActivityHook((state) => state.actions);
