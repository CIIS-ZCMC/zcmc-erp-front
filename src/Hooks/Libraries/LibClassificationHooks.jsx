import { create } from "zustand";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
const useClassificationHooks = create((set) => ({
  inputs: {
    currentLibName: "sada",
    pin: null,
  },
  type: "create", // ['create', 'update', 'delete']
  isloading: false,
  hasError: true,
  selectedData: null,
  classifications: [],
  unit: [],
  getClassifications: async (callBack) => {
    read({
      url: `${API.ITEM_CLASSIFICATIONS}?mode=selection`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ classifications: data.data });
        callBack(status, message);
      },
    });
  },
  getUnit: async (callBack) => {
    read({
      url: `${API.ITEM_UNIT}?mode=selection`,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ unit: data.data });
        callBack(status, message);
      },
    });
  },
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

export default useClassificationHooks;
