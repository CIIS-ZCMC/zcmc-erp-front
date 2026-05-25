import React, { Fragment, useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import {
  TextSnippetOutlined,
  Today,
  WarningAmberOutlined,
} from "@mui/icons-material";
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
import { useItemRequestActions } from "../../../../Hooks/ItemRequest/ItemRequestHook";

import useItemLibraryStore from "../../../../Store/Item/LibraryStore";
import { useItemLibraryActions } from "../../../../Store/Item/LibraryStore";
import useSnackbarHook from "../../../../Hooks/SnackbarHook";
import VerticalRadioComponent from "@Components/Common/VerticalRadioComponent";

export default function ItemRequestModal({ open, handleClose, status, row }) {
  const navigate = useNavigate();

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const { updateItemRequest } = useItemRequestActions();

  const { classification: classificationObj } = useItemLibraryStore();

  const { showSnack } = useSnackbarHook();

  const [pin, setPin] = useState("");
  const [displayLoading, setDisplayLoading] = useState(false);
  const [index, setIndex] = useState("info");
  const [itemRequestId, setItemRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isSpecialItem, setIsSpecialItem] = useState(false);
  const [isPpmpItemRequest, setIsPpmpItemRequest] = useState(false);

  // Local editable state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    classification: null,
    category: null,
    variant: null,
    unit: null,
    estimated_budget: "",
    market_researched: false,
    specifications: [],
    is_special: 0,
    is_high_ticket: 0,
    is_ppmp_item_request: false,
    market_scoping_document_link: "",
    technical_specifications_document_link: "",
    remarks: "",
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
    { name: "Special Details", value: "special_details", icon: <Today /> },
  ];

  useEffect(() => {
    if (!row) return;

    setFormData({
      id: row.id,
      name: row.name || "",
      classification: row.item_classification || null,
      category: row.item_category || null,
      variant: row.terminology_category || null,
      unit: row.item_unit || null,
      estimated_budget: row.estimated_budget || "",
      market_researched: row.market_researched || false,
      specifications: row.item_specifications?.length
        ? row.item_specifications
        : [{ id: Date.now(), description: "" }],
      is_special: Number(row.is_special),
      is_high_ticket: Number(row.is_high_ticket),
      is_ppmp_item_request: !!row.is_ppmp_item_request,
      market_scoping_document_link: row.market_scoping_link || "",
      technical_specifications_document_link: row.tech_specs_link || "",
      remarks: "",
    });
  }, [row]);

  // === SPEC HANDLERS ===
  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { id: Date.now(), description: "" },
      ],
    }));
  };

  const removeSpec = (id) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((spec) => spec.id !== id),
    }));
  };

  const handleSpecChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, description: value } : spec,
      ),
    }));
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    setDisplayLoading(true);

    const apiCalls = [
      { fn: getItemCategories, name: "categories" },
      { fn: getItemClassification, name: "classification" },
      { fn: getItemUnits, name: "units" },
    ];

    // Only fetch variants if category ID exists
    if (formData.category?.id) {
      apiCalls.push({
        fn: (callback) => getVariantsByCategory(formData.category.id, callback),
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
  }, [formData.category?.id]); // Re-run if category changes

  const handleSubmitItemRequest = () => {
    setIsLoading(true);

    const approvedPayload = {
      status_id: status,
      authorization_pin: pin,
      name: formData.name,
      estimated_budget: formData.estimated_budget,
      item_unit_id: formData.unit?.id,
      item_classification_id: formData.classification?.id,
      item_category_id: formData.category?.id,
      terminology_category_id: formData.variant?.id,
      specifications: formData.specifications.map(({ description }) => ({
        description,
      })),
    };

    const declinePayload = {
      status_id: status,
      authorization_pin: pin,
      reason: formData.remarks,
    };

    const payload = status === 4 ? approvedPayload : declinePayload;

    // console.log(payload)

    try {
      updateItemRequest(formData.id, payload, (status, message) => {
        if (status === 200) {
          showSnack(status, message);
          setIsLoading(false);
          handleClose();
        } else {
          console.log(status, message);
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again.",
          });
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error updating item request:", error);
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
        maxWidth={"780px"}
        height="auto"
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
                      value={formData.name}
                      handleInput={(e) => updateField("name", e.target.value)}
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
                        value={formData.classification}
                        setValue={(val) => {
                          // console.log(val)
                          updateField("classification", val);
                        }}
                      />

                      <AutocompleteComponent
                        label="Category"
                        name="category"
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        value={formData.category}
                        setValue={(val) => {
                          // console.log(val)
                          updateField("category", val);
                        }}
                      />
                    </Stack>

                    <Stack>
                      <AutocompleteComponent
                        label="Variant"
                        name="variant"
                        options={variants}
                        getOptionLabel={(option) => option.name || ""}
                        value={formData.variant}
                        setValue={(val) => {
                          // console.log(val)
                          updateField("variant", val);
                        }}
                      />
                    </Stack>

                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Unit of measure"
                        name="unit"
                        options={units}
                        getOptionLabel={(option) => option.name || ""}
                        value={formData.unit}
                        setValue={(val) => {
                          // console.log(val)
                          updateField("unit", val);
                        }}
                      />

                      <InputComponent
                        label={"Estimated Budget"}
                        value={formData.estimated_budget}
                        handleInput={(e) =>
                          updateField("estimated_budget", e.target.value)
                        }
                        startDecorator={"₱"}
                      />
                    </Stack>
                  </Stack>
                ) : index === "specs" ? (
                  <Stack
                    sx={{
                      overflowX: "hidden", // Hide horizontal overflow
                    }}
                  >
                    <Box
                      height={"280px"}
                      overflow="auto"

                      // ref={specsContainerRef}
                    >
                      {formData.specifications?.map((spec, index) => (
                        <Box
                          key={spec.id}
                          sx={{
                            my: 1.5,
                            paddingRight: "12px", // Move padding here
                          }}
                        >
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
                            {formData.specifications?.length > 1 && (
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
                  </Stack>
                ) : (
                  <Fragment>
                    <Stack mt={2} spacing={2}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        alignItems="flex-start"
                      >
                        <Stack
                          width={{ xs: "100%", md: 360 }}
                          spacing={2}
                          sx={{
                            bgcolor: "#EFEFEF",
                            padding: 2,
                            borderRadius: 20,
                          }}
                        >
                          <VerticalRadioComponent
                            label={
                              "Is this item exclusively procured by your unit?"
                            }
                            name="exclusive_procurement"
                            value={formData.is_special}
                            setValue={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                is_special: Number(value),
                              }))
                            }
                            actions={[
                              {
                                value: 1,
                                label:
                                  "Yes, my unit handles procurement for this item independently",
                              },
                              {
                                value: 0,
                                label:
                                  "No, this item is part of the dispensing unit's common procurement list",
                              },
                            ]}
                          />
                          <VerticalRadioComponent
                            label={
                              "Is this a major or specialized high-ticket purchase?"
                            }
                            name="high_ticket"
                            value={formData.is_high_ticket}
                            setValue={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                is_high_ticket: Number(value),
                              }))
                            }
                            actions={[
                              {
                                value: 1,
                                label: "Yes",
                              },
                              {
                                value: 0,
                                label: "No",
                              },
                            ]}
                          />
                        </Stack>
                        <Stack flex={1} minWidth={0} spacing={3}>
                          <Box>
                            <Typography level="title-sm">
                              Market Scoping Document Link
                            </Typography>

                            {formData.market_scoping_document_link ? (
                              <Link
                                level="body-sm"
                                href={formData.market_scoping_document_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: "block",
                                  wordBreak: "break-all",
                                }}
                              >
                                {formData.market_scoping_document_link}
                              </Link>
                            ) : (
                              <Typography level="body-sm">N/A</Typography>
                            )}
                          </Box>
                          <Box>
                            <Typography level="title-sm">
                              Technical Specifications Document Link
                            </Typography>

                            {formData.technical_specifications_document_link ? (
                              <Link
                                level="body-sm"
                                href={
                                  formData.technical_specifications_document_link
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: "block",
                                  wordBreak: "break-all",
                                }}
                              >
                                {
                                  formData.technical_specifications_document_link
                                }
                              </Link>
                            ) : (
                              <Typography level="body-sm">N/A</Typography>
                            )}
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Fragment>
                )}
                <AuthorizationPinComponent setPin={setPin} />
              </TabComponent>
            </>
          ) : (
            <>
              <TextareaComponent
                label={"Remarks"}
                placeholder="Enter your remarks here"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
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
