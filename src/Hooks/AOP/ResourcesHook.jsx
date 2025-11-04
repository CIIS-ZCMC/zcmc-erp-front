import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
const PATH = "resources";

const useResourcesHook = create((set) => ({
  resources: [],

  getAOPResources: async (callBack, id) => {
    read({
      url: `${PATH}`,
      params: { activity_id: id },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ resources: data.data });
        callBack(status, message);
      },
    });
  },

  postAOPResources: async (form, callBack) => {
    post({
      url: `${PATH}-post`,
      form: form,
      failed: callBack,
      success: ({ status, data }) => {
        const { message } = data;
        set({ resources: data.data });
        callBack(status, message);
      },
    });
  },
}));

export default useResourcesHook;
