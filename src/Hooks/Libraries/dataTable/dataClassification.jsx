import { create } from "zustand";
import { post, read } from "../../../Services/RequestMethods";
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
  getClassifications: (failedCallback) => {
    const { currentPage: page, search_Query: search } = get(); // 🔥 correctly access the current state

    const params = {
      page: page,
      per_page: 15, // Set the number of items per page
    };

    if (search && search.length > 1) {
      params.search = search; // Add search query to params if it has more than 1 character
      params.page = 1; // Reset to the first page when searching
    }

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
  addClassification: (
    form,
    setLoading,
    setSuccessDialog,
    setError,
    setCloseModal,
    clearInputs
  ) => {
    setLoading(true);
    post({
      url: API.ClASSIFICATION,
      form: form,
      success: (res) => {
        const { data } = res;
        console.log("Classification added successfully:", data);
        setLoading(false);
        setSuccessDialog(true);
        setCloseModal(false);
        clearInputs();
      },
      failed: (err) => {
        console.error("Error adding classification:", err);
        setLoading(false);
        setError(true);
        setSuccessDialog(false);
      },
    });
  },
}));

export default useClassificationDataTable;
