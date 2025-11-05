import { create } from "zustand";
import { post, read, update } from "../../Services/RequestMethods";
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

  updateResourceQty: async (id, form, callBack) => {
    update({
      url: `${PATH}-update/${id}/quantity`,
      form: form,
      failed: callBack,
      success: ({ status, data }) => {
        const { message, data: updatedResource } = data;

        set((state) => ({
          resources: state.resources.map((res) =>
            res.id === updatedResource.id
              ? { ...res, quantity: updatedResource.quantity }
              : res
          ),
        }));

        callBack(status, message);
      },
    });
  },
}));

export default useResourcesHook;
