import { create } from "zustand";
import { read, remove } from "../Services/RequestMethods";

const PATH = "objective";

const useManageObjHook = create((set) => ({
  objectives: [],

  getObjectives: (callBack) => {
    read({
      url: `${PATH}-success-indicators`,
      //   params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ objectives: data.data });
        callBack(status, message, data);
      },
    });
  },

  removeObj: async (params, callback) => {
    remove({
      url: `${PATH}-success-indicators`,
      params: params,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },
}));

export default useManageObjHook;
