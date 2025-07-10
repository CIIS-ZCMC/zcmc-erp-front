import { create } from "zustand";
import { API } from "../../Data/constants";
import { read } from "../../Services/RequestMethods";

const useLibItemHook = create((set, get) => ({
  Items: [],
  pagination: {},
  navlinks: {},
  currentPage: 1,
  search_Query: "",

  setSearchQuery: (query) => {
    console.log("Setting search query:", query);
    set({ search_Query: query });
  },
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  inputs: {
    specifications: [],
  },

  getItems: async ({ per_page = 15, callBack } = {}) => {
    const { currentPage, search_Query } = get();

    const params = {
      page: currentPage,
      per_page,
    };

    if (search_Query && search_Query.length > 1) {
      params.search = search_Query;
    }

    read({
      url: `items`,
      params,
      failed: (err) => {
        set({ isLoading: false, error: err });
        if (callBack)
          callBack(false, err?.message || "Failed to fetch categories");
      },
      success: (res) => {
        const { status, message, data, meta } = res;
        set({
          Items: data.data,
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

  updateData: null,
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
        specifications: [
          {
            description: "",
          },
        ],
      },
    });
  },
  setInputSpecification: (newSpecs) =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        specifications: newSpecs,
      },
    })),

  setUpdateData: (data) => {
    set({ updateData: data });
  },
}));

export default useLibItemHook;
