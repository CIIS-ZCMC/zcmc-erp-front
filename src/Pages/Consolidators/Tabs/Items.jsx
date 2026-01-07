import React, { Fragment, useEffect, useState } from "react";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Box, Checkbox, Divider, Textarea, Typography } from "@mui/joy";
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
import useItemsHook from "../../../Hooks/ItemsHook";
import handleSingleChangeAutcomplete from "../../../Utils/HandleAutocomplete";
import { grey } from "@mui/material/colors";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";

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

  const {
    items,
    categories,
    classification,
    units,
    variants,
    getItemCategories,
    getItemClassification,
    getItemUnits,
    getVariantsByCategory,
  } = useItemsHook();

  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    estimated_budget: "",
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

  const tabs = [
    { name: "General info", value: "info", icon: <TextSnippetOutlined /> },
    { name: "Specifications", value: "specs", icon: <Today /> },
  ];

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
      getVariantsByCategory((status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch variants:", message);
        }
      }, newItem.category.id);
    }
  }, [newItem?.category?.id]);
  // Re-run if category changes

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
          <ButtonComponent
            label={"Add New Item"}
            startDecorator={<Add />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>
      <ExpandableTable
        rows={Items}
        isLoading={loading}
        columns={itemCols(handleUpdate, handleDelete)}
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
          title="Add New Item"
          isOpen={openNew}
          handleClose={() => setOpenNew(false)}
          minWidth={"500px"}
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
                            "classification"
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
                            "category"
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
                            "variant"
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
                            "unitOfMeasurement"
                          )
                        }
                      />

                      <InputComponent
                        name={"estimated_budget"}
                        label={"Estimated Budget"}
                        value={newItem.estimatedBudget}
                        handleInput={(e) =>
                          handleChangeInput(
                            "estimated_budget",
                            setUpdatedData,
                            e.target.value
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
                          e.target.checked
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
