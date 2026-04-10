import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import useModalHook from "../../../Hooks/ModalHook";
import {
  Box,
  Checkbox,
  Chip,
  ChipDelete,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
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
      pin: "",
    });
  };

  const validateStep = () => {
    clearErrors();
    let hasError = false;

    if (step === 1) {
      if (!selectedActivities.length) {
        setError("activity", true, "Please select at least one activity.");
        hasError = true;
      }
    }

    if (step === 2) {
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

      if (!itemReq.quantity || itemReq.quantity <= 0) {
        setError("quantity", true, "Quantity must be greater than 0.");
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
    }

    return !hasError;
  };

  // === STEP HANDLERS ===
  const handleNextStep = () => {
    const isValid = validateStep();
    if (!isValid) return;

    setStep((prev) => Math.min(prev + 1, 3));
  };
  const handlePreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
    if (!itemReq?.pin?.trim()) {
      setError("pin", true, "Authorization PIN is required.");
      hasError = true;
    }
    console.log(hasError);
    if (hasError) return;

    try {
      setButtonLoader(true);
      const payload = {
        activity_id: selectedActivities.map((a) => a.activity_id),
        name: itemReq.item_name || "",
        item_classification_id: itemReq.classification?.id ?? null,
        item_category_id: itemReq.category?.id ?? null,
        quantity: itemReq.quantity,
        item_unit_id: itemReq.unit?.id ?? null,
        variant: itemReq?.variant?.id ?? null, // not required
        estimated_budget: itemReq?.estimated_budget ?? 0,
        authorization_pin: itemReq?.pin ?? "",
        market_research: itemReq?.market_research, // boolean
        specifications: itemReq?.specs?.map((spec) => ({
          description: spec?.value ?? "",
        })),
      };

      await postItemRequest(payload, (status, message, data) => {
        setButtonLoader(false);

        const alertData = {
          status: status === 201 ? "success" : "error",
          title: message,
        };

        setAlertDialog(alertData);

        if (status === 201) {
          setItemReq({
            classification: null,
            category: null,
            item_name: "",
            unit: null,
            estimated_budget: "",
            variant: null,
            market_research: false,
            specs: [
              { id: 1, value: "" },
              { id: 2, value: "" }, // initial two specs
            ],
            pin: "",
          });
          setActivity(null);
          setSelectedActivities([]);
          setOpenReq(false); // close modal
          setStep(1); // reset to step 1 if using a stepper
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

  useEffect(() => {
    if (openReq) {
      resetForm();
    }
  }, [openReq]);

  return (
    <div>
      <ModalComponent
        isOpen={openReq}
        handleClose={() => {
          setOpenReq(false);
        }}
        padding={2.5}
        title={
          step === 1
            ? "On what activity shall we assign the resources you’ll add?"
            : step === 2
              ? "General information"
              : step === 3
                ? "Specifications"
                : ""
        }
        description={
          step === 1
            ? "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
            : step === 2
              ? "Fill in the item information to create it."
              : step === 3
                ? "List down details for the item you want to cretae to specify it."
                : ""
        }
        maxWidth={"500px"}
        height={step === 1 ? "auto" : step === 2 ? "680px" : "680px"}
        content={
          <Fragment>
            <Box mt={1}>
              {step === 1 && (
                <Stack spacing={2}>
                  <AutocompleteComponent
                    label={"Select activity"}
                    name="activity"
                    options={activities}
                    getOptionLabel={(option) => option.activity_code || ""}
                    setValue={handleSelectActivity}
                    value={activity}
                    size="sm"
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
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                          >
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
              {step === 2 && (
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
                      handleInput={(e) => handleInputValidation(e, setItemReq)}
                      color="primary"
                      fontWeight={500}
                      helperText={"Quantity to add in PPMP"}
                    />

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
                  </Stack>
                  <AutocompleteComponent
                    label="Variant"
                    name="variant"
                    value={
                      variants?.find((el) => el.id === itemReq?.variant?.id) ||
                      null
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
                    value={itemReq?.estimated_budget}
                    handleInput={(e) => handleInputValidation(e, setItemReq)}
                    onBlur={(e) => {
                      setItemReq((prev) => ({
                        ...prev,
                        estimated_budget: formatNumber(e.target.value),
                      }));
                    }}
                    startDecorator={"₱"}
                  />

                  <Checkbox
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
                  />
                </Stack>
              )}
              {step === 3 && (
                <Stack spacing={2}>
                  <Stack>
                    <Box
                      height={"280px"}
                      overflow="auto"
                      ref={specsContainerRef}
                    >
                      {itemReq?.specs?.map((spec, index) => (
                        <Box key={spec.id} sx={{ mb: 0.5 }}>
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
                    <Divider sx={{ my: 1 }} />
                  </Stack>
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
            </Box>
          </Fragment>
        }
        leftButtonLabel={step > 1 ? "Back to previous" : "Cancel"}
        leftButtonAction={() => {
          if (step > 1) {
            handlePreviousStep();
          } else {
            resetForm();
            setOpenReq(false);
          }
        }}
        rightButtonLabel={step < 3 ? "Next step" : "Confirm and save"}
        rightButtonAction={() => {
          if (step < 3) {
            handleNextStep();
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
