import { create } from "zustand";
import erp_api from "../Services/ERP_API";

const PATH = "item";

const useItemsHook = create((set) => ({
  items: [],
  categories: [],
  classification: [],
  units: [],
  // itemsLoading: false,
  // itemsError: null,

  getItems: async (callback) => {
    return erp_api
      .get(`${PATH}s`, {
        params: { mode: "selection" },
      })
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          items: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },

  getItemCategories: async (callback) => {
    return erp_api
      .get(`${PATH}-categories`)
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          categories: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },
  getItemClassification: async (callback) => {
    return erp_api
      .get(`${PATH}-classifications`)
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          classification: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },

  getItemUnits: async (callback) => {
    return erp_api
      .get(`${PATH}-units`, {
        params: { mode: "selection" },
      })
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          units: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },
}));

export default useItemsHook;
