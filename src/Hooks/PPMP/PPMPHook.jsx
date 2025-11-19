import { create } from "zustand";
import erp_api from "../../Services/ERP_API";
import {
  download,
  post,
  read,
  remove,
  update,
} from "../../Services/RequestMethods";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  modes: [],
  activities: [],
  is_draft: 0,
  dashboard: {},
  ppmp: [],
  ppmp_total: 0,

  getPPMPItems: (callBack) => {
    read({
      url: `${PATH}-items`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({
          is_draft: data.data.is_draft,
          ppmp: data.data.ppmp_items.data,
          ppmp_total: data.data.ppmp_total,
        });
        callBack(status, message, data);
      },
    });
  },

  getPPMPDashboard: (callBack) => {
    read({
      url: `${PATH}-application-dashboard`,
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
        set({ modes: data.data });
        callBack(status, message);
      },
    });
  },

  getActivities: async (callBack) => {
    read({
      url: `all-activities`,
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
      url: `${PATH}-items-store`,
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
    post({
      url: `check-pin`,
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

  exportPPMP: async (callBack) => {
    download({
      url: `${PATH}-item-export`,
      title: "PPMP-Items",
      fileName: "ppmp_item.xlsx",
      success: (status, message) => {
        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },
  updatePPMP: async (id, form, callBack) => {
    update({
      url: `${PATH}-items-update/${id}`,
      form: form,
      failed: callBack,
      success: ({ status, data }) => {
        const { message, data: updatedItem } = data; // <-- fixed key

        set((state) => ({
          ppmp: state.ppmp.map((res) =>
            res.id === updatedItem.ppmp_item.id
              ? { ...res, ...updatedItem.ppmp_item }
              : res
          ),
        }));

        callBack(status, message);
      },
    });
  },
}));

export default usePPMPHook;
