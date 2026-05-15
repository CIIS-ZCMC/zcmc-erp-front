import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import React, { Fragment, useEffect, useRef, useState } from "react";
// Add New Item Request Components
import Content from "./Content";
import {
  usePPMPActions,
  usePPMPState,
} from "../../../../../Hooks/PPMP/PPMPHook";
import userErrorInputHook from "../../../../../Hooks/ErrorInputHook";
import { Box, Checkbox, Divider, Link, Stack } from "@mui/joy";
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
import useItemRequestsHook from "../../../../../Hooks/ItemRequest/ItemRequestHook";

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
  const { getItemRequestByUser, postItmRequest } = useItemRequestsHook();
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
    pin: "",
  });

  const [selectedActivities, setSelectedActivities] = useState([]);
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

    if (step === 1) {
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
    }

    return !hasError;
  };
  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
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
        name: itemReq.item_name || "",
        item_classification_id: itemReq.classification?.id ?? null,
        item_category_id: itemReq.category?.id ?? null,
        item_unit_id: itemReq.unit?.id ?? null,
        variant: itemReq?.variant?.id ?? null, // not required
        estimated_budget: itemReq?.estimated_budget ?? 0,
        authorization_pin: itemReq?.pin ?? "",
        market_research: itemReq?.market_research, // boolean
        specifications: itemReq?.specs?.map((spec) => ({
          description: spec?.value ?? "",
        })),
      };

      await postItmRequest(payload, (status, message, data) => {
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
            specs: [
              { id: 1, value: "" },
              { id: 2, value: "" }, // initial two specs
            ],
            pin: "",
          });
          setOpenNewRequest(false); // close modal
          setStep(1); // reset to step 1 if using a stepper
          showSnack(message, "success");
        } else {
          setButtonLoader(false);
          setAlertDialog({
            status: "error",
            title: "Request Failed",
            description: message,
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
  return (
    <Fragment>
      <ModalComponent
        isOpen={openNewRequest}
        handleClose={() => setOpenNewRequest(false)}
        title={step === 1 ? "General information" : "Specifications"}
        description={
          step === 1
            ? "Fill in the item information to create it"
            : "List down details for the item you want to cretae to specify it."
        }
        maxWidth={"500px"}
        height={step === 1 ? "auto" : "680px"}
        content={
          <>
            {step === 1 && (
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
                  fontWeight={500}
                  value={formatNumber(itemReq?.estimated_budget)}
                  handleInput={handleBudgetChange}
                  color="primary"
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

            {step === 2 && (
              <Stack spacing={2}>
                <Stack>
                  <Box height={"280px"} overflow="auto" ref={specsContainerRef}>
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
          </>
        }
        leftButtonLabel={step > 1 ? "Back to previous" : "Cancel"}
        leftButtonAction={() => {
          if (step > 1) {
            prevStep();
          } else {
            setOpenNewRequest(false);
          }
        }}
        rightButtonLabel={step < 2 ? "Next step" : "Confirm and save"}
        rightButtonAction={() => {
          if (step < 2) {
            nextStep();
          } else {
            submit();
          }
        }}
        isLoading={buttonLoader}
        hasActionButtons
      />
    </Fragment>
  );
}
