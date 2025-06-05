import { create } from "zustand";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
const useCategoryHooks = create((set) => ({
  inputs: {
    currentLibName: "sada",
    pin: null,
  },
  categories: [],
  getCategories: async (callBack) => {
    read({
      url: `${API.ITEM_CATEGORIES}?mode=selection`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ categories: data.data });
        callBack(status, message);
      },
    });
  },
  type: "create", // ['create', 'update', 'delete']
  isloading: false,
  hasError: true,
  selectedData: null,
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

export default useCategoryHooks;
