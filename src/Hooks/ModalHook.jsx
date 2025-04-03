import { create } from "zustand";

const useModalHook = create((set, get) => ({
  modalState: { isOpen: false },
  confirmationModalState: {
    isOpen: false,
    status: null,
    title: "This is a sample confirmation modal title message (?)",
    description: "This is a sample description for your confirmation modal.",
    content: null,
  },

  alertDialogState: {
    isOpen: false,
    status: null,
    title: "This is a title",
    description: "This is subtitle.",
  },

  // HANDLE ALERT STATE
  setAlertDialog: (data) => {
    const {
      status = null,
      title = "This is a title",
      description = "This is a description.",
    } = data ?? null;

    try {
      get().closeConfirmation();
      set(() => ({
        alertDialogState: {
          isOpen: true,
          status: status,
          title: title,
          description: description,
        },
      }));
    } catch (e) {
      console.log(e, "Error occured in [setAlertDialog] function");
    }
  },

  closeAlertDialog: () => {
    try {
      set(() => ({
        alertDialogState: {
          isOpen: false,
          // status: null,
          // title: null,
          // description: null,
        },
      }));
    } catch (e) {
      console.log(e, "Error occured in [closeAlertDialog] function");
    }
  },

  // CONFIRMATION MODAL
  setConfirmationModal: (data) => {
    const { status, title, description } = data ?? null;

    try {
      set(() => ({
        confirmationModalState: {
          isOpen: true,
          status: status,
          title: title,
          description: description,
        },
      }));
    } catch (e) {
      console.log(e, "Error occured in [setConfirmModal] function");
    }
  },

  closeConfirmation: () => {
    set(() => ({
      confirmationModalState: {
        isOpen: false,
        status: null,
        title: null,
        description: null,
      },
    }));
  },
}));

export default useModalHook;
