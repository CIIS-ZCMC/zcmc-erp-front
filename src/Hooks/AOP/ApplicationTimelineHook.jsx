import { create } from "zustand";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useApplicationTimelineHook = create((set) => ({
  applicationTimeline: [],

  actions: {
    getApplicationTimelineById: (id, callback) => {
      set({ isLoading: true });

      read({
        url: `${API.APPLICATION_TIMELINE}/${id}`,
        failed: () => {
          callback();
          set({ isLoading: false });
        },
        success: (response) => {
          const { data, message } = response.data;

          set({ applicationTimeline: data, isLoading: false });

          callback(response.status, message, data);
        },
      });
    },
  },
}));

export const useApplicationTimeline = () =>
  useApplicationTimelineHook((state) => state.applicationTimeline);

export const useApplicationTimelineActions = () =>
  useApplicationTimelineHook((state) => state.actions);
