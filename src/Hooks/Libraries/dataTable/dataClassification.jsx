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
    console.log("Setting search query:", query);
    set({ search_Query: query });
  },
  getClassifications: (failedCallback) => {
    const { currentPage: page, search_Query: search } = get(); // 🔥 correctly access the current state

    const params = {
      page: page,
      per_page: 15, // Set the number of items per page
    };

    if (search && search.length > 1) {
      params.search = search; // Add search query to params if it has more than 1 character
    }

    read({
      url: API.ClASSIFICATION,
      params,
      failed: failedCallback,
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
        return res;
      },
    });
  },
}));

export default useClassificationDataTable;
