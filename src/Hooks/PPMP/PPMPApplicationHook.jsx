import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const usePPMPApplicationHook = create((set) => ({
  ppmpApplications: [],
  ppmpApplication: null,
  ppmpApplicationItems: [],
  isLoading: false,

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

    getPPMPApplicationByID: (id, page = 1, per_page = 15, callback) => {
      set(() => ({ isLoading: true }));

      read({
        url: `${API.PPMP_APPLICATION}/${id}`,
        params: { page, per_page },
        success: (res) => {
          const { data, message } = res.data;

          set(() => ({
            ppmpApplicationItems: data.data,
            ppmpApplication: data,
            isLoading: false,
          }));
          callback(200, message);
        },

        failed: () => {
          callback();
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
    (state) => state.ppmpApplications
  );
  const ppmpApplicationItems = usePPMPApplicationHook(
    (state) => state.ppmpApplicationItems
  );
  const ppmpApplication = usePPMPApplicationHook(
    (state) => state.ppmpApplication
  );

  return { ppmpApplications, ppmpApplicationItems, ppmpApplication };
};
