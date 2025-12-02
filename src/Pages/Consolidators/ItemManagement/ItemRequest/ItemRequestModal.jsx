import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import TabComponent from "@Components/Common/TabComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import useItemsHook from "../../../../Hooks/ItemsHook";
import { TextSnippetOutlined, Today } from "@mui/icons-material";
import { Checkbox, Divider, Stack, Typography, Box, Link } from "@mui/joy";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";

import { MdAdd } from "react-icons/md";

import useItemRequestHook from "../../../../Hooks/ItemRequest/ItemRequestHookv2";

import IconLessRadioButtonComponent from "@Components/IconLessRadioButtonComponent";


export default function ItemRequestModal({ open, handleClose, status, row }) {

  const [pin, setPin] = useState("");
  const [displayLoading, setDisplayLoading] = useState(false);
  const [index, setIndex] = useState("info");
  const [selectedVariant, setSelectedVariant] = useState(null);

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
    if (row) {
      setFormData({
        name: row.name || "",
        classification: row.item_classification || "",
        category: row.item_category || "",
        unit: row.item_unit || "",
        estimated_budget: row.estimated_budget || "",
        item_specifications:
          row.item_specifications?.map((s) => ({ ...s })) || [],
        market_research_done: row?.market_research_done || false,
      });
    }
  }, [row]);

  // === SPEC HANDLERS ===
  const addSpec = () =>
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.item_specifications, { id: Date.now(), description: "" }],
    }));

  const removeSpec = (id) =>
    setFormData((prev) => ({
      ...prev,
      specs: prev.item_specifications.filter((spec) => spec.id !== id),
    }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...formData.item_specifications];
    newSpecs[index].description = value;
    setFormData((prev) => ({ ...prev, item_specifications: newSpecs }));
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
        fn: (callback) => getVariantsByCategory(callback, formData.category.id),
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
  }, [formData.category.id]); // Re-run if category changes

  useEffect(() => {
    console.log(variants)
  }, [variants])


  const handleSubmitItemRequest = () => {

    console.log(formData)

    const { name, estimated_budget, unit, classification, market_research_done, item_specifications } = formData;

    const payload = {
      status_id: 4,
      authorization_pin: pin,
      name,
      estimated_budget,
      item_unit_id: unit.id,
      item_category_id: classification.id,
      terminology_category_id: Number(selectedVariant),
      market_research: market_research_done,
      specifications: item_specifications.map(({ description }) => ({ description }))
    };

    console.log(payload)

  }

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
                      value={formData.name}
                      handleInput={(e) => handleChange("name", e.target.value)}
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
                        value={
                          classification?.find(
                            (el) => el.id === formData?.classification?.id
                          ) || null
                        } // Match the full object in value
                        handleSelect={(value) => {
                          handleSingleChangeAutcomplete(
                            value,
                            setFormData,
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
                            (el) => el.id === formData?.category?.id
                          ) || null
                        }
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        handleSelect={(value) => {
                          handleSingleChangeAutcomplete(
                            value,
                            setFormData,
                            "category",
                            setError
                          );
                        }}
                      />
                    </Stack>

                    <Stack>
                      <IconLessRadioButtonComponent
                        data={variants}
                        onChange={(id) => setSelectedVariant(id)}
                      />
                    </Stack>

                    <Stack direction={"row"} spacing={1}>
                      <AutocompleteComponent
                        label="Unit of measure"
                        name="unit"
                        value={
                          units?.find((el) => el.id === formData?.unit?.id) ||
                          null
                        }
                        options={units}
                        getOptionLabel={(option) => option.name || ""}
                        handleSelect={(value) => {
                          handleSingleChangeAutcomplete(
                            value,
                            setFormData,
                            "unit",
                            setError
                          );
                        }}
                      />
                      <InputComponent
                        label={"Estimated Budget"}
                        value={formData.estimated_budget}
                        handleInput={(e) =>
                          handleChange("estimated_budget", e.target.value)
                        }
                        startDecorator={"₱"}
                      />
                    </Stack>
                    <Checkbox
                      label="I have conducted a market research prior setting the budget estimates."
                      sx={{ color: grey[900], fontSize: 13, pt: 1 }}
                      size="sm"
                      checked={1}
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <Box
                      height={"280px"}
                      overflow="auto"
                    // ref={specsContainerRef}
                    >
                      {formData?.specs?.map((spec, index) => (
                        <Box key={spec.id} sx={{ mb: 0.5 }}>
                          <Stack spacing={1}>
                            <TextareaComponent
                              label={`Specification ${index + 1}:`}
                              placeholder="e.g., Size: Large"
                              minRows={3}
                              value={spec.description}
                              onChange={(e) =>
                                handleSpecChange(i, e.target.value)
                              }
                              size="sm"
                            />
                            {formData?.specs?.length > 1 && (
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
            <Typography>Hello</Typography>
          )
        }
        hasActionButtons
        rightButtonLabel='Submit'
        rightButtonAction={() => handleSubmitItemRequest()}
        noRightButton={false}

      />
    </div>
  );
}
