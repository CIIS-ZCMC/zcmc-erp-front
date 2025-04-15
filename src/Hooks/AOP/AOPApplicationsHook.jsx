import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import erp_api from "../../Services/ERP_API";
import { persist } from "zustand/middleware";
import { localStorageSetter } from "../../Utils/LocalStorage";

const useAOPApplicationsHook = create((set) => ({
  aopApplications: [],
  aopApplication: null,
  actions: {
    // GET ALL AOP APPLICATIONS
    getAOPApplications: () => {
      return erp_api
        .get("/aop-requests")
        .then((response) => {
          const { data } = response.data;
          set({ aopApplications: data });
        })
        .catch((error) => {
          console.error("Error fetching AOP applications:", error);
        });
    },

    // GET AOP APPLICATION BY ID
    getAOPApplicationById: (id, callback) => {
      return erp_api
        .get(`/manage-aop-request/${id}`)
        .then((response) => {
          const { data } = response.data;

          set({ aopApplication: data });
          // STORE TO LOCALSTORAGE
          localStorageSetter("aopApplication", data);
          callback(response.status, data);
        })
        .catch((error) => {
          console.error("Error fetching AOP application:", error);
        });
    },
  },
}));

export const useAOPApplications = () =>
  useAOPApplicationsHook((state) => state.aopApplications);

export const useAOPApplication = () =>
  useAOPApplicationsHook((state) => state.aopApplication);

export const useAOPApplicationsActions = () =>
  useAOPApplicationsHook((state) => state.actions);
