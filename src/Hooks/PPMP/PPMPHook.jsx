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
  ppmp_id: 0,
  dashboard: {},
  ppmp: [],
  ppmp_total: 0,
  pagination: {},

  getPPMPItems: (callBack, page = 1, per_page = 15) => {
    read({
      url: `${PATH}-items`,
      params: { page, per_page },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({
          ppmp: data.data.data,
          ppmp_total: data.data.ppmp_total,
          pagination: data.data.pagination,
          ppmp_id: data.data.id,
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
      url: `${PATH}-item-request-store`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  removeItem: async (id, callBack) => {
    remove({
      url: `${PATH}-items-delete/${id}`,
      success: ({ status, data }) => {
        // const { message, data: deletedResource, activity } = data;

        // set((state) => ({
        //   resources: state.resources.filter((res) => res.id !== id),
        //   activity: {
        //     ...state.activity,
        //     // ✅ update only cost
        //   },
        // }));
        callBack(status, message);
      },
      failed: callBack,
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
      form,
      failed: callBack,
      success: ({ status, data }) => {
        // Correct destructure for "data.data"
        const { message, data: updatedItem, ppmp_total } = data;

        // Update store
        set((state) => ({
          ppmp: state.ppmp.map((res) =>
            res.id === updatedItem.id ? { ...res, ...updatedItem } : res
          ),
          ppmp_total: ppmp_total,
        }));

        callBack(status, message);
      },
    });
  },

  removeActivity: async (ppmpID, activityID, callBack) => {
    remove({
      url: `${PATH}-remove-activity/${ppmpID}/${activityID}`,
      failed: callBack,
      success: ({ status, data }) => {
        const { message, data: updatedItem, ppmp_total_amount } = data; // updatedItem contains the full PPMP with new activities

        set((state) => ({
          ppmp: state.ppmp.map((res) =>
            res.id === updatedItem.id
              ? { ...res, activities: updatedItem.activities } // ✅ update only activities
              : res
          ),
          ppmp_total: ppmp_total_amount,
        }));

        callBack(status, message);
      },
    });
  },
}));

export default usePPMPHook;
