import { create } from "zustand";
import { post, read } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { Typography } from "@mui/joy";

const useUserRequestItemHook = create((set, get) => ({
  myRequests_dataTable: [],
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
  getMyItemRequestLists: (failedCallback) => {
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
      url: API.REQUEST_ITEM,
      params,
      failed: failedCallback,
      success: (res) => {
        console.log(res);
        const {
          data: { data, meta, links },
        } = res;

        set({
          myRequests_dataTable: data,
          pagination: meta,
          links: links,
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        });
        return res;
      },
    });
  },

  addUserRequestItem: (
    form,
    setError,
    clearInputs,
    setAlertDialog,
    closemodal
  ) => {
    post({
      url: API.REQUEST_ITEM,
      form: form,
      success: (res) => {
        const { data } = res;
        console.log("UserRequestItem added successfully:", data);
        clearInputs();
        setAlertDialog({
          isOpen: true,
          status: "success",
          title: (
            <>
              {/* {JSON.stringify(data)} */}
              <Typography level="title-md" fontWeight="lg">
                New item with ID #{" "}
                <Typography
                  level="title-md"
                  sx={{ color: "custom.darkgreen" }}
                  fontWeight={"lg"}
                >
                  "{data?.data?.id}" - {data?.data?.name}{" "}
                </Typography>
                successfully submitted.
                {/* {data?.data?.name}{" "} */}
              </Typography>
            </>
          ),
          description:
            "You can now use it for requesting AOP and PPMP documents. Everyone can see and use the new item.",
        });
        closemodal();
      },
      failed: (err) => {
        console.log(err);
        setAlertDialog({
          isOpen: true,
          status: "error",
          title: (
            <>
              <Typography level="title-md" fontWeight="lg">
                New item "#2023-0031" successfully saved to the library
                {/* {data?.data?.name}{" "} */}
                <Typography
                  sx={{ color: "custom.darkgreen" }}
                  component="span"
                  color="primary"
                  fontWeight="lg"
                >
                  {/* #{data?.data?.id} */}
                </Typography>{" "}
                ERORRds
              </Typography>
            </>
          ),
          description:
            "You can now use it for requesting AOP and PPMP documents. Everyone can see and use the new item.",
        });
      },
    });
  },
}));

export default useUserRequestItemHook;
