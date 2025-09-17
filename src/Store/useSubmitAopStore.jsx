import { create } from "zustand";

const useSubmitAopStore = create((set) => ({
    isSubmitLoading: false,
    alertDialog: null,

    setIsSubmitLoading: (isSubmitLoading) => set({ isSubmitLoading }),
    setAlertDialog: (alertDialog) => set({ alertDialog }),
    clearAlertDialog: () => set = ({ setAlertDialog: null }),
}))

export default useSubmitAopStore;
