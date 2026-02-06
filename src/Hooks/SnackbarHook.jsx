import { create } from "zustand";

const useSnackbarHook = create((set) => ({
  statusCode: null,
  title: "",
  variant: "solid",

  description: "",
  isOpen: false,

  // SHOW SNACKBAR
  showSnack: (statusCode, title, variant, description) => {
    set(() => ({
      isOpen: true,
      title: title,
      description: description,
      statusCode: statusCode,
      variant: variant,
    }));
  },

  // HANDLE CLOSE SNACKBAR
  closeSnack: () => {
    set(() => ({
      isOpen: false,
    }));
  },
}));

export default useSnackbarHook;
