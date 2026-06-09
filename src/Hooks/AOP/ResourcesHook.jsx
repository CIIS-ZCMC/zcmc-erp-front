import { create } from "zustand";
import { post, read, remove, update } from "../../Services/RequestMethods";
const PATH = "resources";

const useResourcesHook = create((set) => ({
  resources: [],
  activity: {},
  pagination: {},

  getAOPResources: async (callBack, id) => {
    read({
      url: `${PATH}`,
      params: { activity_id: id },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({
          resources: data.data,
          activity: data.activity,
          pagination: data.pagination,
        });
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
        const { message, data: updatedResource, activity } = data;

        set((state) => ({
          resources: state.resources.map((res) =>
            res.id === updatedResource.id
              ? { ...res, quantity: updatedResource.quantity }
              : res,
          ),
          activity: {
            ...state.activity,
            cost: activity?.cost ?? state.activity.cost, // ✅ update only cost
          },
        }));

        callBack(status, message);
      },
    });
  },

  updatePurchaseType: async (id, form, callBack) => {
    update({
      url: `${PATH}-update/${id}/purchase-type`,
      form: form,
      failed: callBack,
      success: ({ status, data }) => {
        const { message, data: updatedResource } = data;

        set((state) => ({
          resources: state.resources.map((res) =>
            res.id === updatedResource.id
              ? { ...res, purchase_type: updatedResource.purchase_type }
              : res,
          ),
        }));

        callBack(status, message);
      },
    });
  },

  deleteResource: async (id, callBack) => {
    remove({
      url: `${PATH}-delete/${id}`,
      failed: callBack,
      success: ({ status, data }) => {
        const { message, data: deletedResource, activity } = data;

        set((state) => ({
          resources: state.resources.filter((res) => res.id !== id),
          activity: {
            ...state.activity,
            cost: activity?.cost ?? state.activity.cost, // ✅ update only cost
          },
        }));
        callBack(status, message);
      },
    });
  },
}));

export default useResourcesHook;
