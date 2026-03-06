import { create } from "zustand";
import {
  download,
  post,
  read,
  remove,
  update,
} from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const PATH = "ppmp";

const usePPMPStoreHook = create((set, get) => ({
  // --- State ---
  ppmp: [],
  ppmp_total: 0,
  ppmp_id: 0,
  dashboard: {},
  modes: [],
  activities: [],
  status: {},
  timeline: [],
  isLocked: false,
  timelineDates: {
    start: [],
    end: [],
    delivery: [],
  },
  years: [],
  pagination: {},
  isLoading: false,

  // --- Actions ---
  actions: {
    getPPMPItems: (type, callBack, page = 1, per_page = 15) => {
      set({ isLoading: true });
      read({
        url: `${PATH}-items`,
        params: { type, page, per_page },
        failed: () => {
          set({ isLoading: false });
          callBack && callBack();
        },
        success: ({ status, message, data }) => {
          set({
            ppmp: data.data.data,
            ppmp_total: data.data.ppmp_total,
            pagination: data.data.pagination,
            ppmp_id: data.data.id,
            status: data.data.status,
            isLocked: data.data.is_locked,
            isLoading: false,
          });
          callBack && callBack(status, message, data);
        },
      });
    },

    getPPMPDashboard: (callBack, year) => {
      set({ isLoading: true });
      read({
        url: `${PATH}-application-dashboard`,
        params: { year },
        failed: () => {
          set({ isLoading: false });
          callBack && callBack();
        },
        success: ({ status, message, data }) => {
          set({ dashboard: data.data, isLoading: false });
          callBack && callBack(status, message, data);
        },
      });
    },

    getProcModes: (callBack) => {
      read({
        url: `procurement-modes`,
        failed: callBack,
        success: ({ status, message, data }) => {
          set({ modes: data.data });
          callBack && callBack(status, message);
        },
      });
    },

    getActivities: (callBack) => {
      read({
        url: `all-activities`,
        failed: callBack,
        success: ({ status, message, data }) => {
          set({ activities: data.data });
          callBack && callBack(status, message);
        },
      });
    },

    getPPMPTimeline: (id, callBack) => {
      read({
        url: `approval-trail/${id}`,
        failed: callBack,
        success: ({ data: { approval_trail, status }, message }) => {
          set({ timeline: approval_trail });
          callBack && callBack(status, message);
        },
      });
    },

    postPPMP: (id, body, callback) => {
      post({
        url: `${PATH}-update-status/${id}`,
        form: body,
        success: ({ data: { message, data, errors }, status }) => {
          set({ dashboard: data });
          callback && callback(status, message, errors);
        },
        failed: callback,
      });
    },

    postItems: (body, callback) => {
      post({
        url: `${PATH}-items-store`,
        form: body,
        success: ({ data: { message, data, errors }, status }) => {
          callback && callback(status, message, errors);
        },
        failed: callback,
      });
    },

    postItemRequest: (body, callback) => {
      post({
        url: `${PATH}-item-request-store`,
        form: body,
        success: ({ data: { message, data }, status }) => {
          callback && callback(status, message, data);
        },
        failed: callback,
      });
    },

    removeItem: (id, callBack) => {
      remove({
        url: `${PATH}-items-delete/${id}`,
        success: ({ data: { data }, status }) => {
          const { deleted_ppmp_item, ppmp_total } = data;
          set((state) => ({
            ppmp: state.ppmp.filter((item) => item.id !== deleted_ppmp_item.id),
            ppmp_total,
          }));
          callBack && callBack(status, data.message);
        },
        failed: callBack,
      });
    },

    updatePPMP: (id, form, callBack) => {
      update({
        url: `${PATH}-items-update/${id}`,
        form,
        failed: callBack,
        success: ({ data: { data, ppmp_total, message }, status }) => {
          set((state) => ({
            ppmp: state.ppmp.map((item) =>
              item.id === data.id ? { ...item, ...data } : item,
            ),
            ppmp_total,
          }));
          callBack && callBack(status, message);
        },
      });
    },

    removeActivity: (ppmpID, activityID, callBack) => {
      remove({
        url: `${PATH}-remove-activity/${ppmpID}/${activityID}`,
        failed: callBack,
        success: ({
          data: { data: updatedItem, ppmp_total_amount },
          status,
        }) => {
          set((state) => ({
            ppmp: state.ppmp.map((item) =>
              item.id === updatedItem.id
                ? { ...item, activities: updatedItem.activities }
                : item,
            ),
            ppmp_total: ppmp_total_amount,
          }));
          callBack && callBack(status, updatedItem.message);
        },
      });
    },

    search: (params, callBack) => {
      read({
        url: `${PATH}-item-search`,
        params: { search: params },
        failed: callBack,
        success: ({ status, message, data }) => {
          set({ ppmp: data.data });
          callBack && callBack(status, message, data.data);
        },
      });
    },

    exportPPMP: (callBack) => {
      download({
        url: `${PATH}-item-export`,
        title: "PPMP-Items",
        fileName: "ppmp_item.xlsx",
        success: callBack,
        failed: callBack,
      });
    },

    getYearList: (callBack) => {
      read({
        url: API.AOP_YEAR_LIST,
        failed: callBack,
        success: ({ status, data: { data, message } }) => {
          set({ years: data });
          callBack && callBack(status, message);
        },
      });
    },

    getProcTimelines: (type = "start", callBack) => {
      read({
        url: `${PATH}-timeline-dates`,
        params: { type },
        failed: callBack,
        success: ({ data: { dates, message }, status }) => {
          set((state) => ({
            timelineDates: { ...state.timelineDates, [type]: dates },
          }));
          callBack && callBack(status, message);
        },
      });
    },
  },
}));

// --- Expose actions separately ---
export const usePPMPActions = () => usePPMPStoreHook((state) => state.actions);

// --- Expose state separately ---
export const usePPMP = () => {
  const ppmp = usePPMPStoreHook((state) => state.ppmp);
  const ppmp_total = usePPMPStoreHook((state) => state.ppmp_total);
  const ppmp_id = usePPMPStoreHook((state) => state.ppmp_id);
  const dashboard = usePPMPStoreHook((state) => state.dashboard);
  const modes = usePPMPStoreHook((state) => state.modes);
  const activities = usePPMPStoreHook((state) => state.activities);
  const status = usePPMPStoreHook((state) => state.status);
  const timeline = usePPMPStoreHook((state) => state.timeline);
  const isLocked = usePPMPStoreHook((state) => state.isLocked);
  const timelineDates = usePPMPStoreHook((state) => state.timelineDates);
  const years = usePPMPStoreHook((state) => state.years);
  const pagination = usePPMPStoreHook((state) => state.pagination);
  const isLoading = usePPMPStoreHook((state) => state.isLoading);

  return {
    ppmp,
    ppmp_total,
    ppmp_id,
    dashboard,
    modes,
    activities,
    status,
    timeline,
    isLocked,
    timelineDates,
    years,
    pagination,
    isLoading,
  };
};

export default usePPMPStoreHook;
