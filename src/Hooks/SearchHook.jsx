import { post, read } from "../Services/RequestMethods";
import { create } from "zustand";

const PATH = "search";

const useSearchHook = create((set) => ({
  results: [],
  suggestions: [],

  getSearchResults: async (callBack, query) => {
    read({
      url: `${PATH}/items`,
      params: { query: query },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ results: data.data });
        callBack(status, message);
      },
    });
  },

  getSearchSuggestions: async (callBack, query) => {
    read({
      url: `${PATH}/items/suggestions`,
      params: { query: query },
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ suggestions: data.data });
        callBack(status, message);
      },
    });
  },
}));

export default useSearchHook;
