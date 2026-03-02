import { create } from "zustand";
import erp_api from "../../Services/ERP_API";
import {
  download,
  post,
  read,
  remove,
  update,
} from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  modes: [],
  activities: [],
  ppmp_id: 0,
  dashboard: {},
  ppmp: [],
  ppmp_total: 0,
  pagination: {},
  years: [],
  status: [],
  timeline: [],
  isLocked: false,

  getPPMPItems: (type, callBack, page = 1, per_page = 15) => {
    read({
      url: `${PATH}-items`,
      params: { type, page, per_page },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({
          ppmp: data.data.data,
          ppmp_total: data.data.ppmp_total,
          pagination: data.data.pagination,
          ppmp_id: data.data.id,
          status: data.data.status,
          isLocked: data.data.is_locked,
        });
        callBack(status, message, data);
      },
    });
  },

  getPPMPDashboard: (callBack, year) => {
    read({
      url: `${PATH}-application-dashboard`,
      params: { year },
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

  getPPMPTimeline: async (id, callBack) => {
    read({
      url: `approval-trail/${id}`,
      failed: callBack,
      success: (res) => {
        const { approval_trail, status } = res.data;
        set({ timeline: approval_trail });
        callBack(status, message);
      },
    });
  },

  postPPMP: async (id, body, callback) => {
    post({
      url: `${PATH}-update-status/${id}`,
      form: body,
      success: (response) => {
        const { message, data, errors } = response.data;
        console.log(data);
        console.log(response.message);
        set({ dashboard: data });
        callback(response.status, response.message, errors);
      },
      failed: callback,
    });
  },

  postItems: async (body, callback) => {
    post({
      url: `${PATH}-items-store`,
      form: body,
      success: (response) => {
        const { message, data, errors } = response.data;
        console.log(data);
        console.log(response.message);
        // set({ dashboard: data });
        callback(response.status, response.message, errors);
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

  // this function is used on the request new item function on ppmp dashboard
  itemRequestStore: async (body, callback) => {
    post({
      url: `item-request-store`,
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
        const {
          message,
          data: { deleted_ppmp_item, ppmp_total, summary },
        } = data;
        console.log(ppmp_total);
        set((state) => ({
          // remove the deleted item from ppmp resources/items
          ppmp: state.ppmp.filter((res) => res.id !== deleted_ppmp_item.id),
          ppmp_total: ppmp_total,
        }));
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

      failed: (status, message) => {
        // err is the raw error — pass everything to callback
        console.log(message);
        callBack(status, message);
      },
      success: ({ status, data }) => {
        // Correct destructure for "data.data"
        const { message, data: updatedItem, ppmp_total } = data;
        // Update store
        set((state) => ({
          ppmp: state.ppmp.map((res) =>
            res.id === updatedItem.id ? { ...res, ...updatedItem } : res,
          ),
          ppmp_total: ppmp_total,
        }));

        callBack(status, data);
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
              : res,
          ),
          ppmp_total: ppmp_total_amount,
        }));

        callBack(status, message);
      },
    });
  },

  getYearList: async (callBack) => {
    read({
      url: API.AOP_YEAR_LIST,
      failed: callBack,
      success: (res) => {
        // console.log(res)
        const {
          status,
          data: { data, message },
        } = res;
        set({ years: data });
        callBack(status, message);
      },
    });
  },
}));

export default usePPMPHook;
