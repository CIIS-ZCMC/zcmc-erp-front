import { create } from "zustand";
import { read } from "../../../Services/RequestMethods";

const PATH = "categories";

export const useCategoryHook = create((set) => ({
  categories: [],
  pagination: {
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  },
  isLoading: false,
  error: null,

  getPaginatedCategories: async ({
    page = 1,
    per_page = 15,
    callBack,
  } = {}) => {
    set({ isLoading: true, error: null });

    read({
      url: `item-${PATH}`,
      params: { page, per_page },
      failed: (err) => {
        set({ isLoading: false, error: err });
        if (callBack)
          callBack(false, err?.message || "Failed to fetch categories");
      },
      success: (res) => {
        const { status, message, data, meta } = res;
        set({
          categories: data.data,
          pagination: {
            total: data?.meta?.pagination?.total,
            per_page: data?.meta?.pagination?.per_page,
            current_page: data?.meta?.pagination?.current_page,
            last_page: data?.meta?.pagination?.last_page,
          },
          isLoading: false,
          error: null,
        });

        if (callBack) callBack(status, message);
      },
    });
  },

  setCurrentPage: (page) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        current_page: page,
      },
    })),
}));
