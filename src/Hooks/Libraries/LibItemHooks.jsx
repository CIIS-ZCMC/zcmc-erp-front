import { create } from "zustand";

const useLibItemHook = create((set) => ({
  inputs: {
    specification: [
      {
        description: "",
      },
    ],
  },

  updateData: null,
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
        specification: [
          {
            description: "",
          },
        ],
      },
    });
  },
  setInputSpecification: (newSpecs) =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        specification: newSpecs,
      },
    })),

  setUpdateData: (data) => {
    set({ updateData: data });
  },
}));

export default useLibItemHook;
