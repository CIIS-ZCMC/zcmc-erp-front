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

  getObjectives: async (params = {}, callback) => {
    return new Promise((resolve, reject) => {
      read({
        url: `${PATH}s`,
        params,
        success: (res) => {
          const { data } = res;
          set({
            objectives: data.data,
            pagination: data.meta,
            navLinks: data.links,
          });
          resolve(res);
        },
        failed: callback,
      });
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
            obj.id === data.id ? { ...obj, ...data } : obj,
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
