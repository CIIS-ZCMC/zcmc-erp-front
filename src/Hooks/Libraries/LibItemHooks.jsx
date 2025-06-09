import { create } from "zustand";
import { API } from "../../Data/constants";
import { read } from "../../Services/RequestMethods";
const useLibItemHook = create((set) => ({
  Items: [],
  pagination: {},
  navlinks: {},
  currentPage: 1,

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  inputs: {
    specifications: [],
  },
  getItems: async (page = 1, callBack) => {
    read({
      url: `${API.ITEMS_}`,
      params: { page: page },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        console.log(data);
        set({ Items: data.data, pagination: data.meta, navLinks: data.links });
        callBack(status, message);
      },
    });
  },
  SaveItem: async (data, callBack) => {
    console.log(data);
    return;
    try {
      const response = await fetch(`${API.ITEM_CLASSIFICATIONS}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      callBack(data.status, data.message);
    } catch (error) {
      callBack(false, error.message);
    }
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
