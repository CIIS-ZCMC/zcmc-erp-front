import { create } from "zustand";

const useClassificationHooks = create((set, get) => ({
  inputs: {
    currentLibName: "",
    currentLibCode: "",
    currentLibDesc: "",
    pin: null,
  },
  type: "create", // ['create', 'update', 'delete']
  isloading: false,
  hasError: false,
  selectedData: null,

  getFormData: () => {
    const { inputs } = get();
    const raw = {
      name: inputs.currentLibName,
      code: inputs.currentLibCode,
      description: inputs.currentLibDesc,
    };
    const form = new FormData();

    for (const key in raw) {
      if (raw[key] !== undefined && raw[key] !== null) {
        form.append(key, raw[key]);
      }
    }
    return raw;
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
        currentLibCode: "",
        currentLibDesc: "",
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
