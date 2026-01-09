import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { post, read, remove, update } from "../Services/RequestMethods";

const PATH = "item";

const useItemsHook = create((set) => ({
  items: [],
  categories: [],
  classification: [],
  units: [],
  variants: [],
  pagination: null,
  newItemId: null,
  selectedData: null,
  search_Query: "",
  // itemsLoading: false,
  // itemsError: null,

  setSelectedData: (data) => {
    set({ selectedData: data });
  },

  setSearchQuery: (query) => {
    console.log("Setting search query:", query);
    set({ search_Query: query });
  },

  getItems: async (callBack) => {
    read({
      url: `${PATH}s`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ items: data.data });
        callBack(status, message);
      },
    });
  },

  getItemsPaginated: async ({
    page = 1,
    per_page = 10,
    search,
    callBack,
  } = {}) => {
    const params = {
      page: page,
      per_page,
      search,
    };

    read({
      url: `${PATH}s`,
      params,
      success: (res) => {
        const { status, message, data, meta } = res;
        set({
          items: data.data,
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

  postNewItem: async (body, callback) => {
    post({
      url: `${PATH}s`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;

        set((state) => {
          const total = (state.pagination?.total || 0) + 1;
          const perPage = state.pagination?.per_page || 10;

          return {
            items:
              state.pagination?.current_page === 1
                ? [data, ...state.items]
                : state.items,

            pagination: state.pagination
              ? {
                  ...state.pagination,
                  total,
                  last_page: Math.ceil(total / perPage),
                }
              : state.pagination,

            newItemId: data.id,
          };
        });
        // Remove highlight after 3 seconds
        setTimeout(() => {
          set((state) => ({ ...state, newItemId: null }));
        }, 3000);
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  updateItem: async (id, body, param, callback) => {
    update({
      url: `${PATH}s/${id}`,
      // param: { id: param },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          items: state.items.map((itm) =>
            itm.id === data.id ? { ...itm, ...data } : itm
          ),
        }));

        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  archiveItem: async (id, body, callBack) => {
    remove({
      url: `${PATH}s/${id}`,
      form: body, // { authorization_pin }
      success: ({ status, data }) => {
        const { message } = data;

        set((state) => ({
          items: state.items.filter((res) => res.id !== id),
        }));

        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },

  getArchivedItems: async ({ page = 1, per_page = 10, callBack } = {}) => {
    const params = {
      page: page,
      per_page,
    };

    read({
      url: `${PATH}s/trashbin`,
      params,
      success: (res) => {
        const { status, message, data, meta } = res;
        console.log("Response:", data);
        set({
          items: data.data,
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

  getItemCategories: async (callBack) => {
    read({
      url: `${PATH}-categories`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ categories: data.data });
        callBack(status, message);
      },
    });
  },

  getItemClassification: async (callBack) => {
    read({
      url: `${PATH}-classifications`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ classification: data.data });
        callBack(status, message);
      },
    });
  },

  getClassificationsPaginated: async ({
    page = 1,
    per_page = 10,
    search,
    callBack,
  } = {}) => {
    const params = {
      page: page,
      per_page,
      search,
    };

    read({
      url: `${PATH}-classifications`,
      params,
      success: (res) => {
        const { status, message, data, meta } = res;
        console.log("Response:", data);
        set({
          classification: data.data,
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

  archiveClassification: async (id, body, callBack) => {
    remove({
      url: `${PATH}-classifications/${id}`,
      form: body, // { authorization_pin }
      success: ({ status, data }) => {
        const { message } = data;

        set((state) => ({
          classification: state.classification.filter((res) => res.id !== id),
        }));

        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },

  getArchivedClassification: async ({
    page = 1,
    per_page = 10,
    search,
    callBack,
  } = {}) => {
    const params = {
      page: page,
      per_page,
      search,
    };

    read({
      url: `${PATH}-classifications/trashbin`,
      params,
      success: (res) => {
        const { status, message, data, meta } = res;
        console.log("Response:", data);
        set({
          classification: data.data,
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

  getItemUnits: async (callBack) => {
    read({
      url: `${PATH}-units`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ units: data.data });
        callBack(status, message);
      },
    });
  },

  getVariants: async (callBack) => {
    read({
      url: `terminologies`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ variants: data.data });
        callBack(status, message);
      },
    });
  },

  getVariantsByCategory: async (callBack, item_category_id) => {
    read({
      url: `terminologies`,
      params: { item_category_id },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ variants: data.data });
        callBack(status, message);
      },
    });
  },

  getSearchResults: async (callBack, query) => {
    read({
      url: `search/${PATH}s`,
      params: { query: query },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ items: data.data });
        callBack(status, message);
      },
    });
  },
}));

export default useItemsHook;
