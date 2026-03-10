import { create } from "zustand";
import { post, read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { paginationClasses } from "@mui/material";

const usePPMPApplicationHook = create((set) => ({
  ppmpApplications: [],
  ppmpApplication: null,
  ppmpApplicationItems: [],
  isLoading: false,
  pagination: {},
  sourceOfFunds: [],

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
      type,
      search = "",
      page = 1,
      per_page = 15,
      tab,
      callback,
    ) => {
      set(() => ({ isLoading: true }));

      read({
        url: `${API.PPMP_APPLICATION}/${id}`,
        params: { search: search, page, per_page, tab: tab, type: type },
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

          // set(() => ({
          //   ppmpApplicationItems: data.items,
          //   ppmpApplication: data,
          // }));
          callback(200, message);
        },

        failed: callback,
      });
    },

    getSourceOfFunds: (callBack) => {
      read({
        url: `source-of-funds/list`,
        failed: callBack,
        success: ({ status, data: { data, message } }) => {
          console.log("sourceOfFunds", data);
          set({ sourceOfFunds: data });
          callBack && callBack(status, message);
        },
      });
    },

    updateSourceOfFunds: (id, form, callBack) => {
      update({
        url: `ppmp-items/${id}/source-of-fund`,
        form,
        failed: (status, message) => callBack(status, message),
        success: ({ data: { data, message }, status }) => {
          console.log("updateSourceOfFunds", data);
          set((state) => ({
            ppmpApplicationItems: state.ppmpApplicationItems.map((item) =>
              item.id === data.id
                ? {
                    ...item,
                    source_of_fund: data.source_of_fund,
                  }
                : item,
            ),
          }));
          callBack && callBack(status, message);
        },
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
  const sourceOfFunds = usePPMPApplicationHook((state) => state.sourceOfFunds);

  const pagination = usePPMPApplicationHook((state) => state.pagination);

  const isLoading = usePPMPApplicationHook((state) => state.isLoading);

  return {
    ppmpApplications,
    ppmpApplicationItems,
    ppmpApplication,
    isLoading,
    pagination,
    sourceOfFunds,
  };
};
