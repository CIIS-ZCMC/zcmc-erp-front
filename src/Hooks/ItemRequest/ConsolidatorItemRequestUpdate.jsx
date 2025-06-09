import { create } from "zustand";
import { post, read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { Typography } from "@mui/joy";

const useListUserRequestItemHook = create((set, get) => ({
  selected_data: null,
  inputs: {},
  setSelectedData: (selected) => {
    set({ selected_data: selected });
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

  updateItemRequest: (
    form,
    setError,
    setAlertDialog,
    reload,
    reloadSelected
  ) => {
    const id = get().selected_data?.id;
    update({
      url: `${API.REQUEST_ITEM}/${id}`,
      form: form,
      success: (res) => {
        const { data } = res;
        console.log("Item Succes update added successfully:", data);
        setAlertDialog({
          isOpen: true,
          status: "success",
          title: (
            <>
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
                <Typography
                  sx={{ color: "custom.darkgreen" }}
                  component="span"
                  color="primary"
                >
                  #{data?.data?.id}
                </Typography>{" "}
                You can use it for requesting AOP and PPMP documents. Everyone
                can see and use the new item
              </Typography>
            </>
          ),
          description:
            "You can now use it for requesting AOP and PPMP documents. Everyone can see and use the new item.",
        });

        reloadSelected(id);
        reload(() => {});
      },
      failed: (err) => {
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

export default useListUserRequestItemHook;
