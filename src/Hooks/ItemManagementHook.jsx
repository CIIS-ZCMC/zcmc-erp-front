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
  terminology: [],
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
    set({ search_Query: query });
  },

  getItems: async (params = {}, callBack) => {
    read({
      url: `${PATH}s`,
      params: { ...params },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        console.log("ITEMS DATA:", data);
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

  updateItem: async (id, body, callback) => {
    update({
      url: `${PATH}s/${id}`,
      // param: { id: param },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          items: state.items.map((itm) =>
            itm.id === data.id ? { ...itm, ...data } : itm,
          ),
        }));

        callback(response.status, message);
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

  unarchiveItem: async (id, body, callBack) => {
    update({
      url: `${PATH}s/${id}/restore`,
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

  getArchivedItems: async ({
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
      url: `${PATH}s/trashbin`,
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

  //categories
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

  getPaginatedCategories: async ({
    page,
    per_page = 15,
    search,
    callBack,
  } = {}) => {
    const params = {
      page,
      per_page,
      search,
    };

    set({ isLoading: true, error: null });

    read({
      url: `${PATH}-categories`,
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

  getArchivedCategories: async ({
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
      url: `${PATH}-categories/trashbin`,
      params,
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
          error: null,
        });

        if (callBack) callBack(status, message);
      },
    });
  },

  postNewCategory: async (body, callback) => {
    post({
      url: `${PATH}-categories`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;

        set((state) => {
          const total = (state.pagination?.total || 0) + 1;
          const perPage = state.pagination?.per_page || 10;

          return {
            categories:
              state.pagination?.current_page === 1
                ? [data, ...state.categories]
                : state.categories,

            pagination: state.pagination
              ? {
                  ...state.pagination,
                  total,
                  last_page: Math.ceil(total / perPage),
                }
              : state.pagination,

            // newItemId: data.id,
          };
        });
        // Remove highlight after 3 seconds
        // setTimeout(() => {
        //   set((state) => ({ ...state, newItemId: null }));
        // }, 3000);
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  updateCategory: async (id, body, callback) => {
    update({
      url: `${PATH}-categories/${id}`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          categories: state.categories.map((itm) =>
            itm.id === data.id ? { ...itm, ...data } : itm,
          ),
        }));

        callback(response.status, message);
      },
      failed: (status, message) => {
        callback(status, message);
      },
    });
  },

  archiveCategory: async (id, body, callBack) => {
    remove({
      url: `${PATH}-categories/${id}`,
      form: body, // { authorization_pin }
      success: ({ status, data }) => {
        const { message } = data;

        set((state) => ({
          categories: state.categories.filter((res) => res.id !== id),
        }));

        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },

  unarchiveCategory: async (id, body, callBack) => {
    update({
      url: `${PATH}-categories/${id}/restore`,
      form: body, // { authorization_pin }
      success: ({ status, data }) => {
        const { message } = data;
        set((state) => ({
          categories: state.categories.filter((res) => res.id !== id),
        }));

        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },

  //classification

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

  postNewClassification: async (body, callback) => {
    post({
      url: `${PATH}-classifications`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;

        set((state) => {
          const total = (state.pagination?.total || 0) + 1;
          const perPage = state.pagination?.per_page || 10;

          return {
            classification:
              state.pagination?.current_page === 1
                ? [data, ...state.classification]
                : state.classification,

            pagination: state.pagination
              ? {
                  ...state.pagination,
                  total,
                  last_page: Math.ceil(total / perPage),
                }
              : state.pagination,

            // newItemId: data.id,
          };
        });
        // Remove highlight after 3 seconds
        // setTimeout(() => {
        //   set((state) => ({ ...state, newItemId: null }));
        // }, 3000);
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  updateClassification: async (id, body, callback) => {
    update({
      url: `${PATH}-classifications/${id}`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          classification: state.classification.map((itm) =>
            itm.id === data.id ? { ...itm, ...data } : itm,
          ),
        }));

        callback(response.status, message);
      },
      failed: (status, message) => {
        callback(status, message);
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

  unarchiveClassification: async (id, body, callBack) => {
    update({
      url: `${PATH}-classifications/${id}/restore`,
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

  //item units
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

  //terminologies

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

  getSystems: async (callBack) => {
    read({
      url: `system`,
      params: { mode: "selection" },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ variants: data.data });
        callBack(status, message);
      },
    });
  },

  getPaginatedTerminology: async ({
    page = 1,
    per_page = 15,
    search,
    callBack,
  } = {}) => {
    read({
      url: `${PATH}-reference-terminologies`,
      params: { page, per_page, search },
      failed: (err) => {
        set({ isLoading: false, error: err });
        if (callBack)
          callBack(false, err?.message || "Failed to fetch categories");
      },
      success: (res) => {
        const { status, message, data, meta } = res;
        set({
          terminology: data.data,
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

  getArchivedTerminology: async ({
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
      url: `${PATH}-reference-terminologies/trashbin`,
      params,
      success: (res) => {
        const { status, message, data, meta } = res;
        set({
          terminology: data.data,
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

  postNewTerminology: async (body, callback) => {
    post({
      url: `${PATH}-reference-terminologies`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;

        // Normalize response to array
        const newItems = Array.isArray(data) ? data : [data];
        const newCount = newItems.length;

        set((state) => {
          const total = (state.pagination?.total || 0) + newCount;
          const perPage = state.pagination?.per_page || 10;

          return {
            terminology:
              state.pagination?.current_page === 1
                ? [...newItems, ...state.terminology]
                : state.terminology,

            pagination: state.pagination
              ? {
                  ...state.pagination,
                  total,
                  last_page: Math.ceil(total / perPage),
                }
              : state.pagination,
          };
        });

        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  updateTerminology: async (id, body, callback) => {
    update({
      url: `${PATH}-reference-terminologies/${id}`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          terminology: state.terminology.map((itm) =>
            itm.id === data.id ? { ...itm, ...data } : itm,
          ),
        }));

        callback(response.status, message);
      },
      failed: (status, message) => {
        callback(status, message);
      },
    });
  },

  archiveTerminology: async (id, body, callBack) => {
    remove({
      url: `${PATH}-reference-terminologies/${id}`,
      form: body, // { authorization_pin }
      success: ({ status, data }) => {
        const { message } = data;

        set((state) => ({
          terminology: state.terminology.filter((res) => res.id !== id),
        }));

        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },

  unarchiveTerminology: async (id, body, callBack) => {
    update({
      url: `${PATH}-reference-terminologies/${id}/restore`,
      form: body, // { authorization_pin }
      success: ({ status, data }) => {
        const { message } = data;
        set((state) => ({
          terminology: state.terminology.filter((res) => res.id !== id),
        }));

        callBack(status, message);
      },
      failed: (status, message) => {
        callBack(status, message);
      },
    });
  },

  getVariantsByCategory: async (item_category_id, callBack) => {
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

  //search
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

  clearVariants: () => set({ variants: [] }),
}));

export default useItemsHook;
