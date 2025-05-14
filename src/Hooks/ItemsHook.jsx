import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { read } from "../Services/RequestMethods";

const PATH = "item";

const useItemsHook = create((set) => ({
  items: [],
  categories: [],
  classification: [],
  units: [],
  // itemsLoading: false,
  // itemsError: null,

  getItems: async (callBack) => {
    read({
      url: `${PATH}s`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ items: data.data });
        callBack(status, message);
      },
    });
  },

  getItemCategories: async (callBack) => {
    read({
      url: `${PATH}-categories`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ categories: data.data });
        callBack(status, message);
      },
    });
  },
  getItemClassification: async (callBack) => {
    read({
      url: `${PATH}-classifications`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ classification: data.data });
        callBack(status, message);
      },
    });
  },

  getItemUnits: async (callBack) => {
    read({
      url: `${PATH}-units`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ units: data.data });
        callBack(status, message);
      },
    });
  },
}));

export default useItemsHook;
