import { create } from "zustand";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const usePPMPApplicationHook = create((set) => ({
  ppmpApplications: [],
  ppmpApplication: null,
  ppmpApplicationItems: [],

  actions: {
    getPPMPApplications: (callback) => {
      read({
        url: API.PPMP_APPLICATION,
        success: (res) => {
          const { data, message } = res.data;

          set(() => ({ ppmpApplications: data }));
          callback(200, message);
        },

        failed: callback,
      });
    },

    getPPMPApplicationByID: (id, callback) => {
      read({
        url: `${API.PPMP_APPLICATION}-view/${id}`,
        success: (res) => {
          const { data, message } = res.data;

          set(() => ({
            ppmpApplicationItems: data.items,
            ppmpApplication: data,
          }));
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
