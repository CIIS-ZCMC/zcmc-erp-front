import { create } from "zustand";
// import { erp_api } from "../../Services/ERP_API";
import { localStorageSetter } from "../../Utils/LocalStorage";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPApplicationsHook = create((set) => ({
  aopApplications: [],
  aopApplication: null,
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
      read({
        url: `${API.MANAGE_AOP_REQUEST}/${id}`,
        failed: callback,
        success: (response) => {
          const { data, message } = response.data;

          set({ aopApplication: data });
          localStorageSetter("aopApplication", data); // STORE TO LOCALSTORAGE

          callback(200, message);
        },
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
