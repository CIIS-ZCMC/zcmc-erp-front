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

  getTerminology: async (callBack) => {
    read({
      url: `${API.ITEM_TERMINOLOGY}`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ terminology: data.data });
        callBack(status, message);
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
