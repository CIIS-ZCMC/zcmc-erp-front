import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import {
  localStorageGetter,
  localStorageSetter,
} from "../../Utils/LocalStorage";
import { read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

export const APPLICATION_ID = localStorageGetter("aop_application_id");

const useAOPApplicationsHook = create((set) => ({
  aopApplications: [],
  aopApplication: null,

  approvalTimeline: [],
  isLoading: false,

  actions: {
    // GET ALL AOP APPLICATIONS
    getAOPApplications: (params, callback) => {
      read({
        url: API.AOP_REQUESTS,
        params: params,
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
        const { other_success_indicator, other_objective } = body;

        const dataToSubmit = new FormData();

        dataToSubmit.append("aop_application_id", APPLICATION_ID);
        dataToSubmit.append("objective_description", other_objective);
        dataToSubmit.append(
          "success_indicator_description",
          other_success_indicator
        );

        update({
          url: API.EDIT_OBJECTIVE,
          form: dataToSubmit,
          success: (response) => {
            const { data, message } = response.data;
            // set({ aopApplications: data });
            console.log(data);
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
