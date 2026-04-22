import React, { Fragment, useEffect, useState } from "react";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Box, Checkbox, Chip, Divider, Textarea, Typography } from "@mui/joy";
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
import {
  Add,
  AddOutlined,
  TextSnippetOutlined,
  Today,
} from "@mui/icons-material";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import { Plus } from "lucide-react";
import TabComponent from "@Components/Common/TabComponent";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import handleSingleChangeAutcomplete from "../../../Utils/HandleAutocomplete";
import { grey } from "@mui/material/colors";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import useSearchHook from "../../../Hooks/SearchHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import StatusSwitch from "@Components/StatusSwitchComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";

export const Items = () => {
  const {
    openModal,
    setOpenModal,
    setConfirmationModal,
    closeConfirmation,
    setAlertDialog,
  } = useModalHook();
  const { pin, setPin, resetPin } = usePinHook();
  const { showSnack } = useSnackbarHook();

  const {
    categories,
    classification,
    units,
    variants,
    items,
    newItemId,
    pagination,
    selectedData,
    search_Query,
    getItemsPaginated,
    getSearchResults,
    getItemCategories,
    getItemClassification,
    getItemUnits,
    getVariantsByCategory,
    postNewItem,
    setSelectedData,
    updateItem,
    archiveItem,
    unarchiveItem,
    getArchivedItems,
    setSearchQuery,
  } = useItemsHook();

  const { getSearchSuggestions, suggestions } = useSearchHook();

  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    id: null,
    name: "",
    classification: "",
    category: "",
    variant: "",
    unitOfMeasurement: "",
    estimatedBudget: "",
    specs: [],
    market_research_done: false,
  });
  const [newItem, setNewItem] = useState({
    name: "",
    classification: "",
    category: "",
    variant: "",
    unitOfMeasurement: "",
    estimatedBudget: "",
    specs: ["", "", ""],
    market_research_done: false,
  });
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState("info");
  const [active, setActive] = useState(true);

  const tabs = [
    { name: "General info", value: "info", icon: <TextSnippetOutlined /> },
    { name: "Specifications", value: "specs", icon: <Today /> },
  ];

  const handleUpdate = (row) => {
    resetPin();

    setUpdatedData({
      id: row.id,
      name: row.name,
      classification: row.item_classification,
      category: row.item_category,
      variant: row.terminologies_category,
      unitOfMeasurement: row.item_unit,
      estimatedBudget: row.estimated_budget,
      market_research_done: row.market_researched || false,
      specs: row.item_specifications?.map((s) => s.description) || [""],
    });

    if (row.item_category?.id) {
      getVariantsByCategory(row.item_category.id, () => {});
    }

    setOpenUpdate(true);
  };

  const update = () => {
    const body = {
      name: updatedData.name,
      estimated_budget: updatedData.estimatedBudget,
      item_unit_id: updatedData.unitOfMeasurement?.id,
      item_category_id: updatedData.category?.id,
      item_classification_id: updatedData.classification?.id,
      terminology_category_id: updatedData.variant?.id ?? null,
      authorization_pin: pin,
      market_researched: updatedData.market_research_done,
      specifications: updatedData.specs
        .filter((spec) => spec?.trim())
        .map((spec) => ({ description: spec })),
    };

    updateItem(updatedData.id, body, (status, message) => {
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
    resetPin();
    setOpenDel(true);
    const data = {
      status: "error",
      title: active
        ? `Archive this item (${params?.name}) ?`
        : `Unarchive this item (${params?.name}) ?`,
      description: "This action cannot be undone.",
    };
    setConfirmationModal(data);
  };

  const deleteItem = async () => {
    const form = {
      authorization_pin: pin,
    };
    if (!active) {
      await unarchiveItem(selectedData.id, form, (status, message) => {
        // setLoading(false);

        if (status === 200) {
          setOpenDel(false);
          showSnack(200, message);
        } else {
          showSnack(500, message);
        }
      });
    } else {
      await archiveItem(selectedData.id, form, (status, message) => {
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

  const addItem = () => {
    const body = {
      name: newItem.name,
      estimated_budget: newItem.estimatedBudget,
      item_unit_id: newItem.unitOfMeasurement.id,
      item_category_id: newItem.category.id,
      item_classification_id: newItem.classification.id,
      terminology_category_id: newItem.variant.id ?? null, // depends on category
      authorization_pin: pin,
      market_researched: newItem.market_research_done,
      specifications: newItem.specs
        .filter((spec) => spec?.trim())
        .map((spec) => ({
          description: spec,
        })),
    };

    postNewItem(body, (status, message, data) => {
      if (status === 201) {
        showSnack(200, "New item successfully added to library.");

        setNewItem({
          name: "",
          classification: "",
          category: "",
          variant: "",
          unitOfMeasurement: "",
          estimatedBudget: "",
          specs: ["", "", ""],
          market_research_done: false,
        });
        resetPin();
        setIndex("info");
        setOpenNew(false);
      } else {
        showSnack(500, "Failed to add new item.");
      }
    });
  };

  const addSpec = () => {
    setNewItem((prev) => ({
      ...prev,
      specs: [...prev.specs, ""],
    }));
  };

  const handleSpecChange = (index, value) => {
    setNewItem((prev) => {
      const updatedSpecs = [...prev.specs];
      updatedSpecs[index] = value;

      return {
        ...prev,
        specs: updatedSpecs,
      };
    });
  };

  const removeSpec = (index) => {
    setNewItem((prev) => {
      if (prev.specs.length <= 1) return prev;

      return {
        ...prev,
        specs: prev.specs.filter((_, i) => i !== index),
      };
    });
  };

  const addUpdateSpec = () => {
    setUpdatedData((prev) => ({
      ...prev,
      specs: [...(prev.specs?.length ? prev.specs : [""]), ""],
    }));
  };

  const handleUpdateSpecChange = (index, value) => {
    setUpdatedData((prev) => {
      const specs = prev.specs?.length > 0 ? [...prev.specs] : [""];
      specs[index] = value;
      return { ...prev, specs };
    });
  };

  const removeUpdateSpec = (index) => {
    setUpdatedData((prev) => {
      if (prev.specs.length <= 1) return prev;
      return {
        ...prev,
        specs: prev.specs.filter((_, i) => i !== index),
      };
    });
  };

  useEffect(() => {
    getItemCategories((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch categories:", message);
      }
    });

    getItemClassification((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch classification:", message);
      }
    });

    getItemUnits((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch units:", message);
      }
    });

    if (newItem?.category?.id) {
      getVariantsByCategory(newItem.category.id, (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch variants:", message);
        }
      });
    }
  }, [newItem?.category?.id]);
  // Re-run if category changes

  useEffect(() => {
    if (active) {
      setLoading(true);
      getItemsPaginated({
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

      getArchivedItems({
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
    if (!updatedData?.category?.id) {
      return;
    }

    getVariantsByCategory(updatedData.category.id, (status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch variants:", message);
      }
    });
  }, [updatedData?.category?.id]);

  return (
    <Fragment>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
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
        <Stack direction={"row"} gap={1}>
          {/* <SearchWithSuggestions
            getSearchSuggestions={getSearchSuggestions}
            getSearchResults={getSearchResults}
            suggestions={suggestions}
            getItems={active ? getItemsPaginated : getArchivedItems}
            onSelect={(item) => console.log("Selected item:", item)}
          /> */}

          <SearchBarComponentv2
            placeholder="Search items"
            setValue={setSearchQuery}
            value={search_Query}
          />
          <ButtonComponent
            label={"Add New Item"}
            startDecorator={<Add />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>
      <ExpandableTable
        rows={items}
        isLoading={loading}
        columns={itemCols(active, setSelectedData, handleUpdate, handleDelete)}
        newItemId={newItemId} // 👈 ADD THIS
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
          title="Add New Item"
          isOpen={openNew}
          handleClose={() => setOpenNew(false)}
          minWidth={"500px"}
          maxWidth={"500px"}
          rightButtonAction={() => addItem()}
          content={
            <>
              <TabComponent
                tabs={tabs}
                index={index}
                setIndex={setIndex}
                bgcolor="inherit"
              >
                {index === "info" ? (
                  <Stack my={2} spacing={2}>
                    <InputComponent
                      label={"Item Name"}
                      name={"name"}
                      value={newItem.name}
                      handleInput={(e) =>
                        handleChangeInput("name", setNewItem, e.target.value)
                      }
                      helperText={
                        "Use a specific and descriptive naming convention for best results."
                      }
                    />
                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Classification"
                        name="classification"
                        options={classification}
                        getOptionLabel={(option) => option.name || ""}
                        value={newItem.classification}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setNewItem,
                            "classification",
                          )
                        }
                      />

                      <AutocompleteComponent
                        label="Category"
                        name="category"
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        value={newItem.category}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setNewItem,
                            "category",
                          )
                        }
                      />
                    </Stack>

                    <Stack>
                      <AutocompleteComponent
                        label="Variant"
                        name="variant"
                        options={variants}
                        getOptionLabel={(option) => option.name || ""}
                        value={newItem.variant}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setNewItem,
                            "variant",
                          )
                        }
                      />
                    </Stack>

                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Unit of measure"
                        name="unitOfMeasurement"
                        options={units}
                        getOptionLabel={(option) => option.name || ""}
                        value={newItem.unitOfMeasurement}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setNewItem,
                            "unitOfMeasurement",
                          )
                        }
                      />

                      <InputComponent
                        name={"estimated_budget"}
                        label={"Estimated Budget"}
                        value={newItem.estimatedBudget}
                        handleInput={(e) =>
                          handleChangeInput(
                            "estimatedBudget",
                            setNewItem,
                            e.target.value,
                          )
                        }
                        startDecorator={"₱"}
                      />
                    </Stack>

                    <Checkbox
                      label="I have conducted a market research prior setting the budget estimates."
                      sx={{ color: grey[900], fontSize: 13, pt: 1 }}
                      size="sm"
                      name="market_research_done"
                      checked={newItem.market_research_done}
                      onChange={(e) =>
                        handleChangeInput(
                          "market_research_done",
                          setNewItem,
                          e.target.checked,
                        )
                      }
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <Box
                      height={"280px"}
                      overflow="auto"
                      // ref={specsContainerRef}
                    >
                      {newItem.specs.map((spec, index) => (
                        <Stack key={index} spacing={1} my={2}>
                          <TextareaComponent
                            label={`Specification ${index + 1}`}
                            minRows={3}
                            value={spec}
                            onChange={(e) =>
                              handleSpecChange(index, e.target.value)
                            }
                          />

                          {newItem.specs.length > 1 && (
                            <Link
                              color="danger"
                              fontSize={12}
                              justifyContent={"right"}
                              onClick={() => removeSpec(index)}
                            >
                              Remove
                            </Link>
                          )}
                        </Stack>
                      ))}
                    </Box>
                    <Link
                      onClick={addSpec}
                      fontSize={13}
                      color="success"
                      endDecorator={<AddOutlined />}
                      sx={{ my: 1 }}
                    >
                      Add another
                    </Link>
                  </Stack>
                )}
              </TabComponent>
              <Divider />
              <AuthorizationPinComponent setPin={setPin} />
            </>
          }
          hasActionButtons={true}
          rightButtonLabel="Confirm and Save"
        />
      )}
      {openUpdate && (
        <ModalComponent
          title={
            <Stack direction={"row"} spacing={1}>
              <Typography>Edit item </Typography>
              <Chip
                sx={{
                  maxWidth: 200, // adjust as needed
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
                variant="outlined"
                color="success"
              >
                {updatedData.name}
              </Chip>
            </Stack>
          }
          height="auto"
          minWidth={"480px"}
          maxWidth={"480px"}
          isOpen={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          rightButtonAction={() => update()}
          content={
            <>
              <TabComponent
                tabs={tabs}
                index={index}
                setIndex={setIndex}
                bgcolor="inherit"
              >
                {index === "info" ? (
                  <Stack my={2} spacing={2}>
                    <InputComponent
                      label={"Item Name"}
                      name={"name"}
                      value={updatedData.name}
                      handleInput={(e) =>
                        handleChangeInput(
                          "name",
                          setUpdatedData,
                          e.target.value,
                        )
                      }
                      helperText={
                        "Use a specific and descriptive naming convention for best results."
                      }
                    />
                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Classification"
                        name="classification"
                        options={classification}
                        getOptionLabel={(option) => option.name || ""}
                        value={updatedData.classification}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setUpdatedData,
                            "classification",
                          )
                        }
                      />

                      <AutocompleteComponent
                        label="Category"
                        name="category"
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        value={updatedData.category}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setUpdatedData,
                            "category",
                          )
                        }
                      />
                    </Stack>

                    <Stack>
                      <AutocompleteComponent
                        label="Variant"
                        name="variant"
                        options={variants}
                        getOptionLabel={(option) => option.name || ""}
                        value={updatedData.variant}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setUpdatedData,
                            "variant",
                          )
                        }
                      />
                    </Stack>

                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Unit of measure"
                        name="unitOfMeasurement"
                        options={units}
                        getOptionLabel={(option) => option.name || ""}
                        value={updatedData.unitOfMeasurement}
                        setValue={(val) =>
                          handleSingleChangeAutcomplete(
                            val,
                            setUpdatedData,
                            "unitOfMeasurement",
                          )
                        }
                      />

                      <InputComponent
                        name={"estimated_budget"}
                        label={"Estimated Budget"}
                        value={updatedData.estimatedBudget}
                        handleInput={(e) =>
                          handleChangeInput(
                            "estimatedBudget",
                            setUpdatedData,
                            e.target.value,
                          )
                        }
                        startDecorator={"₱"}
                      />
                    </Stack>

                    <Checkbox
                      label="I have conducted a market research prior setting the budget estimates."
                      sx={{ color: grey[900], fontSize: 13, pt: 1 }}
                      size="sm"
                      name="market_research_done"
                      checked={updatedData.market_research_done}
                      onChange={(e) =>
                        handleChangeInput(
                          "market_research_done",
                          setUpdatedData,
                          e.target.checked,
                        )
                      }
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <Box
                      height={"280px"}
                      overflow="auto"
                      // ref={specsContainerRef}
                    >
                      {(updatedData.specs.length > 0
                        ? updatedData.specs
                        : [""]
                      ).map((spec, index) => (
                        <Stack key={index} spacing={1} my={2}>
                          <TextareaComponent
                            label={`Specification ${index + 1}`}
                            minRows={3}
                            value={spec}
                            onChange={(e) =>
                              handleUpdateSpecChange(index, e.target.value)
                            }
                          />

                          {updatedData.specs.length > 1 && (
                            <Link
                              color="danger"
                              fontSize={12}
                              justifyContent="right"
                              onClick={() => removeUpdateSpec(index)}
                            >
                              Remove
                            </Link>
                          )}
                        </Stack>
                      ))}

                      {updatedData.specs.length === 0 && (
                        <Typography
                          level="body-sm"
                          textAlign="center"
                          sx={{ mt: 1, color: "text.secondary" }}
                        >
                          No specifications yet. Start by adding one.
                        </Typography>
                      )}
                    </Box>
                    <Link
                      onClick={addUpdateSpec}
                      fontSize={13}
                      color="success"
                      endDecorator={<AddOutlined />}
                      sx={{ my: 1 }}
                    >
                      Add another
                    </Link>
                  </Stack>
                )}
              </TabComponent>
              <Divider />
              <AuthorizationPinComponent setPin={setPin} />
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
          rightButtonAction={() => deleteItem()}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
