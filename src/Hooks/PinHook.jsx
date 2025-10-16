import { create } from "zustand";

const usePinHook = create((set, get) => ({
  // state
  pin: "",

  // setter
  setPin: (newPin) => set({ pin: newPin }),

  // getter
  getPin: () => get().pin,

  // optional: reset
  resetPin: () => set({ pin: "" }),
}));

export default usePinHook;
