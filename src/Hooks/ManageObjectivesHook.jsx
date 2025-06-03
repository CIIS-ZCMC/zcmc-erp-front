import { create } from "zustand";
import { post, read, remove, update } from "../Services/RequestMethods";

const PATH = "objective";

const useManageObjHook = create((set, get) => ({
  objectives: [],
  pagination: {},
  navLinks: {},
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getObjectives: (page = 1, callBack) => {
    const { searchQuery } = get();
    const params = {
      page: page,
      per_page: 10, // Set the number of items per page
    };
    if (searchQuery && searchQuery.length > 1) {
      params.search = searchQuery; // Add search query to params if it has more than 1 character
    }

    read({
      url: `${PATH}s`,
      params,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({
          objectives: data.data,
          pagination: data.meta,
          navLinks: data.links,
        });
        callBack(status, message, data);
      },
    });
  },

  postObjective: async (body, callback) => {
    post({
      url: `${PATH}s`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          objectives: [...state.objectives, data],
        }));

        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  updateObjective: async (body, callback) => {
    update({
      url: `${PATH}s`,
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        set((state) => ({
          objectives: state.objectives.map((obj) =>
            obj.id === data.id ? { ...obj, ...data } : obj
          ),
        }));

        callback(response.status, message, data);
      },
      failed: callback,
    });
  },

  removeObj: async (params, body, callback) => {
    remove({
      url: `${PATH}s`,
      param: { id: params },
      form: body,
      success: (response) => {
        const { message, data } = response.data;
        callback(response.status, message, data);
      },
      failed: callback,
    });
  },
}));

export default useManageObjHook;
