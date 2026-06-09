import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import useModalHook from "../../../Hooks/ModalHook";
import { Box, Chip, ChipDelete, Grid, Link, Stack, Typography } from "@mui/joy";
import React, { Fragment, useEffect, useRef, useState } from "react";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import { grey } from "@mui/material/colors";
import { usePPMPActions, usePPMPState } from "../../../Hooks/PPMP/PPMPHook";
import { MdAdd } from "react-icons/md";
import { handleInputValidation } from "../../../Utils/HandleInput";
import handleSingleChangeAutcomplete from "../../../Utils/HandleAutocomplete";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import { formatNumber } from "../../../Utils/FormatNumber";
import VerticalRadioComponent from "@Components/Common/VerticalRadioComponent";

export default function AddItemRequest({ openReq, setOpenReq }) {
  const { setAlertDialog } = useModalHook();
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
  const { showSnack } = useSnackbarHook();
  const { postItemRequest, getActivities } = usePPMPActions();
  const { errors, setError, clearErrors } = userErrorInputHook();

  // === STATE VARIABLES ===
  const [step, setStep] = useState(1);
  const [activity, setActivity] = useState(null);
  const [expenseClass, setExpenseClass] = useState(null); // if needed

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
    pin: "",
  });

  const [buttonLoader, setButtonLoader] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]); // all selected

  // ref for scrolling container
  const specsContainerRef = useRef(null);

  const resetForm = () => {
    setStep(1);
    setActivity(null);
    setExpenseClass(null);
    setSelectedActivities([]);
    clearErrors();

    setItemReq({
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
  };

  const validateStep = () => {
    clearErrors();

    let hasError = false;

    if (currentStep === "activity") {
      if (selectedActivities.length === 0) {
        setError("activity", true, "Please select at least one activity.");

        hasError = true;
      }
    }

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

    return !hasError;
  };

  const steps = itemReq.is_high_ticket
    ? ["activity", "general", "special_details"]
    : ["activity", "general"];

  const currentStep = steps[step - 1];
  const finalStep = steps.length;

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, finalStep));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // === SPEC HANDLERS ===
  const addSpec = () => {
    setItemReq((prev) => ({
      ...prev,
      specs: [...prev.specs, { id: Date.now(), value: "" }],
    }));

    // Smooth scroll to bottom after adding new spec
    setTimeout(() => {
      if (specsContainerRef.current) {
        specsContainerRef.current.scrollTo({
          top: specsContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100); // Slight delay to ensure DOM is updated
  };

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

  const handleSelectActivity = (selected) => {
    // When user clears the Autocomplete
    if (!selected) {
      setActivity(null);
      return;
    }

    // Normal selection
    setActivity(selected);

    setSelectedActivities((prev) => {
      const exists = prev.some(
        (item) => item.activity_code === selected.activity_code,
      );

      if (exists) {
        showSnack(500, "Activity already selected.");
        return prev; // <-- IMPORTANT FIX
      }

      return [...prev, selected];
    });
  };

  const removeActivity = (activity_code) => {
    setSelectedActivities((prev) =>
      prev.filter((a) => a.activity_code !== activity_code),
    );

    // If the removed activity is currently selected in Autocomplete → clear it
    setActivity((prev) =>
      prev?.activity_code === activity_code ? null : prev,
    );
  };

  const submit = async () => {
    clearErrors();
    let hasError = false;

    itemReq.specs.forEach((spec, index) => {
      if (!spec.value.trim()) {
        setError(
          `spec-${index}`,
          true,
          `Specification ${index + 1} is required.`,
        );
        hasError = true;
      }
    });
    console.log(hasError);
    if (hasError) return;

    try {
      setButtonLoader(true);
      const payload = {
        name: itemReq.item_name || "",
        item_classification_id: itemReq.classification?.id ?? null,
        item_category_id: itemReq.category?.id ?? null,
        activity_id: selectedActivities.map((a) => a.activity_id),
        item_unit_id: itemReq.unit?.id ?? null,
        variant: itemReq?.variant?.id ?? null, // not required
        estimated_budget: itemReq?.estimated_budget ?? 0,
        quantity: itemReq.quantity,
        specifications: itemReq?.specs?.map((spec) => ({
          description: spec?.value ?? "",
        })),
        is_special: Boolean(itemReq.is_special),
        is_high_ticket: Boolean(itemReq.is_high_ticket),
        market_scoping_link: itemReq.market_scoping_link || null,
        tech_specs_link: itemReq.tech_specs_link || null,
        technical_requirements: itemReq.technical_requirements || "",
      };

      await postItemRequest(payload, (status, message, data) => {
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
            quantity: 0,
            is_special: false,
            is_high_ticket: false,
            market_scoping_link: "",
            tech_specs_link: "",
            technical_requirements: "",
            specs: [
              { id: 1, value: "" },
              { id: 2, value: "" },
            ],
          });
          setActivity(null);
          setSelectedActivities([]);
          setOpenReq(false); // close modal
          setStep(1); // reset to step 1 if using a stepper
          showSnack(status, message);
        } else {
          setAlertDialog({
            status: "error",
            title: "Request Failed",
            description:
              message || "An unexpected error occurred. Please try again.",
          });
        }
      });
    } catch (error) {
      setButtonLoader(false);
      setAlertDialog({
        status: "error",
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleBudgetChange = (e) => {
    const raw = e.target.value.replace(/,/g, ""); // remove commas

    if (!/^\d*$/.test(raw)) return; // allow only numbers

    setItemReq((prev) => ({
      ...prev,
      estimated_budget: raw,
    }));
  };

  useEffect(() => {
    setDisplayLoading(true);

    const apiCalls = [
      { fn: getItemCategories, name: "categories" },
      { fn: getItemClassification, name: "classification" },
      { fn: getActivities, name: "activities" },
      { fn: getItemUnits, name: "units" },
    ];

    if (itemReq.category?.id) {
      apiCalls.push({
        fn: (callback) => getVariantsByCategory(itemReq.category.id, callback),
        name: "variants",
      });
    } else {
      clearVariants();
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
  }, [itemReq.category?.id]);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (openReq && !prevOpenRef.current) {
      resetForm(); // only runs when opening
    }
    prevOpenRef.current = openReq;
  }, [openReq]);

  const modalConfig = {
    activity: {
      width: "480px",
      height: "auto",
    },
    general: {
      width: "1372px",
      height: "680px",
    },

    special_details: {
      width: "480px",
      height: "600px",
    },
  };

  const { width, height } = modalConfig[currentStep];

  return (
    <div>
      <ModalComponent
        isOpen={openReq}
        handleClose={() => {
          setOpenReq(false);
        }}
        padding={2.5}
        title={
          currentStep === "activity"
            ? "On what activity shall we assign the resources you’ll request?"
            : currentStep === "general"
              ? "General Information"
              : "Requirements Attachment"
        }
        description={
          currentStep === "activity"
            ? "We need to confirm where you want to have the selected item assigned since PPMP items are based on your AOP activities."
            : currentStep === "general"
              ? "Fill in the item information to create it."
              : "Please provide the secure cloud links (e.g., Google Drive, OneDrive) for the required documentation. "
        }
        maxWidth={width}
        minWidth={width}
        height={height} // Change from fixed height to auto
        content={
          <Fragment>
            <Box
              mt={1}
              sx={{
                maxHeight: step === 1 ? "none" : step === 2 ? "600px" : "600px",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 1, // Add some padding to account for scrollbar
              }}
            >
              {currentStep === "activity" && (
                <Stack spacing={2}>
                  <AutocompleteComponent
                    label={"Select activity"}
                    name="activity"
                    options={activities}
                    getOptionLabel={(option) => option.activity_code || ""}
                    setValue={handleSelectActivity}
                    value={activity}
                    size="sm"
                    helperText={
                      "You can select multiple activities.\nPlease make sure to select the correct activity for each item."
                    }
                  />
                  {selectedActivities.length > 0 && (
                    <Stack
                      sx={{
                        border: `1px dashed ${grey[400]}`,
                        padding: 1,
                        borderRadius: 10,
                      }}
                      spacing={1}
                    >
                      {selectedActivities.map((act) => (
                        <>
                          <Stack alignItems={"flex-start"} spacing={1}>
                            <Chip
                              color="primary"
                              size="sm"
                              endDecorator={
                                <ChipDelete
                                  onDelete={() =>
                                    removeActivity(act.activity_code)
                                  }
                                />
                              }
                            >
                              {act.activity_code}
                            </Chip>

                            <Typography sx={{ fontSize: 14 }}>
                              {act.activity_name}
                            </Typography>
                          </Stack>
                        </>
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}
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

                      <Stack direction={"row"} gap={1} width="100%">
                        <InputComponent
                          label="Quantity"
                          name="quantity"
                          size="sm"
                          value={itemReq?.quantity}
                          handleInput={(e) =>
                            handleInputValidation(e, setItemReq)
                          }
                          color="primary"
                          fontWeight={500}
                          helperText={"Quantity to add in PPMP"}
                        />

                        <AutocompleteComponent
                          label="Unit of measure"
                          name="unit"
                          value={
                            units?.find((el) => el.id === itemReq?.unit?.id) ||
                            null
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
                      </Stack>

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
                              "No, this item is part of the dispensing unit's common-use supplies.   ",
                          },
                        ]}
                      />
                    </Stack>
                    <Stack spacing={2} mt={3}>
                      <Typography level="title-sm">
                        Is this a major or specialized high-ticket
                        purchase?{" "}
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
            </Box>
          </Fragment>
        }
        leftButtonLabel={step > 1 ? "Back to previous" : "Cancel"}
        leftButtonAction={() => {
          if (step > 1) {
            prevStep();
          } else {
            resetForm();
            setOpenReq(false);
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
      />
    </div>
  );
}
