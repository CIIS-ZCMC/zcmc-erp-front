import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import { localStorageSetter } from "../../Utils/LocalStorage";
import { read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPApplicationsHook = create((set) => ({
  aopApplications: [],
  aopApplicationObjectives: null,
  aopApplication: null,

  // approvalTimeline: [],
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
          const {
            data: { objectives, application },
            message,
          } = response.data;

          set({
            aopApplicationObjectives: objectives,
            aopApplication: application,
            isLoading: false,
          });

          localStorageSetter("aopApplicationObjectives", objectives); // STORE TO LOCALSTORAGE

          callback(200, message);
        },
      });
    },

    // EDIT SUCCESS INDICATORS AND OBJECTIVE
    updateObjectiveSuccessIndicator: (id, body, callback) => {
      try {
        const { other_success_indicator, other_objective } = body;

        const dataToSubmit = new FormData();

        dataToSubmit.append("aop_application_id", id);
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

export const useAOPApplicationObjectives = () =>
  useAOPApplicationsHook((state) => state.aopApplicationObjectives);

export const useAOPApplicationsActions = () =>
  useAOPApplicationsHook((state) => state.actions);

export const useLoadingState = () =>
  useAOPApplicationsHook((state) => state.isLoading);
