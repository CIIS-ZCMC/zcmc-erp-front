import React, { Fragment, useEffect, useState } from "react";
import { variantCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import useTerminologyHooks from "../../../Hooks/Libraries/LibTerminology";
import SearchBarComponentv2 from "../../../Components/SearchBarWithdeBounce";
import { Stack } from "@mui/material";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import StatusSwitch from "@Components/StatusSwitchComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { AddOutlined } from "@mui/icons-material";
import { Chip, ChipDelete, Divider, IconButton, Typography } from "@mui/joy";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import { handleChangeInput } from "../../../Utils/HandleInput";
import { grey } from "@mui/material/colors";
import MultipleAutocompleteComponent from "@Components/Form/MultipleAutcompleteComponent";

export const Variant = () => {
  const {
    terminology,
    pagination,
    search_Query,
    selectedData,
    setSelectedData,
    setSearchQuery,
    getPaginatedTerminology,
    getArchivedTerminology,
    postNewTerminology,
    updateTerminology,
    archiveTerminology,
    unarchiveTerminology,
  } = useItemsHook();
  const { showSnack } = useSnackbarHook();
  const { setOpenModal, setConfirmationModal } = useModalHook();
  const { pin, setPin } = usePinHook();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);
  const [newTerm, setNewTerm] = useState({
    name: "",
    code: [],
    item_category: [],
    description: "",
  });

  const handleUpdate = (params) => {
    setOpenUpdate(true);
  };

  const handleDelete = (params) => {
    setOpenDel(true);
    const data = {
      status: "error",
      title: `Archive this terminology (${params?.name}) ?`,
      description:
        "This action cannot be undone. However, you may still restore the item anytime from the Archived view.",
    };
    setConfirmationModal(data);
  };

  const deleteTerminology = async (id) => {
    const form = {
      authorization_pin: pin,
    };
    if (!active) {
      await unarchiveTerminology(selectedData.id, form, (status, message) => {
        // setLoading(false);

        if (status === 200) {
          setOpenDel(false);
          showSnack(200, message);
        } else {
          showSnack(500, message);
        }
      });
    } else {
      await archiveTerminology(selectedData.id, form, (status, message) => {
        // setLoading(false);

        if (status === 200) {
          setOpenDel(false);
          showSnack(200, message);
        } else {
          showSnack(500, message);
        }
      });
    }
  };

  const addCode = () => {
    if (!newTerm.tempCode?.trim()) return;

    if (!newTerm.code.includes(newTerm.tempCode.trim())) {
      setNewTerm((prev) => ({
        ...prev,
        code: [...prev.code, prev.tempCode.trim()],
        tempCode: "",
      }));
    }
  };

  const removeCode = (code) => {
    setNewTerm((prev) => ({
      ...prev,
      code: prev.code.filter((c) => c !== code),
    }));
  };

  useEffect(() => {
    if (active) {
      setLoading(true);
      getPaginatedTerminology({
        page,
        per_page: 10,
        search: search_Query,
        callBack: (status, message) => {
          setLoading(false);
          console.log("Response:", status, message);
        },
      });
    }
  }, [page, search_Query, active]);

  useEffect(() => {
    if (!active) {
      // When switching to archived, fetch page 1 of archived classifications
      setPage(1); // optional: reset page to first page for archived
      setLoading(true);

      getArchivedTerminology({
        page: page,
        per_page: 10,
        search: search_Query,
        callBack: (status, message) => {
          setLoading(false);
          console.log("Archived classifications fetched:", status, message);
        },
      });
    }
  }, [page, search_Query, active]);

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
            placeholder="Search categories"
            setValue={setSearchQuery}
            value={search_Query}
          />{" "}
          <ButtonComponent
            label={"Add New Terminology"}
            startDecorator={<AddOutlined />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>

      <ExpandableTable
        isLoading={loading}
        rows={terminology}
        columns={variantCols(
          active,
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
        height="62vh"
      />
      {openNew && (
        <ModalComponent
          title="Create a new terminology"
          description={"Name your terminology to create it."}
          isOpen={openNew}
          handleClose={() => setOpenNew(false)}
          hasActionButtons
          rightButtonLabel="Confirm and Save"
          // rightButtonAction={() => addCategory()}
          content={
            <>
              <Stack mt={2} spacing={2}>
                <InputComponent
                  name={"name"}
                  label={"System Label"}
                  placeholder={"Enter system label"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                  value={newTerm.name}
                  handleInput={(e) =>
                    handleChangeInput("name", setNewTerm, e.target.value)
                  }
                />
                <TextareaComponent
                  name={"description"}
                  label={"Description"}
                  placeholder={"Enter description"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                  value={newTerm.description}
                  onChange={(e) =>
                    handleChangeInput("description", setNewTerm, e.target.value)
                  }
                />

                <InputComponent
                  name="code"
                  label="Code"
                  placeholder={"Enter code"}
                  value={newTerm.tempCode || ""}
                  handleInput={(e) =>
                    setNewTerm((prev) => ({
                      ...prev,
                      tempCode: e.target.value,
                    }))
                  }
                  endDecorator={
                    <IconButton onClick={addCode}>
                      <AddOutlined />
                    </IconButton>
                  }
                />
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{
                    border:
                      newTerm.code.length > 0 && `1px dashed ${grey[400]}`,
                    borderRadius: 10,
                    padding: newTerm.code.length > 0 && 1,
                  }}
                >
                  {newTerm.code.map((code) => (
                    <Chip
                      key={code}
                      variant="soft"
                      color="primary"
                      endDecorator={
                        <ChipDelete onClick={() => removeCode(code)} />
                      }
                    >
                      {code}
                    </Chip>
                  ))}
                </Stack>
                <MultipleAutocompleteComponent label={"Category "} />
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <AuthorizationPinComponent setPin={setPin} />
            </>
          }
        />
      )}

      {/* {openUpdate && (


      )} */}
      {openDel && (
        <ConfirmationModalComponent
          status="error"
          rightButtonAction={() => deleteTerminology()}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
