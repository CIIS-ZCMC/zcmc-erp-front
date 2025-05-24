import { create } from "zustand";

const useModalHook = create((set, get) => ({
  modalState: { isOpen: false },
  successDialog: true,
  setSuccessDialog: (state) => set({ successDialog: state }),
  openModal: {
    isNew: false,
    isDelete: false,
    isOpen: false,
  },
  confirmationModalState: {
    isOpen: false,
    status: null,
    title: "This is a sample confirmation modal title message (?)",
    description: "This is a sample description for your confirmation modal.",
    content: null,
    rightButtonLabel: "Proceed",
    rightButtonAction: null,
    rightButtonDisabled: false,
    leftButtonLabel: "Cancel",
    leftButtonAction: null,
    isLoading: false,
    withAuthPin: false,
    withDivider: false,
    pinHelperText: "Confirm your action by entering your PIN.",
  },

  alertDialogState: {
    isGlobal: true,
    isOpen: false,
    status: null,
    title: "This is a title",
    description: "This is subtitle.",
  },

  setOpenModal: (isNew, isDelete, Open) => {
    set({
      openModal: {
        isNew: isNew,
        isDelete: isDelete,
        isOpen: Open,
      },
    });
  },
  // HANDLE ALERT STATE
  setAlertDialog: (data) => {
    const { status, title, description, isGlobal = true } = data ?? null;

    try {
      get().closeConfirmation();
      set(() => ({
        alertDialogState: {
          isGlobal: isGlobal,
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
    const {
      status,
      title,
      description,
      content,
      leftButtonLabel,
      withDivider,
      rightButtonLabel,
      rightButtonAction,
      rightButtonDisabled,
      leftButtonAction,
      isLoading,
      withAuthPin,
      pinHelperText,
    } = data ?? null;

    get().closeConfirmation();

    try {
      set(() => ({
        confirmationModalState: {
          isOpen: true,
          status: status,
          title: title,
          description: description,
          content: content,
          leftButtonLabel: leftButtonLabel,
          withDivider: withDivider,
          rightButtonLabel: rightButtonLabel,
          rightButtonAction: rightButtonAction,
          rightButtonDisabled: rightButtonDisabled,
          leftButtonAction: leftButtonAction,
          isLoading: isLoading,
          withAuthPin: withAuthPin,
          pinHelperText: pinHelperText,
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
        modalContent: null,
        withDvdr: false,
        content: null,
        rightButtonLabel: "Proceed",
        rightButtonAction: null,
        rightButtonDisabled: false,
        leftButtonLabel: "Cancel",
        leftButtonAction: null,
        isLoading: false,
        withAuthPin: false,
        withDivider: false,
        pinHelperText: "Confirm your action by entering your PIN.",
      },
    }));
  },
}));

export default useModalHook;
