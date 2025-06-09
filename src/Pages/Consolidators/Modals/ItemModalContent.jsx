import React, { useState, useCallback, useEffect } from "react";
import {
  Typography,
  Divider,
  Grid,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  FormHelperText,
  Autocomplete,
  Card,
  Box,
  Select,
  Option,
  Button,
  Stack,
} from "@mui/joy";
import { Fragment } from "react";
import AuthorizationPinComponent from "../../../Components/AuthorizationPinComponent";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import { ChevronsRightLeft } from "lucide-react";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";

export const ItemModalContent = () => {
  const [step, setStep] = useState(0);
  const { openModal, setOpenModal } = useModalHook();
  const ToggleCard = ({ label, inputs, setInputs }) => {
    return (
      <Card
        variant="outlined"
        sx={{
          cursor: "pointer",
          border:
            inputs?.variant == label
              ? "2px solid #129990"
              : "2px solid #EEEEEE",
          color: inputs?.variant == label ? "primary.dark" : "neutral.main",
          userSelect: "none",
          textAlign: "center",
          padding: "12px",
          transition: "all 0.5s ease",
        }}
        onClick={() => setInputs("variant", label)}
      >
        <Stack direction={"row"} spacing={2}>
          {inputs?.variant == label && (
            <IoCheckmarkOutline
              style={{ fontSize: "20px", padding: "2px 0 0 4px " }}
            />
          )}
          <Typography>{label}</Typography>
        </Stack>
      </Card>
    );
  };
  const Step1 = ({ setStep }) => {
    const { inputs, setInputs, updateData } = useLibItemHook();
    const categories = useCategoryHooks((state) => state.categories);
    const classifications = useClassificationHooks(
      (state) => state.classifications
    );
    const unit = useClassificationHooks((state) => state.unit);
    const classificationOptions =
      classifications.map((row) => ({
        id: row.id,
        name: row.name,
      })) || [];
    const categoryOptions =
      categories?.map((row) => ({ id: row.id, name: row.name })) || [];
    const unitOptions =
      unit?.map((row) => ({
        id: row.id,
        name: row.name,
      })) || [];
    const variantOptions =
      useVariantHooks((state) => state.variants).map((row) => ({
        id: row.id,
        name: row.name,
      })) || [];
    return (
      <Fragment>
        <Typography level="body-lg" fontWeight={"bold"}>
          {updateData ? "Update" : "General information"}
        </Typography>
        <Typography level="body-md">
          {updateData
            ? "Make changes to the basic identification of the item to keep it up to date."
            : "Fill-in basic identification of the item you wish to add to the item library."}
        </Typography>

        <Divider sx={{ marginTop: "20px" }} />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Item name</FormLabel>
              <Textarea
                minRows={2}
                value={inputs?.name || ""}
                onChange={(e) => setInputs("name", e.target.value)}
              />

              <FormHelperText>
                Use a specific and descriptive naming conventions for best
                results.
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Classification</FormLabel>
              <Autocomplete
                required
                placeholder="Select classification"
                options={classificationOptions}
                getOptionLabel={(option) => option.name}
                value={classificationOptions.find(
                  (item) => item.id === inputs?.item_classification_id
                )}
                onChange={(e, value) => {
                  setInputs("item_classification_id", value?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="item_classification_id"
                    label="Classification"
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Autocomplete
                required
                placeholder="Select category"
                options={categoryOptions}
                value={categoryOptions.find(
                  (item) => item.id === inputs?.item_category_id
                )}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => {
                  setInputs("item_category_id", value?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="item_category_id"
                    label="item_category_id"
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <FormLabel sx={{ mb: 1 }}>Terminology</FormLabel>
              <Autocomplete
                required
                placeholder="Select Terminology"
                options={variantOptions}
                value={variantOptions.find(
                  (item) => item.id === inputs?.term_id
                )}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => {
                  setInputs("term_id", value?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="term_id"
                    label="term_id"
                    required
                  />
                )}
              />
              {/* <Grid container spacing={2}>
                <Grid item xs={4}>
                  <ToggleCard
                    label={"Low-end"}
                    setInputs={setInputs}
                    inputs={inputs}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ToggleCard
                    label={"Mid-range"}
                    setInputs={setInputs}
                    inputs={inputs}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ToggleCard
                    label={"High-end"}
                    setInputs={setInputs}
                    inputs={inputs}
                  />
                </Grid>
              </Grid> */}
            </Box>
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Unit of measurement</FormLabel>
              <Autocomplete
                required
                placeholder="Select category"
                options={unitOptions}
                value={unitOptions.find(
                  (item) => item.id === inputs?.item_unit_id
                )}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => {
                  setInputs("item_unit_id", value?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="item_unit_id"
                    label="item_unit_id"
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormLabel sx={{ mb: 1 }}>Estimated Budget</FormLabel>
            <Input
              type="number"
              placeholder="PHP 0.00"
              value={inputs?.estimated_budget}
              onChange={(e) => {
                setInputs("estimated_budget", e.target.value);
              }}
            />
          </Grid>
          {/* */}
        </Grid>

        <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />

        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ fontWeight: "normal" }}
            color="neutral"
            onClick={() => setOpenModal(false, false, false)}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            sx={{ fontWeight: "normal" }}
            onClick={() => {
              console.log(updateData);
              setStep(1);
            }}
          >
            Next Step
          </Button>
        </Stack>
      </Fragment>
    );
  };

  const Step2 = () => {
    const { inputs, setInputSpecification, updateData } = useLibItemHook();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loader, setLoader] = useState(false);
    const updateSpec = (index, value) => {
      const updated = [...inputs.specification];
      updated[index].description = value;
      setInputSpecification(updated);
    };
    const SaveItem = useLibItemHook((state) => state.SaveItem);
    return (
      <Fragment>
        <Typography level="body-lg" fontWeight={"bold"}>
          Specifications
        </Typography>
        <Typography level="body-md">
          List down details for the item you want to create to specify it.
        </Typography>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Selected Item</FormLabel>
              <FormHelperText>
                Use a specific and descriptive naming conventions for best
                results.
              </FormHelperText>
            </FormControl>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                maxHeight: "200px",
                overflowY: "scroll",
                backgroundColor: "#FFFDF6",
                padding: "5px",
              }}
            >
              {/* MULTI SPECIFICATIONS ITEMS */}
              {inputs?.specification?.map((row, key) => (
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Specification {key + 1}</FormLabel>
                  <Textarea
                    value={inputs?.specification?.[key]?.description || ""}
                    minRows={2}
                    onChange={(e) => {
                      updateSpec(key, e.target.value);
                    }}
                  />

                  <FormHelperText sx={{ display: "block" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="outlined"
                        color="danger"
                        size="small"
                        sx={{
                          fontWeight: "normal",
                          fontSize: "11px",
                          display:
                            inputs?.specification?.length == 1
                              ? "none"
                              : "block",
                        }}
                        onClick={() => {
                          setInputSpecification(
                            inputs?.specification?.filter((_, i) => i !== key)
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </FormHelperText>
                </FormControl>
              ))}

              {/* MULTI SPECIFICATIONS ITEMS */}
            </Box>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
            <Button
              variant="soft"
              sx={{ fontWeight: "normal", fontSize: "13px" }}
              endDecorator={<IoAddCircleOutline style={{ fontSize: "16px" }} />}
              onClick={() => {
                setInputSpecification([
                  ...inputs?.specification,
                  { description: "" },
                ]);
              }}
            >
              Add another
            </Button>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
            <AuthorizationPinComponent setIsAuthorized={setIsAuthorized} />
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: "40px", marginBottom: "10px" }} />

        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ fontWeight: "normal" }}
            onClick={() => {
              setStep(0);
            }}
            color="neutral"
          >
            Previous
          </Button>
          <Button
            fullWidth
            sx={{ fontWeight: "normal" }}
            disabled={isAuthorized ? false : true}
            loading={loader}
            loadingPosition="end"
            onClick={() => {
              //Saved here
              // setLoader(true);
              /////////////////////////////////////

              SaveItem(inputs, (status, message) => {
                if (!status) {
                  console.error("Error saving item:", message);
                  return;
                }

                console.log("awww");
                // setLoader(false);
                // setStep(2);

                return;
              });

              return;
              setTimeout(() => {
                setLoader(false);
                setStep(2);
              }, 1000);
            }}
          >
            {updateData ? "Update" : "Continue"}
          </Button>
        </Stack>
      </Fragment>
    );
  };

  const Step3 = () => {
    const { resetInput } = useLibItemHook();
    const [isAuthorized, setIsAuthorized] = useState(false);
    return (
      <Fragment>
        <Typography level="body-lg" fontWeight={"bold"}>
          New item "#2023-0031" successfully saved to the library
        </Typography>
        <Typography level="body-md">
          You can use it for requesting AOP and PPMP documents. Everyone can see
          and use the new item
        </Typography>

        {/* <AuthorizationPinComponent setIsAuthorized={setIsAuthorized} /> */}

        <Stack direction="row" spacing={1} mt={5}>
          <Button
            fullWidth
            color="neutral"
            variant="outlined"
            sx={{ fontWeight: "normal" }}
          >
            Open Item
          </Button>
          <Button
            fullWidth
            sx={{ fontWeight: "normal" }}
            onClick={() => {
              resetInput();
              setOpenModal(false, false, false);
            }}
          >
            Close
          </Button>
        </Stack>
      </Fragment>
    );
  };

  const ConfirmDeletion = () => {
    const [loader, setLoader] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    return (
      <Fragment>
        {confirmed ? (
          <>
            <Typography
              level="body-lg"
              fontWeight={"bold"}
              sx={{ width: "500px" }}
            >
              Library item "<span style={{ color: "#CB0404" }}>#2023-0031</span>
              "
            </Typography>
            <Typography level="body-md">
              has been successfully deleted.
            </Typography>
          </>
        ) : (
          <>
            <Typography level="body-lg" fontWeight={"bold"}>
              Delete item " <span style={{ color: "#CB0404" }}>#2023-0031</span>{" "}
              " ?
            </Typography>
            <Typography level="body-md">
              This action cannot be undone
            </Typography>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
            <AuthorizationPinComponent setIsAuthorized={setIsAuthorized} />
          </>
        )}

        <Stack direction="row" spacing={1} mt={5}>
          <Button
            fullWidth
            variant={confirmed ? "solid" : "outlined"}
            color="neutral"
            sx={{ fontWeight: "normal", width: confirmed ? "100%" : "200px" }}
            onClick={() => setOpenModal(false, false, false)}
          >
            {confirmed ? "Close" : "Cancel"}
          </Button>
          {!confirmed && (
            <Button
              fullWidth
              sx={{ fontWeight: "normal", width: "200px" }}
              onClick={() => {
                setLoader(true);
                /////////////////////////////////////

                setTimeout(() => {
                  setLoader(false);
                  setConfirmed(true);
                }, 1000);
              }}
              color="danger"
              disabled={isAuthorized ? false : true}
              loading={loader}
              loadingPosition="end"
            >
              Confirm and delete
            </Button>
          )}
        </Stack>
      </Fragment>
    );
  };

  const getCategories = useCategoryHooks((state) => state.getCategories);
  const getClassifications = useClassificationHooks(
    (state) => state.getClassifications
  );
  const getUnit = useClassificationHooks((state) => state.getUnit);
  const getVariants = useVariantHooks((state) => state.getVariants);

  useEffect(() => {
    getCategories((status, message) => {});
    getClassifications((status, message) => {});
    getUnit((status, message) => {});
    getVariants((status, message) => {});
  }, []);
  return (
    <Fragment>
      {openModal.isDelete ? (
        <ConfirmDeletion />
      ) : step == 0 ? (
        <Step1 setStep={setStep} />
      ) : step == 1 ? (
        <Step2 setStep={setStep} />
      ) : step == 2 ? (
        <Step3 setStep={setStep} />
      ) : (
        ""
      )}
    </Fragment>
  );
};
