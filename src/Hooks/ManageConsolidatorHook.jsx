import { create } from "zustand";
import { API } from "../Data/constants";
import { read, update } from "../Services/RequestMethods";

const useManageConsolidatorsHook = create((set, get) => ({
  // =========================
  // STATE
  // =========================
  consolidators: [],
  isLoading: false,
  error: null,

  // =========================
  // ACTIONS
  // =========================
  actions: {
    getConsolidators: async (callback) => {
      set({ isLoading: true, error: null });

      read({
        url: API.CONSOLIDATORS,
        success: (res) => {
          const { status, message, data } = res;

          set({
            consolidators: data.data,
            isLoading: false,
          });

          callback?.(status, message);
        },
        failed: (err) => {
          set({ isLoading: false, error: err });
          callback?.(err?.status ?? 500, err?.message);
        },
      });
    },

    updateConsolidator: async (body, callback) => {
      set({ isLoading: true, error: null });

      update({
        url: API.UPDATE_CONSOLIDATOR,
        form: body,
        success: (response) => {
          const { message, data } = response.data;
          const updatedConsolidator = data[0];

          set((state) => ({
            consolidators: state.consolidators.map((itm) =>
              itm.user_id === updatedConsolidator.user_id
                ? {
                    ...itm,
                    assigned_categories:
                      updatedConsolidator.assigned_categories.map((cat) => ({
                        item_category_id: cat.item_category_id,
                        item_category_name: cat.item_category_name,
                        item_category_code: cat.item_category_code,
                      })),
                  }
                : itm,
            ),
            isLoading: false,
          }));

          callback?.(response.status, message);
        },
        failed: (err) => {
          set({ isLoading: false, error: err });
          callback?.(err?.status ?? 500, err?.message);
        },
      });
    },
  },
}));

export default useManageConsolidatorsHook;
