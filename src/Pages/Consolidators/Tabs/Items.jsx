import React, { Fragment, useEffect, useState } from "react";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Textarea, Typography } from "@mui/joy";
import { Stack, Link } from "@mui/joy";
import { IoInformationOutline, IoOpen, IoOpenOutline } from "react-icons/io5";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
import useModalHook from "../../../Hooks/ModalHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import { itemCols } from "../../../Data/Columns";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import { handleChangeInput } from "../../../Utils/HandleInput";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { Add } from "@mui/icons-material";

export const Items = () => {
  const { openModal, setOpenModal, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const { pin, setPin, resetPin } = usePinHook;
  const {
    resetInput,
    setUpdateData,
    Items,
    getItems,
    pagination,
    navLinks,
    currentPage,
    setCurrentPage,
    setSearchQuery,
    search_Query,
    updateData,
    updateItem,
  } = useLibItemHook();

  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    estimated_budget: "",
  });
  const [page, setPage] = useState(1);

  const handleUpdate = (data) => {
    resetPin;
    setOpenUpdate(true);
    setUpdateData(data);
  };

  const update = () => {
    const formData = new FormData();
    formData.append("id", updatedData.id);
    formData.append("name", updatedData.name);
    formData.append("price", updatedData.estimated_budget);
    formData.append("pin", pin);

    updateItem(formData, updatedData.id, (status, message) => {
      console.log(status, message);
    });
  };

  const handleDelete = (params) => {
    resetPin;
    setOpenDel(true);
    setUpdateData(params);
    const data = {
      status: "error",
      title: `Delete item (${params?.name}) ?`,
      description: "This action cannot be undone.",
    };
    setConfirmationModal(data);
  };

  const deleteItem = (selected) => {
    setOpenDel(false);
  };

  useEffect(() => {
    setLoading(true);
    getItems({
      page: page,
      per_page: 10,
      search: search_Query, // Pass the current search query
      callBack: (status, message) => {
        setLoading(false);
        console.log("Response:", status, message);
      },
    });
  }, [page, search_Query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1); // 👈 Only change the page, let the other useEffect handle loading & fetching
    }, 500);

    return () => clearTimeout(handler);
  }, [search_Query]);

  useEffect(() => {
    if (openUpdate && updateData) {
      setUpdatedData({
        name: updateData.name || "",
        estimated_budget: updateData.estimated_budget || "",
      });
    }
  }, [updateData, openUpdate]);

  return (
    <Fragment>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography level="body-md" fontWeight={600}>
            Items
          </Typography>
          <Typography level="body-sm">
            Manage all procurement items in your system
          </Typography>
        </Stack>
        <Stack direction={"row"} gap={1}>
          <SearchWithSuggestions />
          <ButtonComponent label={"Add New Item"} startDecorator={<Add />} />
        </Stack>
      </Stack>
      <ExpandableTable
        rows={Items}
        isLoading={loading}
        columns={itemCols(handleUpdate, handleDelete)}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
        totalRows={pagination.total}
        stickyFooter
        height="60vh"
      />
      {openUpdate && (
        <ModalComponent
          title={
            <Typography>
              Update item{" "}
              <Typography sx={{ color: "#C98503" }}>
                ({updateData.name})
              </Typography>
            </Typography>
          }
          height="auto"
          maxWidth={"480px"}
          isOpen={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          rightButtonAction={() => update()}
          content={
            <>
              <Stack gap={2}>
                <TextareaComponent
                  name={"name"}
                  label={"Item Name"}
                  value={updatedData.name}
                  onChange={(e) =>
                    handleChangeInput("name", setUpdatedData, e.target.value)
                  }
                />
                <InputComponent
                  label={"Estimated budget"}
                  name={"estimated_budget"}
                  value={updatedData.estimated_budget}
                  handleInput={(e) =>
                    handleChangeInput(
                      "estimated_budget",
                      setUpdatedData,
                      e.target.value
                    )
                  }
                  type="number"
                />
                <InputComponent
                  label={"Authorization PIN"}
                  type="password"
                  placeholder={"Enter your authorization PIN"}
                  value={pin}
                  setValue={setPin}
                  helperText={
                    "Confirm you action by typing-in your authorization PIN."
                  }
                />
              </Stack>
            </>
          }
          hasActionButtons
        />
      )}
      {openDel && (
        <ConfirmationModalComponent
          status="error"
          leftButtonAction={() => {
            closeConfirmation();
            setOpenDel(false);
          }}
          rightButtonAction={() => deleteItem(updateData.id)}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
