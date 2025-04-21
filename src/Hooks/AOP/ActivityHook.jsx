import { create } from "zustand";
import erp_api from "../../Services/ERP_API";

const useActivityHook = create((set) => ({
  activity: null,
  UIStates: {
    activeActivity: null,
  },
  actions: {
    setActiveActivity: (data) => {
      console.log("rendered");
      set((state) => ({
        UIStates: { ...state.UIStates, activeActivity: data },
      }));
    },
    getActivityById: (id, callback) => {
      return erp_api
        .get(`/show-objective-activity/${id}`)
        .then((response) => {
          const { data } = response.data;
          set({ activity: data });

          callback(response.status, data);
        })
        .catch((error) => {
          console.error("Error fetching activity:", error);
          return callback(
            error?.status || 500,
            error?.response || "Unknown error occurred"
          );
        });
    },
  },
}));

export const useActivity = () => useActivityHook((state) => state.activity);
export const useActivityUIStates = () =>
  useActivityHook((state) => state.UIStates);

export const useActivityActions = () =>
  useActivityHook((state) => state.actions);
