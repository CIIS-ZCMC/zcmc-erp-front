import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { post, read } from "../Services/RequestMethods";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  ppmp: {},
  modes: [],
  activities: [],
  ppmpLoading: false,
  ppmpError: null,

  getPPMPItems: (callBack) => {
    read({
      url: `${PATH}-items`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ ppmp: data });
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
}));

export default usePPMPHook;
