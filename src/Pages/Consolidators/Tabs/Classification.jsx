import React, { Fragment, useEffect, useRef, useState } from "react";
import { classificationCols } from "../../../Data/Columns";
import useModalHook from "../../../Hooks/ModalHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import { Divider, Stack, Typography } from "@mui/joy";
import InputComponent from "../../../Components/Form/InputComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import useClassificationHook from "../../../Hooks/Libraries/LibClassificationHooks";
import StatusSwitch from "@Components/StatusSwitchComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { AddOutlined } from "@mui/icons-material";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";

export const Classification = () => {
  const { pin, setPin } = usePinHook();
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const {
    classification_data,
    pagination,
    currentPage,
    totalPages,
    setSearchQuery,
    search_Query,
    setCurrentPage,
    getClassifications,
    selectedData,
    setSelectedData,
  } = useClassificationHook();
  const [loading, setLoading] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
  });
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);

  function transformData(data) {
    console.log(data);
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  const handleUpdate = (data) => {
    setOpenUpdate(true);
    setSelectedData(data);
  };

  const handleDelete = (params) => {
    setOpenDel(true);
    setSelectedData(params);
    const data = {
      status: "error",
      title: `Delete classification (${params?.clName}) ?`,
      description: "This action cannot be undone.",
    };
    setConfirmationModal(data);
  };

  const deleteItem = (selected) => {
    setOpenDel(false);
  };

  useEffect(() => {
    setLoading(true);
    getClassifications({
      page,
      per_page: 10,
      search: search_Query, // Pass the current search query
      callBack: (status, message) => {
        setLoading(false);
        console.log("Response:", status, message);
      },
    });
  }, [page, search_Query]);

  useEffect(() => {
    if (openUpdate && selectedData) {
      setUpdateData({
        name: selectedData?.clName || "",
        description: selectedData?.description || "",
      });
    }
  }, [selectedData, openUpdate]);

  return (
    <Fragment>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Typography level="body-sm">View:</Typography>
          <StatusSwitch checked={active} onChange={setActive} />
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <SearchWithSuggestions />
          <ButtonComponent
            label={"Add New Category"}
            startDecorator={<AddOutlined />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>
      {console.log(pagination)}
      <ExpandableTable
        isLoading={loading}
        rows={transformData(classification_data)}
        columns={classificationCols(handleUpdate, handleDelete)}
        currentPage={pagination?.current_page}
        totalPages={pagination?.last_page}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
        totalRows={pagination?.total}
        stickyFooter
        height="60vh"
      />
      {openNew && (
        <ModalComponent
          minWidth={"480px"}
          title="Create a new classification"
          description={"Name your classification to create it."}
          isOpen={openNew}
          handleClose={() => setOpenNew(false)}
          content={
            <>
              <Stack mt={2}>
                <InputComponent
                  name={"classification"}
                  label={"Classification Name"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                />
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <AuthorizationPinComponent />
            </>
          }
          hasActionButtons
          rightButtonLabel="Confirm and Save"
        />
      )}
      {openUpdate && (
        <ModalComponent
          title={`Update ${selectedData.clName}`}
          isOpen={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          hasActionButtons
          content={
            <>
              <Stack gap={2}>
                <InputComponent
                  label={"Classification Name"}
                  value={updateData.name}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, name: e.target.value })
                  }
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                />
                <TextareaComponent
                  label={"Description"}
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                />
                <Divider />
                <InputComponent
                  label={"Authorization PIN"}
                  helperText={
                    "Confirm your action by typing-in your authorization PIN."
                  }
                />
              </Stack>
            </>
          }
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
