import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import useModalHook from "../../../Hooks/ModalHook";
import { Box, Checkbox, Divider, Link, Stack, Typography } from "@mui/joy";
import React, { Fragment, useEffect, useRef, useState } from "react";
import useItemsHook from "../../../Hooks/ItemsHook";
import { grey } from "@mui/material/colors";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import { MdAdd } from "react-icons/md";

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
    getVariants,
  } = useItemsHook();
  const { activities, getActivities } = usePPMPHook();
  // === STATE VARIABLES ===
  const [step, setStep] = useState(1);
  const [activity, setActivity] = useState(null);
  const [expenseClass, setExpenseClass] = useState(null); // if needed
  const [itemReq, setItemReq] = useState({
    classification: null,
    category: null,
    item_name: "",
    unit: null,
    estimated_budget: "",
    variant: null,
    market_research: false,
    specs: [{ id: 1, value: "" }],
    pin: "",
  });
  const [buttonLoader, setButtonLoader] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);

  // ref for scrolling container
  const specsContainerRef = useRef(null);

  // === STEP HANDLERS ===
  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
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
        spec.id === id ? { ...spec, value } : spec
      ),
    }));

  const handleRequest = async () => {
    clearErrors();
    let hasError = false;
    // if (!itemReq?.specs?.length || itemReq.specs.some((s) => !s.value.trim())) {
    //   setError("specs", true, "Please complete all specifications.");
    //   hasError = true;
    // }
    itemReq.specs.forEach((spec, index) => {
      if (!spec.value.trim()) {
        setError(
          `specs[${index}]`,
          true,
          `Specification ${index + 1} is required.`
        );
        hasError = true;
      }
    });
    if (!itemReq?.pin?.trim()) {
      setError("pin", true, "Authorization PIN is required.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setButtonLoader(true);
      const formData = new FormData();
      formData.append("activity", JSON.stringify(activity));
      formData.append("expense_class", JSON.stringify(expenseClass));
      formData.append("classification", JSON.stringify(itemReq.classification));
      formData.append("category", JSON.stringify(itemReq.category));
      formData.append("item_name", itemReq.item_name || "");
      formData.append("unit", JSON.stringify(itemReq.unit));
      formData.append("estimated_budget", itemReq.estimated_budget || "");
      formData.append("variant", JSON.stringify(itemReq.variant));
      formData.append(
        "market_research",
        itemReq.market_research ? "true" : "false"
      );
      formData.append("specifications", JSON.stringify(itemReq.specs));
      formData.append("pin", itemReq.pin || "");

      await postItemRequest(formData, (status, message, data) => {
        setButtonLoader(false);

        const alertData = {
          status: status === 201 ? "success" : "error",
          title: message,
          description: message,
        };

        setAlertDialog(alertData);
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
      { fn: getVariants, name: "variants" },
    ];

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
  }, []);

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
                    label={"Select one activity"}
                    name="activity"
                    options={activities}
                    getOptionLabel={(option) => option.activity_code || ""}
                    setValue={setActivity}
                    value={activity}
                    size="sm"
                  />
                  {activity?.name && (
                    <>
                      <Divider />
                      <Typography sx={{ fontSize: 12, color: "gray" }}>
                        Description of selected activity
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        {activity?.name}
                      </Typography>
                    </>
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
                          (el) => el.id === itemReq?.classification?.id
                        ) || null
                      } // Match the full object in value
                      handleSelect={(value) => {
                        handleSingleChangeAutcomplete(
                          value,
                          setItemReq,
                          "classification",
                          setError
                        );
                      }}
                    />

                    <AutocompleteComponent
                      label="Category"
                      name="category"
                      value={
                        categories?.find(
                          (el) => el.id === itemReq?.category?.id
                        ) || null
                      }
                      options={categories}
                      getOptionLabel={(option) => option.name || ""}
                      handleSelect={(value) => {
                        handleSingleChangeAutcomplete(
                          value,
                          setItemReq,
                          "category",
                          setError
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
                          setError
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
                    options={variants}
                    getOptionLabel={(option) => option.name || ""}
                    handleSelect={(value) => {
                      handleSingleChangeAutcomplete(
                        value,
                        setItemReq,
                        "variant",
                        setError
                      );
                    }}
                  />
                  <InputComponent
                    label="Estimated budget"
                    name="estimated_budget"
                    size="sm"
                    value={itemReq?.estimated_budget}
                    handleInput={(e) => handleInputValidation(e, setItemReq)}
                    color="primary"
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
                  <Box>
                    <Typography fontSize={13} color="grey.600">
                      Item name
                    </Typography>
                    <Typography fontSize={14}>
                      {" "}
                      {itemReq?.item_name}{" "}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                  <Stack>
                    <Box
                      height={"235px"}
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
            setOpenReq(false);
          }
        }}
        rightButtonLabel={step < 3 ? "Next step" : "Confirm and save"}
        rightButtonAction={() => {
          if (step < 3) {
            handleNextStep();
          } else {
            handleRequest();
          }
        }}
        isLoading={buttonLoader}
        hasActionButtons
      />
    </div>
  );
}
