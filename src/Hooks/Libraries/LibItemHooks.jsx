import { create } from "zustand";
import { API } from "../../Data/constants";
import { read, remove, update } from "../../Services/RequestMethods";

const useLibItemHook = create((set, get) => ({
  Items: [],
  pagination: {},
  navlinks: {},
  currentPage: 1,
  search_Query: "",
  updateData: {},

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
          error: null,
        });

        if (callBack) callBack(status, message);
      },
    });
  },

  updateItem: async (body, param, callback) => {
    update({
      url: `items`,
      // param: { id: param },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          Items: state.Items.map((itm) =>
            itm.id === data.id ? { ...itm, ...data } : itm
          ),
        }));

        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  removeItem: async (params, body, callback) => {
    remove({
      url: `items/destroy`,
      param: { id: params },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  setUpdateData: (data) => {
    set({ updateData: data });
  },
}));

export default useLibItemHook;
