import { create } from "zustand";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useActivityHook = create((set) => ({
  activity: null,
  isLoading: false,
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
          const { data, message } = response.data;

          set({ activity: data, isLoading: false });

          callback(response.status, message, data);
        },
      });
    },
  },
}));

export const useActivity = () => useActivityHook((state) => state.activity);

export const useActivityStates = () =>
  useActivityHook((state) => state.activityStates);

export const useActivityUIStates = () =>
  useActivityHook((state) => state.UIStates);

export const useActivityActions = () =>
  useActivityHook((state) => state.actions);
