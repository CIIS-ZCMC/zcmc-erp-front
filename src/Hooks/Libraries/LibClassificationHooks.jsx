import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { Typography } from "@mui/joy";

const useClassificationHook = create((set, get) => ({
  classification_data: [],
  search_dataTable: [],
  search_Query: "",
  pagination: null,
  links: null,
  currentPage: 1,
  totalPages: 1,
  selectedData: {},

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  setSearchQuery: (query) => {
    console.log("Setting search query:", query);
    set({ search_Query: query });
  },

  setSelectedData: (data) => {
    set({ selectedData: data });
  },
  getClassifications: async ({ page = 1, per_page = 10, callBack } = {}) => {
    const { currentPage, search_Query } = get();

    const params = {
      page: page,
      per_page,
    };

    if (search_Query && search_Query.length > 1) {
      params.search = search_Query;
    }

    read({
      url: API.ClASSIFICATION,
      params,
      success: (res) => {
        const { status, message, data, meta } = res;
        console.log("Response:", data);
        set({
          classification_data: data.data,
          pagination: {
            total: data?.meta?.pagination?.total,
            per_page: data?.meta?.pagination?.per_page,
            current_page: data?.meta?.pagination?.current_page,
            last_page: data?.meta?.pagination?.last_page,
          },
          error: null,
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

export default useClassificationHook;
