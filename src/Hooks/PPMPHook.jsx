import { create } from "zustand";
import erp_api from "../Services/ERP_API";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  ppmp: {},

  ppmpLoading: false,
  ppmpError: null,

  getPPMPItems: async (callback) => {
    return erp_api
      .get(`${PATH}-items`)
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
          ppmp: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching ppmp:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },
}));

export default usePPMPHook;
