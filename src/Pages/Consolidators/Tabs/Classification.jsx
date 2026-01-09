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
import { handleChangeInput } from "../../../Utils/HandleInput";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";

export const Classification = () => {
  const { pin, setPin, resetPin } = usePinHook();
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const { showSnack } = useSnackbarHook();
  const {
    classification,
    pagination,
    search_Query,
    getClassificationsPaginated,
    selectedData,
    setSelectedData,
    setSearchQuery,
    getArchivedClassification,
    archiveClassification,
    updateClassification,
  } = useItemsHook();
  const [loading, setLoading] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    description: "",
  });
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);
  const [newClassification, setNewClassification] = useState({
    name: "",
    description: "",
  });

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

  const handleUpdate = (row) => {
    resetPin();
    setUpdatedData({
      name: row?.name || "",
      description: row?.description || "",
    });
    setOpenUpdate(true);
  };

  const update = () => {
    const body = {
      name: updatedData.name,
      description: updatedData.description,
      authorization_pin: pin,
    };

    updateClassification(selectedData.id, body, (status, message) => {
      if (status === 200) {
        showSnack(200, "Item successfully updated.");
        setOpenUpdate(false);
        resetPin();
        getItemsPaginated({ page, per_page: 10 });
      } else {
        showSnack(500, message || "Failed to update item.");
      }
    });
  };

  const handleDelete = (params) => {
    setOpenDel(true);
    const data = {
      status: "error",
      title: `Archive this classification (${params?.name}) ?`,
      description:
        "This action cannot be undone. However, you may still restore the item anytime from the Archived view.",
    };
    setConfirmationModal(data);
  };

  const deleteClassification = async (id) => {
    const form = {
      authorization_pin: pin,
    };
    await archiveClassification(selectedData.id, form, (status, message) => {
      // setLoading(false);

      if (status === 200) {
        setOpenDel(false);
        showSnack(200, message);
      } else {
        showSnack(500, message);
      }
    });
  };

  useEffect(() => {
    if (active) {
      setLoading(true);
      getClassificationsPaginated({
        page,
        per_page: 10,
        search: search_Query,
        callBack: (status, message) => {
          setLoading(false);
          console.log("Response:", status, message);
        },
      });
    }
  }, [page, search_Query, active]); // only triggers if view is active

  // Watch for active/archived switch
  useEffect(() => {
    if (!active) {
      // When switching to archived, fetch page 1 of archived classifications
      setPage(1); // optional: reset page to first page for archived
      setLoading(true);
      getArchivedClassification({
        page: page,
        per_page: 10,
        search: search_Query,
        callBack: (status, message) => {
          setLoading(false);
          console.log("Archived classifications fetched:", status, message);
        },
      });
    }
  }, [page, active, search_Query]);

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
          <SearchBarComponentv2
            placeholder="Search classification"
            setValue={setSearchQuery}
            value={search_Query}
          />
          <ButtonComponent
            label={"Add New Category"}
            startDecorator={<AddOutlined />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>
      <ExpandableTable
        isLoading={loading}
        rows={transformData(classification)}
        columns={classificationCols(
          setSelectedData,
          handleUpdate,
          handleDelete
        )}
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
              <Stack mt={2} spacing={2}>
                <InputComponent
                  name={"name"}
                  label={"Classification Name"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                  value={newClassification.name}
                  handleInput={(e) =>
                    handleChangeInput(
                      "name",
                      setNewClassification,
                      e.target.value
                    )
                  }
                />
                <TextareaComponent
                  name={"description"}
                  label={"Description"}
                  value={newClassification.description}
                  handleInput={(e) =>
                    handleChangeInput(
                      "description",
                      setNewClassification,
                      e.target.value
                    )
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
          rightButtonAction={() => deleteClassification()}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
