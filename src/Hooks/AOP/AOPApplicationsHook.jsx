import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import { localStorageSetter } from "../../Utils/LocalStorage";
import { read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPApplicationsHook = create((set) => ({
  aopApplications: [],
  aopApplication: null,

  approvalTimeline: [],
  isLoading: false,

  actions: {
    // GET ALL AOP APPLICATIONS
    getAOPApplications: (callback) => {
      read({
        url: API.AOP_REQUESTS,
        failed: callback,
        success: (response) => {
          const { data, message } = response.data;
          set({ aopApplications: data });
          callback(200, message);
        },
      });
    },

    // GET AOP APPLICATION BY ID
    getAOPApplicationById: (id, callback) => {
      set({ isLoading: true });

      read({
        url: `${API.MANAGE_AOP_REQUEST}/${id}`,
        failed: () => {
          callback();
          set({ isLoading: false });
        },
        success: (response) => {
          const { data, message } = response.data;

          set({ aopApplication: data, isLoading: false });
          localStorageSetter("aopApplication", data); // STORE TO LOCALSTORAGE

          callback(200, message);
        },
      });
    },

    // EDIT SUCCESS INDICATORS AND OBJECTIVE
    updateObjectiveSuccessIndicator: (body, callback) => {
      try {
        const {
          success_indicator,
          success_indicator_id,
          objective,
          objective_id,
        } = body;

        const dataToSubmit = new FormData();

        dataToSubmit.append("success_indicator_id", success_indicator_id);
        dataToSubmit.append("success_indicator", success_indicator);
        dataToSubmit.append("objective_id", objective_id);
        dataToSubmit.append("objective", objective);

        update({
          url: API.EDIT_OBJECTIVE,
          form: dataToSubmit,
          success: (response) => {
            const { data, message } = response.data;
            // set({ aopApplications: data });
            callback(200, message);
          },
          failed: callback,
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
}));

export const useAOPApplications = () =>
  useAOPApplicationsHook((state) => state.aopApplications);

export const useAOPApplication = () =>
  useAOPApplicationsHook((state) => state.aopApplication);

export const useAOPApplicationsActions = () =>
  useAOPApplicationsHook((state) => state.actions);

export const useLoadingState = () =>
  useAOPApplicationsHook((state) => state.isLoading);
