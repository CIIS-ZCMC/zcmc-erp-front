import { create } from "zustand";
import { read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useCategoryHooks = create((set, get) => ({
  inputs: {
    currentLibName: "sada",
    pin: null,
  },
  categories: [],
  pagination: {
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  },
  currentPage: 1,
  search_Query: "",
  isLoading: false,
  error: null,

  setSearchQuery: (query) => {
    console.log("Setting search query:", query);
    set({ search_Query: query });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  getPaginatedCategories: async ({ page, per_page = 15, callBack } = {}) => {
    const { currentPage, search_Query } = get();

    const params = {
      page,
      per_page,
    };

    if (search_Query && search_Query.length > 1) {
      params.search = search_Query;
    }
    set({ isLoading: true, error: null });

    read({
      url: `${API.ITEM_CATEGORIES}`,
      params,
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

  type: "create", // ['create', 'update', 'delete']
  isloading: false,
  hasError: true,
  selectedData: null,
  setSelectedData: (data) => {
    set({ selectedData: data });
  },
  setInputs: (name, value) =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        [name]: value,
      },
    })),

  resetInput: () => {
    set({
      inputs: {
        currentLibName: "",
        pin: null,
      },
    });
  },

  setLoading: (isloading) => {
    set({ isloading });
  },

  setError: (error) => {
    set({ hasError: error });
  },

  setType: (newType) => {
    const validTypes = ["create", "update", "delete"];
    if (validTypes.includes(newType)) {
      set({ type: newType });
    } else {
      console.warn(`Invalid type "${newType}" passed to setType.`);
    }
  },
}));

export default useCategoryHooks;
