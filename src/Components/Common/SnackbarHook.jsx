import { create } from "zustand";

const useSnackbarHook = create((set) => ({
  statusCode: null,
  title: "",
  description: "",
  isOpen: false,

  // SHOW SNACKBAR
  showSnack: (statusCode, title, description) => {
    set(() => ({
      isOpen: true,
      title: title,
      description: description,
      statusCode: statusCode,
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
