import React, { useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import { TextSnippetOutlined, Today } from "@mui/icons-material";
import { Checkbox, Divider, Stack, Typography, Box, Link } from "@mui/joy";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import TabComponent from "@Components/Common/TabComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import IconLessRadioButtonComponent from "@Components/IconLessRadioButtonComponent";

import useModalHook from "../../../../Hooks/ModalHook";
import useItemsHook from "../../../../Hooks/ItemManagementHook";
// import useItemRequestHook from "..//ItemRequest/ItemRequestHook";
import useItemRequestsHook from "../../../../Hooks/ItemRequest/ItemRequestHook";

import useItemLibraryStore from "../../../../Store/Item/LibraryStore";
import { useItemLibraryActions } from "../../../../Store/Item/LibraryStore";

export default function ItemRequestModal({ open, handleClose, status, row }) {
  const navigate = useNavigate();

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const { updateItemRequest } = useItemRequestsHook();

  const {
    itemName,
    classification: classificationObj,
    category,
    variant,
    unit,
    marketResearched,
    estimatedBudget,
    specification,
  } = useItemLibraryStore();

  const {
    setItemName,
    setClassification,
    setCategory,
    setVariant,
    setUnit,
    setMarketResearched,
    setEstimatedBudget,
    setSpecification,
  } = useItemLibraryActions();

  const [pin, setPin] = useState("");
  const [displayLoading, setDisplayLoading] = useState(false);
  const [index, setIndex] = useState("info");
  const [itemRequestId, setItemRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Local editable state
  const [formData, setFormData] = useState({
    name: "",
    classification: "",
    category: "",
    unit: "",
    estimated_budget: "",
    item_specifications: [],
    market_research_done: false,
  });

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

  const tabs = [
    { name: "General info", value: "info", icon: <TextSnippetOutlined /> },
    { name: "Specifications", value: "specs", icon: <Today /> },
  ];

  useEffect(() => {
    console.log(row);
    if (row) {
      setItemRequestId(row.id);
      setItemName(row.name);
      setClassification(row.item_classification || "");
      setCategory(row.item_category || "");
      setVariant(row.terminology_category || "");
      setMarketResearched(row.market_researched || "");
      setUnit(row.item_unit || "");
      setEstimatedBudget(row.estimated_budget || "");
      setSpecification(row.item_specifications || "");
    }

    // old code setformdata approach
    // if (row) {
    //   setFormData({
    //     name: row.name || "",
    //     classification: row.item_classification || "",
    //     category: row.item_category || "",
    //     unit: row.item_unit || "",
    //     estimated_budget: row.estimated_budget || "",
    //     item_specifications:
    //       row.item_specifications?.map((s) => ({ ...s })) || [],
    //     market_research_done: row?.market_research_done || false,
    //   });
    // }
  }, [row]);

  // === SPEC HANDLERS ===
  const addSpec = () => {
    setSpecification([...specification, { id: Date.now(), description: "" }]);
  };

  const removeSpec = (id) => {
    setSpecification(specification.filter((spec) => spec.id !== id));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...specification];
    newSpecs[index].description = value;
    setSpecification(newSpecs);
  };

  useEffect(() => {
    setDisplayLoading(true);

    const apiCalls = [
      { fn: getItemCategories, name: "categories" },
      { fn: getItemClassification, name: "classification" },
      { fn: getItemUnits, name: "units" },
    ];

    // Only fetch variants if category ID exists
    if (category?.id) {
      apiCalls.push({
        fn: (callback) => getVariantsByCategory(callback, category.id),
        name: "variants",
      });
    }

    let completed = 0;
    const total = apiCalls.length;

    const checkDone = () => {
      completed += 1;
      if (completed === total) setDisplayLoading(false);
    };

    apiCalls.forEach(({ fn, name }) => {
      fn((status, message) => {
        if (status !== 200) console.error(`Failed to fetch ${name}:`, message);
        checkDone();
      });
    });
  }, [category.id]); // Re-run if category changes

  const handleSubmitItemRequest = () => {
    setIsLoading(true);

    const approvedPayload = {
      status_id: status,
      authorization_pin: pin,
      name: itemName,
      estimated_budget: estimatedBudget,
      item_unit_id: unit.id,
      item_classification_id: classificationObj.id,
      item_category_id: category.id,
      terminology_category_id: variant.id,
      market_research: marketResearched,
      specifications: specification.map(({ description }) => ({ description })),
    };

    const declinePayload = {
      status_id: status,
      authorization_pin: pin,
      reason: remarks,
    };

    const payload = status === 4 ? approvedPayload : declinePayload;

    // console.log(payload)

    try {
      updateItemRequest(itemRequestId, payload, (status, message) => {
        if (status === 200) {
          setAlertDialog({
            status: "success",
            title: message,
            description: "",
          });
          setIsLoading(false);
          handleClose();
          navigate("/item-requests/saved");
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again.",
          });
          setIsLoading(false);
          console.error(" Failed to update activity:", message);
        }
      });
    } catch (error) {
      console.error("Error creating objective:", error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  useEffect(() => {
    // console.log(variants)
    // console.log('classifications', classification)
    // console.log('classifications object', classificationObj)
    // console.log('rows', row.item_classification)
    // console.log('variants', variants)
    // console.log('unit object', unit)
    // console.log(marketResearched)
    // console.log(itemRequestId)
  }, [classificationObj, row, variants, items, itemRequestId]);

  return (
    <div>
      <ModalComponent
        isOpen={open}
        handleClose={() => handleClose()}
        maxWidth={"500px"}
        title={
          status === 4 ? (
            <Typography color="success">Approve Item Request</Typography>
          ) : (
            <Typography color="danger">Decline Item Request</Typography>
          )
        }
        description={
          status === 4 ? (
            <Typography>
              You are about to approve this item request. Update item
              information if necessary and provide your authorization pin to
              proceed.
            </Typography>
          ) : (
            <Typography>
              You are about to deny this item request. Please provide
              justification remarks and authorization details. The requesting
              department will be notified of this decision.
            </Typography>
          )
        }
        content={
          status === 4 ? (
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
                      value={itemName}
                      handleInput={(e) => setItemName(e.target.value)}
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
                        value={classificationObj}
                        setValue={(val) => {
                          // console.log(val)
                          setClassification(val);
                        }}
                      />

                      <AutocompleteComponent
                        label="Category"
                        name="category"
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        value={category}
                        setValue={(val) => {
                          // console.log(val)
                          setCategory(val);
                        }}
                      />
                    </Stack>

                    <Stack>
                      <AutocompleteComponent
                        label="Variant"
                        name="variant"
                        options={variants}
                        getOptionLabel={(option) => option.name || ""}
                        value={variant}
                        setValue={(val) => {
                          // console.log(val)
                          setVariant(val);
                        }}
                      />
                    </Stack>

                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Unit of measure"
                        name="unit"
                        options={units}
                        getOptionLabel={(option) => option.name || ""}
                        value={unit}
                        setValue={(val) => {
                          // console.log(val)
                          setUnit(val);
                        }}
                      />

                      <InputComponent
                        label={"Estimated Budget"}
                        value={estimatedBudget}
                        handleInput={(e) => setEstimatedBudget(e.target.value)}
                        startDecorator={"₱"}
                      />
                    </Stack>

                    <Checkbox
                      label="I have conducted a market research prior setting the budget estimates."
                      sx={{ color: grey[900], fontSize: 13, pt: 1 }}
                      size="sm"
                      checked={marketResearched}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        setMarketResearched(e.target.checked);
                      }}
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <Box
                      height={"280px"}
                      overflow="auto"
                      // ref={specsContainerRef}
                    >
                      {specification?.map((spec, index) => (
                        <Box key={spec.id} sx={{ mb: 0.5 }}>
                          <Stack spacing={1}>
                            <TextareaComponent
                              label={`Specification ${index + 1}:`}
                              placeholder="e.g., Size: Large"
                              minRows={3}
                              value={spec.description}
                              onChange={(e) =>
                                handleSpecChange(index, e.target.value)
                              }
                              size="sm"
                            />
                            {specification?.length > 1 && (
                              <Link
                                onClick={() => removeSpec(spec.id)}
                                color="danger"
                                fontSize={12}
                                justifyContent={"right"}
                              >
                                Remove
                              </Link>
                            )}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                    <Link
                      onClick={addSpec}
                      fontSize={13}
                      color="success"
                      endDecorator={<MdAdd />}
                      sx={{ my: 1 }}
                    >
                      Add another
                    </Link>
                    <Divider sx={{ my: 1 }} />
                  </Stack>
                )}
              </TabComponent>
              <Divider />
              <AuthorizationPinComponent setPin={setPin} />
            </>
          ) : (
            <>
              <TextareaComponent
                label={"Remarks"}
                placeholder="Enter your remarks here"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <AuthorizationPinComponent setPin={setPin} />
            </>
          )
        }
        isLoading={isLoading}
        hasActionButtons
        rightButtonLabel="Submit"
        rightButtonAction={() => handleSubmitItemRequest()}
        noRightButton={false}
      />
    </div>
  );
}
