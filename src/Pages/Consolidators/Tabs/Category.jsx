import React, { Fragment, useEffect, useState } from "react";
import { categoryCols, classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Divider, Stack, Switch, Typography } from "@mui/joy";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import StatusSwitch from "@Components/StatusSwitchComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { AddOutlined } from "@mui/icons-material";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import { handleChangeInput } from "../../../Utils/HandleInput";
import useSnackbarHook from "../../../Hooks/SnackbarHook";

export const Category = () => {
  const {
    categories,
    pagination,
    search_Query,
    getPaginatedCategories,
    selectedData,
    setSelectedData,
    setSearchQuery,
    getArchivedCategories,
    postNewCategory,
    updateCategory,
    archiveCategory,
    unarchiveCategory,
  } = useItemsHook();
  const { pin, setPin, resetPin } = usePinHook();
  const { showSnack } = useSnackbarHook();

  const { setOpenModal, setConfirmationModal } = useModalHook();
  const [loading, setLoading] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [updatedData, setUpdatedData] = useState({
    name: "",
    description: "",
  });
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(true);

  const addCategory = () => {
    const body = {
      name: newCategory.name,
      description: newCategory.description,
      authorization_pin: pin,
    };

    postNewCategory(body, (status, message, data) => {
      console.log(status, message, data);
      if (status === 201) {
        showSnack(200, "New item successfully added to library.");

        setNewCategory({
          name: "",
          description: "",
        });
        setOpenNew(false);
        resetPin();
      } else {
        showSnack(500, "Failed to add new item.");
      }
    });
  };

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

    updateCategory(selectedData.id, body, (status, message) => {
      if (status === 200) {
        setOpenUpdate(false);

        showSnack(200, "Item successfully updated.");
        resetPin();
      } else {
        showSnack(500, message || "Failed to update item.");
      }
    });
  };

  const handleDelete = (params) => {
    setOpenDel(true);
    const data = {
      status: "error",
      title: `Archive this category (${params?.name}) ?`,
      description:
        "This action cannot be undone. However, you may still restore the item anytime from the Archived view.",
    };
    setConfirmationModal(data);
  };

  const deleteCategory = async (id) => {
    const form = {
      authorization_pin: pin,
    };
    if (!active) {
      await unarchiveCategory(selectedData.id, form, (status, message) => {
        // setLoading(false);

        if (status === 200) {
          setOpenDel(false);
          showSnack(200, message);
        } else {
          showSnack(500, message);
        }
      });
    } else {
      await archiveCategory(selectedData.id, form, (status, message) => {
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

  function transformData(data) {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  useEffect(() => {
    if (active) {
      setLoading(true);
      getPaginatedCategories({
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

      getArchivedCategories({
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
          />
          <ButtonComponent
            label={"Add New Category"}
            startDecorator={<AddOutlined />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>

      <ExpandableTable
        rows={transformData(categories)}
        isLoading={loading}
        columns={categoryCols(
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
          title="Create a new category"
          description={"Name your category to create it."}
          isOpen={openNew}
          handleClose={() => setOpenNew(false)}
          hasActionButtons
          rightButtonLabel="Confirm and Save"
          rightButtonAction={() => addCategory()}
          content={
            <>
              <Stack mt={2} spacing={2}>
                <InputComponent
                  name={"name"}
                  label={"Category Name"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                  value={newCategory.name}
                  handleInput={(e) =>
                    handleChangeInput("name", setNewCategory, e.target.value)
                  }
                />
                <TextareaComponent
                  name={"description"}
                  label={"Description"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                  value={newCategory.description}
                  onChange={(e) =>
                    handleChangeInput(
                      "description",
                      setNewCategory,
                      e.target.value
                    )
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
          title={`Update category: ${selectedData?.name}`}
          isOpen={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          rightButtonAction={() => update()}
          rightButtonLabel="Confirm and Save"
          hasActionButtons
          content={
            <>
              <Stack gap={2}>
                <InputComponent
                  label={"Classification Name"}
                  name={"name"}
                  value={updatedData.name}
                  handleInput={(e) =>
                    handleChangeInput("name", setUpdatedData, e.target.value)
                  }
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                />
                <TextareaComponent
                  label={"Description"}
                  name={"description"}
                  value={updatedData.description}
                  onChange={(e) =>
                    handleChangeInput(
                      "description",
                      setUpdatedData,
                      e.target.value
                    )
                  }
                />
                <Divider />
                <AuthorizationPinComponent setPin={setPin} />
              </Stack>
            </>
          }
        />
      )}
      {openDel && (
        <ConfirmationModalComponent
          status="error"
          rightButtonAction={() => deleteCategory()}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
