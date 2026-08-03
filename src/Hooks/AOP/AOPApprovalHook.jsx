import { create } from "zustand";
import { download, post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPApprovalHook = create((set) => ({
  approvalTimeline: [],
  approvalRoles: [],
  isLoading: false,

  actions: {
    // GET ALL AOP APPLICATIONS
    // processAOP: (form, callback) => {
    //   post({
    //     url: API.PROCESS_AOP_REQUEST,
    //     form: form,
    //     failed: callback,
    //     success: (response) => {
    //       const {
    //         data: { status_details, timeline, message },
    //       } = response.data;

    //       callback(response.status, message);
    //     },
    //   });
    // },

    //
    processApplication: (form, callback) => {
      post({
        url: `${API.APPROVAL_PPMP}`,
        form: form,
        failed: callback,
        success: (response) => {
          const {
            data: { status_details, timeline, message },
          } = response.data;

          callback(response.status, message);
        },
      });
    },

    getAOPApprovalTimeline: (AOP_ID, callback) => {
      set(() => ({ isLoading: true, approvalTimeline: [] }));
      read({
        url: `approval-trail/${AOP_ID}`,
        success: (response) => {
          const {
            approval_trail,

            status,
          } = response.data;

          set(() => ({
            isLoading: false,
            approvalTimeline: approval_trail,
            // approvalRoles: approval_roles,
          }));

          if (typeof callback === "function") {
            callback(
              status,
              `Success fetching approval timeline for AOP ${AOP_ID}`,
            );
          }
        },
        failed: (response) => {
          if (typeof callback === "function") {
            callback(response);
          }
          set(() => ({ isLoading: false }));
        },
      });
    },

    generateWFP: (params, callback) => {
      download({
        url: `${API.GENERATE_WFP}`,
        params: params,
        title: "WFP Matrix",
        fileName: `WFP Matrix ${params.year}.xlsx`,
        success: (status, msg) => callback(status, msg),
        failed: (status, msg) => callback(status, msg),
      });
    },
  },
}));

export const useApprovalActions = () =>
  useAOPApprovalHook((state) => state.actions);

export const useApprovalTimeline = () =>
  useAOPApprovalHook((state) => state.approvalTimeline);

export const useApprovalLoading = () =>
  useAOPApprovalHook((state) => state.isLoading);
