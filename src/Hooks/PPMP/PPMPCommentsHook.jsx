import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const usePPMPCommentsHook = create((set) => ({
  ppmpComments: [], // ⬅️ NEW: Store comments
  isLoading: false,

  actions: {
    /* ----------- GET PPMP COMMENTS ----------- */
    getPPMPComments: (ppmp_item_id, callback) => {
      set(() => ({ isLoading: true }));

      read({
        url: `${API.PPMP_COMMENTS}`, // <-- Change this to your actual API
        params: { ppmp_item_id },
        success: (res) => {
          const { data, message } = res.data;
          console.log("comments", data);
          set(() => ({
            ppmpComments: data.comments, // store the comments
            isLoading: false,
          }));

          callback?.(200, message);
        },
        failed: () => {
          callback?.();
          set({ isLoading: false });
        },
      });
    },

    /* ----------- POST NEW COMMENT ----------- */
    postPPMPComment: (form, callback) => {
      post({
        url: `${API.POST_PPMP_COMMENTS}`, // <-- Change to your backend endpoint
        form: form,
        success: (res) => {
          const { data, message } = res.data;
          console.log(data);
          // Append new comment
          set(() => ({
            ppmpComments: [...usePPMPComments, data], // ⬅️ append
          }));

          callback?.(200, message);
        },
        failed: callback,
      });
    },
  },
}));

export const usePPMPCommentsActions = () =>
  usePPMPCommentsHook((state) => state.actions);

export const usePPMPComments = () => {
  const ppmpComments = usePPMPCommentsHook((state) => state.ppmpComments);

  return { ppmpComments };
};
