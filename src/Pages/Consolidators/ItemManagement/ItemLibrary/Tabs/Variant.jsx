import React, { Fragment, useEffect, useState } from "react";
import { variantCols } from "../../../../../Data/Columns";
import { AddOutlined } from "@mui/icons-material";
import {
  Chip,
  ChipDelete,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { grey } from "@mui/material/colors";
import useItemsHook from "@Hooks/ItemManagementHook";
import useSnackbarHook from "@Hooks/SnackbarHook";
import useModalHook from "@Hooks/ModalHook";
import usePinHook from "@Hooks/PinHook";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ButtonComponent from "@Components/Common/ButtonComponent";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import MultipleAutocompleteComponent from "@Components/Form/MultipleAutcompleteComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";
import { handleChangeInput } from "@Utils/HandleInput";
import StatusSwitch from "@Components/StatusSwitchComponent";

export const Variant = () => {
  const {
    terminology,
    categories,
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
    getItemCategories,
  } = useItemsHook();
  const { showSnack } = useSnackbarHook();
  const { setOpenModal, setConfirmationModal } = useModalHook();
  const { pin, setPin, resetPin } = usePinHook();

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
  const [updateTerm, setUpdateTerm] = useState({
    name: "",
    code: "",
    item_category: [],
    description: "",
  });
  const [expandedCategories, setExpandedCategories] = useState({});

  const expandCategory = (id) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle
    }));
  };
  const handleUpdate = (params) => {
    // 1. Store selected row
    setSelectedData(params);

    // 2. Normalize + hydrate form state
    setUpdateTerm({
      name: params.system ?? "",
      code: params.code,
      item_category: Array.isArray(params.categories) ? params.categories : [],
      description: params.description ?? "",
    });

    // 3. Open modal
    setOpenUpdate(true);
  };

  const updateTerminologyHandler = () => {
    if (!selectedData?.id) return;

    const payload = {
      system: updateTerm.name,
      code: updateTerm.code,
      item_category: updateTerm.item_category.map((cat) => cat.id),
      description: updateTerm.description,
      authorization_pin: pin,
    };

    updateTerminology(selectedData.id, payload, (status, message) => {
      if (status === 200) {
        showSnack(200, "Terminology successfully updated.");
        resetPin();
        setOpenUpdate(false);
      } else {
        showSnack(500, message || "Failed to update terminology.");
      }
    });
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

  const addTerminology = () => {
    const payload = {
      system: newTerm.name,
      code: newTerm.code,
      item_category: newTerm.item_category.map((cat) => cat.id),
      description: newTerm.description,
      authorization_pin: pin,
    };

    postNewTerminology(payload, (status, message, data) => {
      if (status === 201) {
        showSnack(200, "New item successfully added to library.");

        setNewTerm({
          name: "",
          code: [],
          item_category: [],
          description: "",
        });
        resetPin();
        setOpenNew(false);
      } else {
        showSnack(500, "Failed to add new item.");
      }
    });
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

  useEffect(() => {
    getItemCategories((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch categories:", message);
      }
    });
  }, []);

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
            placeholder="Search terminology"
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
          handleDelete,
          expandedCategories,
          expandCategory,
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
          maxWidth={"500px"}
          handleClose={() => setOpenNew(false)}
          hasActionButtons
          rightButtonLabel="Confirm and Save"
          rightButtonAction={() => addTerminology()}
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
                <MultipleAutocompleteComponent
                  label="Category"
                  placeholder="Select categories"
                  name="name" // or whatever field you want to display
                  options={categories}
                  value={newTerm.item_category}
                  setValue={(val) =>
                    setNewTerm((prev) => ({
                      ...prev,
                      item_category: val,
                    }))
                  }
                />
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <AuthorizationPinComponent setPin={setPin} />
            </>
          }
        />
      )}

      {openUpdate && (
        <ModalComponent
          title="Update a terminology"
          description={"Keep the terminology up-to-date"}
          isOpen={openUpdate}
          maxWidth={"500px"}
          handleClose={() => setOpenUpdate(false)}
          hasActionButtons
          rightButtonLabel="Confirm and Save"
          rightButtonAction={() => updateTerminologyHandler()}
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
                  value={updateTerm.name}
                  handleInput={(e) =>
                    handleChangeInput("name", setUpdateTerm, e.target.value)
                  }
                />
                <TextareaComponent
                  name={"description"}
                  label={"Description"}
                  placeholder={"Enter description"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                  value={updateTerm.description}
                  onChange={(e) =>
                    handleChangeInput(
                      "description",
                      setUpdateTerm,
                      e.target.value,
                    )
                  }
                />

                <InputComponent
                  name="code"
                  label="Code"
                  placeholder={"Enter code"}
                  value={updateTerm.code}
                  handleInput={(e) =>
                    handleChangeInput("code", setUpdateTerm, e.target.value)
                  }
                />

                <MultipleAutocompleteComponent
                  label="Category"
                  placeholder="Select categories"
                  name="name" // or whatever field you want to display
                  options={categories}
                  value={updateTerm.item_category}
                  setValue={(val) =>
                    setUpdateTerm((prev) => ({
                      ...prev,
                      item_category: val,
                    }))
                  }
                />
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <AuthorizationPinComponent setPin={setPin} />
            </>
          }
        />
      )}
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
