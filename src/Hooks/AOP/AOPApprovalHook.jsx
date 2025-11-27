import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
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
    processPPMP: (payload, callback) => {
      post({
        url: `${API.APPROVAL_PPMP}`,
        form: payload,
        failed: callback,
        success: (response) => {

          console.log(response)

          const {
            data: { status_details, timeline, message },
          } = response.data;

          callback(response.status, message);
        },
      });
    },

    getAOPApprovalTimeline: (AOP_ID, callback) => {
      set(() => ({ isLoading: true }));
      read({
        url: `${API.APPROVAL_TIMELINE}/${AOP_ID.aop_application_id}`,
        success: (response) => {

          const {
            // data: {
            //   id,
            //   timelines,
            //   data,
            //   approval_roles
            // },
            data,
            status,
          } = response.data;

          set(() => (
            console.log(data),
            {
              isLoading: false,
              approvalTimeline: data,
              // approvalTimeline: timelines,
              approvalRoles: approval_roles,
            }));

          callback(status, `Success fetching approval timeline for AOP ${id}`);
        },
        failed: (response) => {
          callback(response);
          set(() => ({ isLoading: false }));
        },
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
