import { create } from "zustand";
import { post, read, remove, update } from "../Services/RequestMethods";

const PATH = "objective";

const useManageObjHook = create((set) => ({
  objectives: [],
  pagination: {},
  navLinks: {},

  getObjectives: (page = 1, callBack) => {
    read({
      url: `${PATH}s`,
      params: { page: page },
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
        console.log(data);
        // Append the new objective to the list
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
        console.log(data);
        // Update the objectives array in state
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
