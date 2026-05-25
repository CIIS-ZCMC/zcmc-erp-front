import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import React, { Fragment, useEffect, useRef, useState } from "react";
// Add New Item Request Components
import {
  usePPMPActions,
  usePPMPState,
} from "../../../../../Hooks/PPMP/PPMPHook";
import userErrorInputHook from "../../../../../Hooks/ErrorInputHook";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import TextareaComponent from "@Components/Form/TextareaComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import InputComponent from "@Components/Form/InputComponent";
import useItemsHook from "../../../../../Hooks/ItemManagementHook";
import { formatNumber } from "../../../../../Utils/FormatNumber";
import { grey } from "@mui/material/colors";
import { handleInputValidation } from "../../../../../Utils/HandleInput";
import handleSingleChangeAutcomplete from "../../../../../Utils/HandleAutocomplete";
import { MdAdd } from "react-icons/md";
import useModalHook from "../../../../../Hooks/ModalHook";
import useSnackbarHook from "../../../../../Hooks/SnackbarHook";
import { useItemRequestActions } from "../../../../../Hooks/ItemRequest/ItemRequestHook";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import RadioButtonComponent from "@Components/Common/RadioButtonComponent";
import VerticalRadioComponent from "@Components/Common/VerticalRadioComponent";

export default function NewRequestModal({ openNewRequest, setOpenNewRequest }) {
  const [displayLoading, setDisplayLoading] = useState(false);
  const { setAlertDialog } = useModalHook();
  const { showSnack } = useSnackbarHook();

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
    clearVariants,
  } = useItemsHook();

  const { activities } = usePPMPState();
  const { getActivities } = usePPMPActions();
  const { postItmRequest } = useItemRequestActions();
  const [buttonLoader, setButtonLoader] = useState(false);

  const specsContainerRef = useRef(null);
  const [step, setStep] = useState(1);
  const [itemReq, setItemReq] = useState({
    classification: null,
    category: null,
    item_name: "",
    unit: null,
    quantity: 0,
    estimated_budget: "",
    variant: null,
    market_research: false,
    specs: [
      { id: 1, value: "" },
      { id: 2, value: "" },
      { id: 3, value: "" },
    ],
    is_special: 0,
    is_high_ticket: 0,
    market_scoping_link: null,
    tech_specs_link: null,
    pin: "",
  });

  const { errors, setError, clearErrors } = userErrorInputHook();

  // === SPEC HANDLERS ===
  const addSpec = () =>
    setItemReq((prev) => ({
      ...prev,
      specs: [...prev.specs, { id: Date.now(), value: "" }],
    }));

  const removeSpec = (id) =>
    setItemReq((prev) => ({
      ...prev,
      specs: prev.specs.filter((spec) => spec.id !== id),
    }));

  const handleChange = (id, value) =>
    setItemReq((prev) => ({
      ...prev,
      specs: prev.specs.map((spec) =>
        spec.id === id ? { ...spec, value } : spec,
      ),
    }));

  const handleBudgetChange = (e) => {
    const raw = e.target.value.replace(/,/g, ""); // remove commas

    if (!/^\d*$/.test(raw)) return; // allow only numbers

    setItemReq((prev) => ({
      ...prev,
      estimated_budget: raw,
    }));
  };

  const validateStep = () => {
    clearErrors();

    let hasError = false;

    if (currentStep === "general") {
      if (!itemReq.item_name?.trim()) {
        setError("item_name", true, "Item name is required.");
        hasError = true;
      }

      if (!itemReq.classification) {
        setError("classification", true, "Classification is required.");
        hasError = true;
      }

      if (!itemReq.category) {
        setError("category", true, "Category is required.");
        hasError = true;
      }

      if (!itemReq.unit) {
        setError("unit", true, "Unit is required.");
        hasError = true;
      }

      if (variants?.length > 0 && !itemReq.variant) {
        setError("variant", true, "Variant is required.");
        hasError = true;
      }

      if (!itemReq.estimated_budget) {
        setError("estimated_budget", true, "Estimated budget is required.");
        hasError = true;
      }

      itemReq?.specs?.forEach((spec, index) => {
        if (!spec?.value?.trim()) {
          setError(
            `spec-${index}`,
            true,
            `Specification ${index + 1} is required.`,
          );
          hasError = true;
        }
      });
    }

    if (currentStep === "special_details") {
      if (!itemReq.market_scoping_link?.trim()) {
        setError(
          "market_scoping_link",
          true,
          "Market scoping link is required.",
        );
        hasError = true;
      }

      if (!itemReq.tech_specs_link?.trim()) {
        setError(
          "tech_specs_link",
          true,
          "Technical specifications link is required.",
        );
        hasError = true;
      }
    }

    if (currentStep === "authorization") {
      if (!itemReq?.pin?.trim()) {
        setError("pin", true, "Authorization PIN is required.");
        hasError = true;
      }
    }

    return !hasError;
  };
  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, finalStep));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = itemReq.is_high_ticket
    ? ["general", "special_details", "authorization"]
    : ["general", "authorization"];

  const currentStep = steps[step - 1];
  const finalStep = steps.length;

  const submit = () => {
    clearErrors();

    setButtonLoader(true);
    const payload = {
      name: itemReq.item_name || "",
      item_classification_id: itemReq.classification?.id ?? null,
      item_category_id: itemReq.category?.id ?? null,
      item_unit_id: itemReq.unit?.id ?? null,
      variant: itemReq?.variant?.id ?? null, // not required
      estimated_budget: itemReq?.estimated_budget ?? 0,
      authorization_pin: itemReq?.pin ?? "",
      specifications: itemReq?.specs?.map((spec) => ({
        description: spec?.value ?? "",
      })),
      is_special: Boolean(itemReq.is_special),
      is_high_ticket: Boolean(itemReq.is_high_ticket),
      market_scoping_link: itemReq.market_scoping_link || null,
      tech_specs_link: itemReq.tech_specs_link || null,
      technical_requirements: itemReq.technical_requirements || "",
    };

    postItmRequest(payload, (status, message) => {
      setButtonLoader(false);

      if (status === 201) {
        setItemReq({
          classification: null,
          category: null,
          item_name: "",
          unit: null,
          estimated_budget: "",
          variant: null,
          market_research: false,
          is_special: false,
          is_high_ticket: false,
          market_scoping_link: "",
          tech_specs_link: "",
          technical_requirements: "",
          specs: [
            { id: 1, value: "" },
            { id: 2, value: "" },
          ],
          pin: "",
        });
        setOpenNewRequest(false); // close modal
        setStep(1); // reset to step 1 if using a stepper
        showSnack(status, message);
      } else {
        setButtonLoader(false);
        setAlertDialog({
          status: "error",
          title: "Request Failed",
          description: message,
        });
      }
    });
  };

  useEffect(() => {
    setDisplayLoading(true);

    const apiCalls = [
      { fn: getItemCategories, name: "categories" },
      { fn: getItemClassification, name: "classification" },
      { fn: getActivities, name: "activities" },
      { fn: getItemUnits, name: "units" },
    ];

    let completed = 0;

    apiCalls.forEach(({ fn, name }) => {
      fn((status, message) => {
        if (status !== 200) {
          console.error(`Failed to fetch ${name}:`, message);
        }

        completed++;

        if (completed === apiCalls.length) {
          setDisplayLoading(false);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (itemReq.category?.id) {
      getVariantsByCategory(itemReq.category.id, () => {});
    } else {
      clearVariants();
    }
  }, [itemReq.category?.id]);

  const modalConfig = {
    general: {
      width: "1372px",
      height: "680px",
    },

    special_details: {
      width: "480px",
      height: "600px",
    },

    authorization: {
      width: "480px",
      height: "350px",
    },
  };

  const { width, height } = modalConfig[currentStep];
  return (
    <Fragment>
      <ModalComponent
        isOpen={openNewRequest}
        handleClose={() => setOpenNewRequest(false)}
        title={
          currentStep === "general"
            ? "General Information"
            : currentStep === "special_details"
              ? "Requirements Attachment"
              : "Review & Confirm"
        }
        description={
          currentStep === "general"
            ? "Fill in the item information to create it."
            : currentStep === "special_details"
              ? "Please provide the secure cloud links (e.g., Google Drive, OneDrive) for the required documentation. "
              : "Review your request before submitting. Once confirmed, your request will be forwarded to the appropriate offices for review and approval. This action cannot be undone."
        }
        minWidth={width}
        maxWidth={width}
        height={height}
        leftButtonLabel={
          currentStep !== "general" ? "Back to previous" : "Cancel"
        }
        leftButtonAction={() => {
          if (currentStep !== "general") {
            prevStep();
          } else {
            setOpenNewRequest(false);
          }
        }}
        rightButtonLabel={step < finalStep ? "Next step" : "Confirm and save"}
        rightButtonAction={() => {
          if (step < finalStep) {
            nextStep();
          } else {
            submit();
          }
        }}
        isLoading={buttonLoader}
        hasActionButtons
        content={
          <>
            {currentStep === "general" && (
              <Grid container gap={2} mt={2}>
                <Grid item xs={4.5}>
                  <Stack spacing={1.5} mb={1}>
                    <TextareaComponent
                      label="Item name"
                      name="item_name"
                      helperText="Use a specific and descriptive naming convention for best results."
                      value={itemReq?.item_name}
                      onChange={(e) =>
                        handleInputValidation(e, setItemReq, setError)
                      }
                      size="sm"
                      minRows={1}
                    />

                    <Stack direction={"row"} gap={1}>
                      <AutocompleteComponent
                        label="Classification"
                        name="classification"
                        options={classification}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          classification?.find(
                            (el) => el.id === itemReq?.classification?.id,
                          ) || null
                        } // Match the full object in value
                        handleSelect={(value) => {
                          handleSingleChangeAutcomplete(
                            value,
                            setItemReq,
                            "classification",
                            setError,
                          );
                        }}
                      />

                      <AutocompleteComponent
                        label="Category"
                        name="category"
                        value={
                          categories?.find(
                            (el) => el.id === itemReq?.category?.id,
                          ) || null
                        }
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        handleSelect={(value) => {
                          handleSingleChangeAutcomplete(
                            value,
                            setItemReq,
                            "category",
                            setError,
                          );
                        }}
                      />
                    </Stack>

                    <AutocompleteComponent
                      label="Unit of measure"
                      name="unit"
                      value={
                        units?.find((el) => el.id === itemReq?.unit?.id) || null
                      }
                      options={units}
                      getOptionLabel={(option) => option.name || ""}
                      handleSelect={(value) => {
                        handleSingleChangeAutcomplete(
                          value,
                          setItemReq,
                          "unit",
                          setError,
                        );
                      }}
                    />

                    <AutocompleteComponent
                      label="Variant"
                      name="variant"
                      value={
                        variants?.find(
                          (el) => el.id === itemReq?.variant?.id,
                        ) || null
                      }
                      disabled={variants?.length === 0}
                      options={variants}
                      getOptionLabel={(option) => option.name || ""}
                      handleSelect={(value) => {
                        handleSingleChangeAutcomplete(
                          value,
                          setItemReq,
                          "variant",
                          setError,
                        );
                      }}
                    />

                    <InputComponent
                      label="Estimated budget"
                      name="estimated_budget"
                      size="sm"
                      fontWeight={500}
                      value={formatNumber(itemReq?.estimated_budget)}
                      handleInput={handleBudgetChange}
                      color="primary"
                      startDecorator={"₱"}
                    />

                    {/* <Checkbox
                      label="I have conducted a market research prior setting the budget estimates."
                      sx={{ color: grey[900], fontSize: 13, pt: 1 }}
                      size="sm"
                      checked={itemReq?.market_research}
                      onChange={(e) =>
                        setItemReq((prev) => ({
                          ...prev,
                          market_research: e.target.checked,
                        }))
                      }
                    /> */}
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack spacing={2}>
                    <Stack>
                      <Box
                        overflow="auto"
                        height={"400px"}
                        ref={specsContainerRef}
                      >
                        {itemReq?.specs?.map((spec, index) => (
                          <Box key={spec.id} sx={{ mb: 0.5 }} mr={2}>
                            <Stack spacing={1}>
                              <TextareaComponent
                                label={`Specification ${index + 1}:`}
                                placeholder="e.g., Size: Large"
                                name={`spec-${index}`}
                                minRows={3}
                                value={spec.value}
                                onChange={(e) =>
                                  handleChange(spec.id, e.target.value)
                                }
                                size="sm"
                              />
                              {itemReq?.specs?.length > 1 && (
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
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{ bgcolor: "#EFEFEF", borderRadius: 20, padding: 3 }}
                >
                  <Stack spacing={2}>
                    <Typography level="title-sm">
                      Is this item exclusively procured by your unit?
                    </Typography>
                    <VerticalRadioComponent
                      name="exclusive_procurement"
                      value={itemReq.is_special}
                      setValue={(value) =>
                        setItemReq((prev) => ({
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
                  </Stack>
                  <Stack spacing={2} mt={3}>
                    <Typography level="title-sm">
                      Is this a major or specialized high-ticket purchase?{" "}
                    </Typography>
                    <VerticalRadioComponent
                      name="high_ticket"
                      value={itemReq.is_high_ticket}
                      setValue={(value) =>
                        setItemReq((prev) => ({
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
                    <Typography fontSize={13} color="neutral">
                      Select 'Yes' for items with significantly high unit cost
                      that require special procurement procedures or technical
                      evaluation before purchase.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            )}
            {currentStep === "special_details" && (
              <Stack spacing={2} mt={2}>
                <TextareaComponent
                  label="Market Scoping Document Link"
                  name="market_scoping_link"
                  value={itemReq.market_scoping_link}
                  helperText="⚠️ Ensure the link access is set to 'Anyone with the link can view'"
                  onChange={(e) =>
                    handleInputValidation(e, setItemReq, setError)
                  }
                />

                <TextareaComponent
                  label="Technical Specifications Document Link"
                  name="tech_specs_link"
                  value={itemReq.tech_specs_link}
                  helperText="⚠️ Ensure the link access is set to 'Anyone with the link can view'"
                  onChange={(e) =>
                    handleInputValidation(e, setItemReq, setError)
                  }
                />
              </Stack>
            )}

            {currentStep === "authorization" && (
              <Stack spacing={2}>
                <InputComponent
                  label={"Authorization PIN"}
                  type="password"
                  name="pin"
                  value={itemReq.pin}
                  helperText="Confirm you action by typing-in your authorization PIN."
                  handleInput={(e) => handleInputValidation(e, setItemReq)}
                />
              </Stack>
            )}
          </>
        }
      />
    </Fragment>
  );
}
