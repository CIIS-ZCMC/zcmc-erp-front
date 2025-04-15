import { create } from "zustand";
import erp_api from "../Services/ERP_API";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  ppmp: [],
  ppmpLoading: false,
  ppmpError: null,

  getPPMP: async (params) => {
    set({ ppmpLoading: true });
    try {
      const response = await erp_api.get(`${PATH}/`, { params });
      set({ ppmp: response.data, ppmpLoading: false });
    } catch (error) {
      set({ ppmpError: error, ppmpLoading: false });
    }
  },
}));
