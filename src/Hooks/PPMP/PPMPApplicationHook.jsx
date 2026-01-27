import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { paginationClasses } from "@mui/material";

const usePPMPApplicationHook = create((set) => ({
  ppmpApplications: [],
  ppmpApplication: null,
  ppmpApplicationItems: [],
  isLoading: false,
  pagination: {},

  actions: {
    getPPMPApplications: (params, callback) => {
      set(() => ({ isLoading: true }));

      read({
        url: API.PPMP_APPLICATION,
        params: params,
        success: (res) => {
          const { data, message } = res.data;

          set(() => ({ ppmpApplications: data, isLoading: false }));
          callback(200, message);
        },

        failed: () => {
          callback();
          set({ isLoading: false });
        },
      });
    },

    getPPMPApplicationByID: (
      id,
      search = "",
      page = 1,
      per_page = 15,
      tab,
      callback,
    ) => {
      set(() => ({ isLoading: true }));

      read({
        url: `${API.PPMP_APPLICATION}/${id}`,
        params: { search: search, page, per_page, tab: tab },
        success: (res) => {
          const { data, message } = res.data;

          set(() => ({
            ppmpApplicationItems: data.data,
            ppmpApplication: data,
            pagination: data.pagination,
            isLoading: false,
          }));
          callback(200, message);
        },

        failed: () => {
          callback;
          set({ isLoading: false });
        },
      });
    },

    receivePPMP: (form, callback) => {
      post({
        url: `ppmp-receiving-list-receive`,
        form: form,
        success: (res) => {
          const { data, message } = res.data;

          console.log(data);
          // set(() => ({
          //   ppmpApplicationItems: data.items,
          //   ppmpApplication: data,
          // }));
          callback(200, message);
        },

        failed: callback,
      });
    },
  },
}));

export const usePPMPApplicationActions = () =>
  usePPMPApplicationHook((state) => state.actions);

export const usePPMP = () => {
  const ppmpApplications = usePPMPApplicationHook(
    (state) => state.ppmpApplications,
  );
  const ppmpApplicationItems = usePPMPApplicationHook(
    (state) => state.ppmpApplicationItems,
  );
  const ppmpApplication = usePPMPApplicationHook(
    (state) => state.ppmpApplication,
  );

  const pagination = usePPMPApplicationHook((state) => state.pagination);

  const isLoading = usePPMPApplicationHook((state) => state.isLoading);

  return {
    ppmpApplications,
    ppmpApplicationItems,
    ppmpApplication,
    isLoading,
    pagination,
  };
};
