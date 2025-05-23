import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

const usePurchaseTypeHook = create((set) => ({
  purchase_types: [],

  getPurchaseType: (callBack) => {
    read({
      url: API.TYPE_OF_PURCHASE,
      failed: callBack,
      success: (res) => {
        console.log("fetch purchase type");
        const {
          status,
          message,
          data: { data },
        } = res;
        set({ purchase_types: data });
        callBack(status, message);
      },
    });
  },
}));

export default usePurchaseTypeHook;
