import { create } from "zustand";

const userErrorInputHook = create((set) => ({
  errors: {},

  setError: (name, isError, message) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [name]: { isError, message },
      },
    }));
  },
  clearErrors: () => {
    set(() => ({
      errors: {},
    }));
  },
}));

export default userErrorInputHook;
