import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import {
  localStorageGetter,
  localStorageSetter,
} from "../../Utils/LocalStorage";
import { read, update, post } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { persist } from "zustand/middleware";

const useAOPApplicationsHook = create(
  persist(
    (set) => ({
      aopApplications: [],
      aopApplicationObjectives: [],
      aopApplication: null,

      timeline_id: "",
      has_dispense: false,
      permissions: {},

      isLoading: false,

      actions: {
        // GET ALL AOP APPLICATIONS
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

        // GET BY ID
        getAOPApplicationById: (id, callback) => {
          set({ isLoading: true });

          read({
            url: `${API.MANAGE_AOP_REQUEST}/${id}`,
            failed: () => {
              callback;
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
                has_dispense,
                permissions, // ✅ persisted automatically
                isLoading: false,
              });

              callback(200, message);
            },
          });
        },

        // UPDATE OBJECTIVE
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
                const { message } = response.data;
                callback(200, message);
              },
              failed: callback,
            });
          } catch (e) {
            console.log(e);
          }
        },

        // REDRAFT PPMP / AOP
        redraftPPMP: (body, callback) => {
          set({ isLoading: true });
          post({
            url: `ppmp-redraft`,
            form: body,
            success: (response) => {
              set({ isLoading: false });
              const resData = response?.data;
              const message =
                resData?.message ||
                resData?.data?.message ||
                "Successfully redrafted AOP-PPMP.";
              const data = resData?.data;
              callback && callback(200, message, data);
            },
            failed: (status, message, errors) => {
              set({ isLoading: false });
              callback && callback(status, message, errors);
            },
          });
        },
      },
    }),

    {
      name: "aop-applications-store", // localStorage key
      partialize: (state) => ({
        permissions: state.permissions,
        timeline_id: state.timeline_id,
        has_dispense: state.has_dispense,
      }),
    },
  ),
);

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
