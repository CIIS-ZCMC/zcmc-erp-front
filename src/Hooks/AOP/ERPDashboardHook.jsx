import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";

const useERPDashboardHook = create((set) => ({
  approverDashboard: [],
  isLoading: false,

  actions: {
    getERPDashboard: (callback) => {
      set(() => ({ isLoading: true }));
      read({
        url: `erp-dashboard`,
        success: (response) => {
          const { data, status } = response.data;

          set(() => ({
            isLoading: false,
            approverDashboard: data,
            // approvalRoles: approval_roles,
          }));

          callback(status, `Success fetching`);
        },
        failed: (response) => {
          callback(response);
          set(() => ({ isLoading: false }));
        },
      });
    },
  },
}));

export const useERPDashboardActions = () =>
  useERPDashboardHook((state) => state.actions);

export const useERPDashboard = () =>
  useERPDashboardHook((state) => state.approverDashboard);

export const useERPDashboardLoading = () =>
  useERPDashboardHook((state) => state.isLoading);
