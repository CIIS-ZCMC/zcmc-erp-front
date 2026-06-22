import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import {
  localStorageGetter,
  localStorageSetter,
} from "../../Utils/LocalStorage";
import { read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPApplicationsHook = create((set) => ({
  aopApplications: [],
  aopApplicationObjectives: [],
  aopApplication: null,
  timeline_id: "",
  has_dispense: false,

  // approvalTimeline: [],
  isLoading: false,

  actions: {
    // GET ALL AOP APPLICATIONS
    // getAOPApplications: (params, callback) => {
    //   read({
    //     url: API.AOP_REQUESTS,
    //     params: params,
    //     failed: callback,
    //     success: (response) => {
    //       const { data, message } = response.data;
    //       set({ aopApplications: data });
    //       callback(200, message);
    //     },
    //   });
    // },
    getAOPApplications: (params, callback) => {
      read({
        url: `requests-approver`,
        params: params,
        failed: callback,
        success: (response) => {
          const { data, message } = response.data;
          set({ aopApplications: data.applications ?? [] });
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
            data: {
              objectives = [],
              application,
              latest_timeline_id,
              has_dispense,
              permissions,
            },
            message,
          } = response.data;

          set({
            timeline_id: latest_timeline_id,
            aopApplicationObjectives: objectives,
            aopApplication: application,
            isLoading: false,
            has_dispense: has_dispense,
            permissions: permissions,
          });
          localStorageSetter("aopApplication", application); // STORE TO LOCALSTORAGE
          localStorageSetter("aopApplicationObjectives", objectives); // STORE TO LOCALSTORAGE
          localStorageSetter("timeline_id", latest_timeline_id); // STORE TO LOCALSTORAGE
          localStorageSetter("has_dispense", has_dispense); // STORE TO LOCALSTORAGE
          localStorageSetter("permissions", permissions); // STORE TO LOCALSTORAGE
          // STORE TO LOCALSTORAGE

          callback(200, message);
        },
      });
    },

    // EDIT SUCCESS INDICATORS AND OBJECTIVE
    updateObjectiveSuccessIndicator: (body, callback) => {
      try {
        const { other_success_indicator, other_objective, index } = body;

        const dataToSubmit = new FormData();

        dataToSubmit.append("application_objective_id", index);
        dataToSubmit.append("other_objective_description", other_objective);
        dataToSubmit.append(
          "other_success_indicator_description",
          other_success_indicator,
        );

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

export const useAOPApplicationObjectives = () =>
  useAOPApplicationsHook((state) => state.aopApplicationObjectives);

export const useAOPApplicationsActions = () =>
  useAOPApplicationsHook((state) => state.actions);

export const useLoadingState = () =>
  useAOPApplicationsHook((state) => state.isLoading);

export const useHasDispense = () =>
  useAOPApplicationsHook((state) => state.has_dispense);

export const useTimelineID = () =>
  useAOPApplicationsHook((state) => state.timeline_id);

export const useAOPPermissions = () =>
  useAOPApplicationsHook((state) => state.permissions);
