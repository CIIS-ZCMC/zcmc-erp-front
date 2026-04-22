import { useRef, useState, useEffect } from "react";

import { Stack, Checkbox, Box, Link, Divider } from "@mui/joy";
import { grey } from "@mui/material/colors";
import { MdAdd } from "react-icons/md";

import TextareaComponent from "@Components/Form/TextareaComponent";
import InputComponent from "@Components/Form/InputComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";

import { handleInputValidation } from "../../../../../Utils/HandleInput";
import handleSingleChangeAutcomplete from "../../../../../Utils/HandleAutocomplete";
import userErrorInputHook from "../../../../../Hooks/ErrorInputHook";

import {
  usePPMPActions,
  usePPMPState,
} from "../../../../../Hooks/PPMP/PPMPHook";
import useItemsHook from "../../../../../Hooks/ItemManagementHook";
import { formatNumber } from "../../../../../Utils/FormatNumber";

const Content = ({ step, itemReq, setItemReq }) => {
  const [displayLoading, setDisplayLoading] = useState(false);

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

  const { activities } = usePPMPState();
  const { getActivities } = usePPMPActions();

  const specsContainerRef = useRef(null);
  const { errors, setError, clearErrors } = userErrorInputHook();

  useEffect(() => {
    console.log(variants);
  }, [variants]);

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
  useEffect(() => {
    setDisplayLoading(true);

    const apiCalls = [
      { fn: getItemCategories, name: "categories" },
      { fn: getItemClassification, name: "classification" },
      { fn: getActivities, name: "activities" },
      { fn: getItemUnits, name: "units" },
    ];

    // Only fetch variants if category ID exists
    if (itemReq.category?.id) {
      apiCalls.push({
        fn: (callback) => getVariantsByCategory(itemReq.category.id, callback),
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
  }, [itemReq.category?.id]); // Re-run if category changes

  return (
    <>
      {step === 1 && (
        <Stack spacing={1.5} mb={1}>
          <TextareaComponent
            label="Item name"
            name="item_name"
            helperText="Use a specific and descriptive naming convention for best results."
            value={itemReq?.item_name}
            onChange={(e) => handleInputValidation(e, setItemReq, setError)}
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
                categories?.find((el) => el.id === itemReq?.category?.id) ||
                null
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
            value={units?.find((el) => el.id === itemReq?.unit?.id) || null}
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
              variants?.find((el) => el.id === itemReq?.variant?.id) || null
            }
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
                      onChange={(e) => handleChange(spec.id, e.target.value)}
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
  );
};

export default Content;
