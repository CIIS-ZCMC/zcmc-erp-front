import { create } from "zustand";
import { post, read, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";
import { Stack, Typography } from "@mui/joy";

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

  approveItemRequest: (form, setAlertDialog, closeModal, reloadtable) => {
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
              <Stack spacing={1}>
                <Typography level="h5" fontWeight="xl">
                  Request Updated
                </Typography>

                <Typography level="body-md" sx={{ color: "custom.darkgreen" }}>
                  Status : {data?.data?.status?.toUpperCase()}
                </Typography>

                <Typography level="body-sm">
                  You may now proceed to the approval page.
                </Typography>
              </Stack>
            </>
          ),
        });
        closeModal();
        reloadtable();
      },
      failed: (err) => {
        setAlertDialog({
          isOpen: true,
          status: "error",
          title: (
            <>
              <Stack spacing={1}>
                <Typography level="h5" fontWeight="xl">
                  Something went wrong
                </Typography>

                <Typography level="body-sm">Status update failed</Typography>
              </Stack>
            </>
          ),
        });
      },
    });
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
              <Stack spacing={2}>
                <Typography level="h4" fontWeight="xl">
                  Request Updated
                </Typography>

                <Typography
                  level="body-md"
                  sx={{ color: "custom.darkgreen", fontWeight: "lg" }}
                >
                  Item Name: {data?.data?.name}{" "}
                  <Typography component="span" sx={{ color: "text.secondary" }}>
                    (ID #{data?.data?.code})
                  </Typography>
                </Typography>

                <Typography level="body-sm" sx={{ mt: 1 }}>
                  You may now proceed to the <strong>approval step</strong>.
                </Typography>
              </Stack>
            </>
          ),
        });

        reloadSelected(id);
        reload();
      },
      failed: (err) => {
        setAlertDialog({
          isOpen: true,
          status: "error",
          title: (
            <>
              <Stack spacing={1}>
                <Typography level="h5" fontWeight="xl">
                  Request Updated Failed
                </Typography>

                <Typography level="body-sm">
                  Please check all required inputs
                </Typography>
              </Stack>
            </>
          ),
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
