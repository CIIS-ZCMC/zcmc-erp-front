import { create } from "zustand";

const useclassificationHook = create((set) => ({
  inputs: {
    classificationName:"sada",
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
        classificationName: "",
      },
    });
  },
}));

export default useclassificationHook;
