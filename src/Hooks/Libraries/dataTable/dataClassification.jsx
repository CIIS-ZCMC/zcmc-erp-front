import { create } from "zustand";
import { post, read } from "../../../Services/RequestMethods";
import { API } from "../../../Data/constants";
import { Typography } from "@mui/joy";

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
  getClassifications: ({ per_page = 15, callBack } = {}) => {
    const { currentPage: page, search_Query: search } = get(); // 🔥 correctly access the current state

    const params = {
      page: page,
      per_page: 15, // Set the number of items per page
    };

    if (search && search.length > 1) {
      params.search = search; // do NOT force page = 1 here
    }

    read({
      url: API.ClASSIFICATION,
      params,
      success: (res) => {
        const {
          data: { data, meta, links, message, status },
        } = res;

        set({
          classi_dataTable: data,
          pagination: meta,
          links: links,
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        });
        if (callBack) callBack(status, message);
      },
    });
  },
  addClassification: (
    form,
    setLoading,
    setError,
    clearInputs,
    setAlertDialog,
    setOpenModal
  ) => {
    setLoading(true);
    post({
      url: API.ClASSIFICATION,
      form: form,
      success: (res) => {
        const { data } = res;
        console.log("Classification added successfully:", data);
        setLoading(false);
        clearInputs();
        setAlertDialog({
          isOpen: true,
          status: "success",
          title: (
            <>
              <Typography level="title-md" fontWeight="lg">
                New item {data?.data?.name}{" "}
                <Typography
                  sx={{ color: "custom.darkgreen" }}
                  component="span"
                  color="primary"
                  fontWeight="lg"
                >
                  #{data?.data?.id}
                </Typography>{" "}
                successfully saved to the library.
              </Typography>
            </>
          ),
          description:
            "You can now use it for requesting AOP and PPMP documents. Everyone can see and use the new item.",
        });
        setOpenModal(false, false, false);
      },
      failed: (err) => {
        console.error("Error adding classification:", err);
        setLoading(false);
        setError(true);
      },
    });
  },
}));

export default useClassificationDataTable;
