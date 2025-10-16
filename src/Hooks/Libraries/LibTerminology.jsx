import { create } from "zustand";
import { API } from "../../Data/constants";
import { read } from "../../Services/RequestMethods";

const useTerminologyHooks = create((set) => ({
  inputs: {
    currentLibName: "",
    pin: null,
  },
  type: "create", // ['create', 'update', 'delete']
  isloading: false,
  hasError: true,
  selectedData: null,
  terminology: [],
  pagination: {
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  },
  isLoading: false,
  error: null,

  setSelectedData: (data) => {
    set({ selectedData: data });
  },
  setInputs: (name, value) =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        [name]: value,
      },
    })),

  resetInput: () => {
    set({
      inputs: {
        currentLibName: "",
        pin: null,
      },
    });
  },

  getTerminology: async ({ page = 1, per_page = 15, callBack } = {}) => {
    read({
      url: `item-${API.ITEM_TERMINOLOGY}`,
      params: { page, per_page },
      failed: (err) => {
        set({ isLoading: false, error: err });
        if (callBack)
          callBack(false, err?.message || "Failed to fetch categories");
      },
      success: (res) => {
        const { status, message, data, meta } = res;
        set({
          terminology: data.data,
          pagination: {
            total: data?.meta?.pagination?.total,
            per_page: data?.meta?.pagination?.per_page,
            current_page: data?.meta?.pagination?.current_page,
            last_page: data?.meta?.pagination?.last_page,
          },
          isLoading: false,
          error: null,
        });

        if (callBack) callBack(status, message);
      },
    });
  },

  setLoading: (isloading) => {
    set({ isloading });
  },

  setError: (error) => {
    set({ hasError: error });
  },

  setType: (newType) => {
    const validTypes = ["create", "update", "delete"];
    if (validTypes.includes(newType)) {
      set({ type: newType });
    } else {
      console.warn(`Invalid type "${newType}" passed to setType.`);
    }
  },
}));

export default useTerminologyHooks;
