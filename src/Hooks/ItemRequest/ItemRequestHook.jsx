import { read } from "../../Services/RequestMethods";
import { create } from "zustand";

const PATH = "item-request";

const useItemRequestHook = create((set) => ({
  requests: [],
  categories: [],
  classification: [],
  units: [],
  variants: [],
  // itemsLoading: false,
  // itemsError: null,

  getItemRequests: async (callBack, status) => {
    read({
      url: `${PATH}s`,
      params: { status },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ requests: data.data });
        callBack(status, message);
      },
    });
  },
}));

export default useItemRequestHook;
