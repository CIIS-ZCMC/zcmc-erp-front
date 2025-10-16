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

  const data =
    Items.map((row) => ({
      id: row.id,
      name: row.name,
      classification: row.classification,
      item_category: row.category,
      variant: row.variant,
      unit: row.item_unit.name,
      estimated_budget: row.estimated_budget,
    })) || [];

  useEffect(() => {
    setLoading(true);
    getItems({
      per_page: 15,
      search: search_Query, // Pass the current search query
      callBack: (status, message) => {
        setLoading(false);
        console.log("Response:", status, message);
      },
    });
  }, [currentPage, search_Query]);

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
      <ServerTableComponent
        data={data}
        isLoading={loading}
        columns={itemCols(handleUpdate, handleDelete)}
        pageSize={pagination?.per_page}
        onPageChange={setCurrentPage}
        paginationMeta={pagination}
        stripe="even"
        withCount={pagination?.total}
        fieldsToSearch={["name", "classification", "item_category"]}
        search={search_Query}
        setSearch={setSearchQuery}
        bordered
        hoverRow
        stickLast
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
