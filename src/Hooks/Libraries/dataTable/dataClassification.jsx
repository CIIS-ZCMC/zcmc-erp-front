import { create } from "zustand";
import { read } from "../../../Services/RequestMethods";
import { API } from "../../../Data/constants";

const useClassificationDataTable = create((set, get) => ({
  classi_dataTable: [],
  search_dataTable: [],
  search_Query: "",
  pagination: null,
  links: null,
  currentPage: 1,
  totalPages: 1,
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  setSearchQuery: (query) => {
    //dont trigger search if query is less than 1 characters
    if (!query || query.length < 1) {
      set({ search_Query: query, classi_dataTable: [] });
      return;
    }
    read({
      url: API.ClASSIFICATION,
      params: {
        search: query,
      },
      success: (res) => {
        const {
          data: { data, meta, links },
        } = res;

        set({
          classi_dataTable: data,
          pagination: meta,
          links: links,
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        });
      },
    });
  },
  getClassification: (failedCallback) => {
    const { currentPage: page } = get(); // 🔥 correctly access the current state

    read({
      url: API.ClASSIFICATION,
      params: {
        page: page,
      },
      failed: failedCallback,
      success: (res) => {
        console.log("Fetched classification data");
        const {
          data: { data, meta, links },
        } = res;

        set({
          classi_dataTable: data,
          pagination: meta,
          links: links,
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        });
      },
    });
  },
}));

export default useClassificationDataTable;
