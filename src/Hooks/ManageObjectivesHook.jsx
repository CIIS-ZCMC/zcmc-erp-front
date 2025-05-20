import { create } from "zustand";
import { post, read, remove } from "../Services/RequestMethods";

const PATH = "objective";

const useManageObjHook = create((set) => ({
  objectives: [],

  getObjectives: (callBack) => {
    read({
      url: `${PATH}s`,
      //   params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ objectives: data.data });
        callBack(status, message, data);
      },
    });
  },

  postObjective: async (body, callback) => {
    post({
      url: `${PATH}s`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  removeObj: async (params, body, callback) => {
    remove({
      url: `${PATH}s`,
      param: { id: params },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },
}));

export default useManageObjHook;
