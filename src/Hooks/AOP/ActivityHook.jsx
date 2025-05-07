import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useActivityHook = create((set) => ({
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
            message,
          } = response.data;

          set({ activity: data, resources: resources, isLoading: false });

          callback(response.status, message, data);
        },
      });
    },

    markAsReviewed: (activity_id, callback) => {
      post({
        url: `/activities/${activity_id}/mark-reviewed`,

        success: (response) => {
          const { data, message } = response.data;
          console.log(data);
          callback(response.status, message);
        },
        failed: () => {
          callback();
          set({ isLoading: false });
        },
      });
    },
  },
}));

export const useActivity = () => useActivityHook((state) => state.activity);
export const useResources = () => useActivityHook((state) => state.resources);
export const useActivityStates = () =>
  useActivityHook((state) => state.activityStates);

export const useActivityUIStates = () =>
  useActivityHook((state) => state.UIStates);

export const useActivityActions = () =>
  useActivityHook((state) => state.actions);
