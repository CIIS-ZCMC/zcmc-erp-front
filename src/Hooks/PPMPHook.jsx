import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { post, read, remove } from "../Services/RequestMethods";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  modes: [],
  activities: [],
  dashboard: {},

  getPPMPItems: (callBack) => {
    read({
      url: `${PATH}-items`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        localStorage.setItem(
          "ppmp-items",
          JSON.stringify(data.data.ppmp_items)
        );
        callBack(status, message, data);
      },
    });
  },

  getPPMPDashboard: (callBack) => {
    read({
      url: `${PATH}-applications`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ dashboard: data.data });
        callBack(status, message, data);
      },
    });
  },

  getProcModes: (callBack) => {
    read({
      url: `procurement-modes`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ modes: data });
        callBack(status, message);
      },
    });
  },

  getActivities: async (callBack) => {
    read({
      url: `activities`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ activities: data.data });
        callBack(status, message);
      },
    });
  },

  postPPMP: async (body, callback) => {
    post({
      url: `${PATH}-items`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  postItemRequest: async (body, callback) => {
    post({
      url: `${PATH}-item-requests`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  removeItem: async (body, callback) => {
    remove({
      url: `${PATH}-items/`,
      // param: { id: params },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  search: async (params, callBack) => {
    read({
      url: `${PATH}-item-search`,
      params: { search: params },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ items: data.data });
        callBack(status, message, data.data);
      },
    });
  },
}));

export default usePPMPHook;
