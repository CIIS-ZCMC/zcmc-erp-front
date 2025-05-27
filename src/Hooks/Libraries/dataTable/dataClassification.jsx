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
    set({ search_Query: query });
  },
  getClassification: (failedCallback) => {
    const { currentPage: page } = get(); // 🔥 correctly access the current state

    read({
      url: API.ClASSIFICATION,
      params: {
        page: page,
        per_page: 2, // Set the number of items per page
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
