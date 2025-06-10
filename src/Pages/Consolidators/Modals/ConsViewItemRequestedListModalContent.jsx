import React, { useState, useCallback, useEffect, useRef } from "react";
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
  RadioGroup,
  Radio,
  Checkbox,
  CardContent,
  Sheet,
  Chip,
  List,
  ListItem,
  ListItemDecorator,
  IconButton,
} from "@mui/joy";
import { Fragment } from "react";
import AuthorizationPinComponent from "../../../Components/AuthorizationPinComponent";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import {
  CheckCircle,
  ChevronsRightLeft,
  Delete,
  Plus,
  PlusCircle,
  PlusCircleIcon,
  X,
} from "lucide-react";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import { MdReplay } from "react-icons/md";
import useTerminologyHooks from "../../../Hooks/Libraries/LibTerminology";
import useListUserRequestItemHook from "../../../Hooks/ItemRequest/ConsolidatorItemRequestUpdate";
import useUserRequestItemHook from "../../../Hooks/ItemRequest/EndUserItemRequest";

const ConsViewItemRequestedListModalContent = () => {
  const [isdonefirstload, setdonefirstload] = useState(false);
  const [step, setStep] = useState(0);
  const { openModal, setOpenModal, setAlertDialog } = useModalHook();

  const {
    selected_data: { all: clicked },
  } = useListUserRequestItemHook();

  const { selected_data } = useListUserRequestItemHook();
  const EditableAutoCompleteField = ({
    label,
    defaultValue,
    renderInput,
    resetHook = () => {},
    isEqual = (a, b) => a === b,
  }) => {
    const [value, setValue] = useState(defaultValue);
    const isEdited = !isEqual(value, defaultValue);
    const [showInput, setShowInput] = useState(false);

    const handleReset = () => {
      setValue(defaultValue);
      resetHook();
    };

    return (
      <>
        <Typography level="body-md">{label}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {renderInput(value, setValue)}
          {isEdited && (
            <Chip
              size="sm"
              color="warning"
              onClick={handleReset}
              endDecorator={
                <IconButton size="sm" variant="plain" sx={{ ml: 0.5, p: 0.5 }}>
                  <X size={14} />
                </IconButton>
              }
            >
              Edited
            </Chip>
          )}
        </Box>
      </>
    );
  };

  const EditableField = ({
    label,
    defaultValue,
    renderInput,
    resetHook = () => {},
  }) => {
    const [value, setValue] = useState(defaultValue);
    const isEdited = value !== defaultValue;

    const handleReset = () => {
      setValue(defaultValue);
      resetHook();
    };

    return (
      <>
        <Typography level="body-md">{label}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {renderInput(value, setValue)}
          {isEdited && (
            <Chip
              size="sm"
              color="warning"
              onClick={() => {
                console.log("Resetting value");
                handleReset();
              }}
              endDecorator={
                <IconButton size="sm" variant="plain" sx={{ ml: 0.5, p: 0.5 }}>
                  <X size={14} />
                </IconButton>
              }
            >
              Edited
            </Chip>
          )}
        </Box>
      </>
    );
  };

  const Step1 = ({ setStep }) => {
    const { getMyItemRequestLists } = useUserRequestItemHook();
    const getMyRequestData = useUserRequestItemHook(
      (state) => state.myRequests_dataTable
    );
    const { inputs, setInputs } = useLibItemHook();
    const categories = useCategoryHooks((state) => state.categories);
    const classifications = useClassificationHooks(
      (state) => state.classifications
    );
    const { updateItemRequest } = useListUserRequestItemHook();
    const [isFormEdited, setIsFormEdited] = useState(false);
    const formRef = useRef();
    const handleNext = (step) => {
      const form = formRef.current;

      if (form.checkValidity()) {
        setStep(step);
      } else {
        form.reportValidity();
      }
    };
    const setSelect = useListUserRequestItemHook(
      (state) => state.setSelectedData
    );

    function transformData(data) {
      return data.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        estimated_budget: item.estimated_budget,
        unit: item.unit,
        item_unit: item.item_unit,
        category: item.category,
        item_category: item.item_category,
        classification: item.classification,
        item_classification: item.item_classification,
        item_specifications: item.item_specifications,
        item_terminology: item.item_terminology,
        created_at: item.updated_at.split("T")[0],
        status: item.status,
        all: item,
      }));
    }

    const reloadSelected = (id) => {
      const transformed = transformData(getMyRequestData);
      const foundItem = transformed.find((item) => item.id === id);
      setSelect(foundItem);
      handleNext(1);
    };

    const unit = useClassificationHooks((state) => state.unit);
    useEffect(() => {
      if (clicked && !isdonefirstload) {
        setInputs("name", clicked.name || "");
        setInputs(
          "item_classification_id",
          clicked.item_classification?.id || null
        );
        setInputs("item_category_id", clicked.item_category?.id || null);
        setInputs("item_unit_id", clicked.item_unit?.id || null); // assuming this key exists
        setInputs(
          "terminology_category_id",
          clicked.item_terminology?.id || null
        );
        setInputs("estimated_budget", clicked.estimated_budget || "");
        setdonefirstload(true);
      }
    }, [clicked]);

    // Detect form edits
    useEffect(() => {
      const edited =
        inputs.name !== (clicked.name || "") ||
        inputs.item_classification_id !==
          (clicked.item_classification?.id || null) ||
        inputs.item_category_id !== (clicked.item_category?.id || null) ||
        inputs.item_unit_id !== (clicked.item_unit?.id || null) ||
        inputs.terminology_category_id !==
          (clicked.item_terminology?.id || null) ||
        inputs.estimated_budget !== (clicked.estimated_budget || "");

      setIsFormEdited(edited);
    }, [inputs, clicked]);

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
    const terminologyOptions =
      useTerminologyHooks((state) => state.terminology).map((row) => ({
        id: row.id,
        name: row.name,
      })) || [];

    const variantOptions = [
      { id: 1, name: "Cardiology" },
      { id: 2, name: "Neurology" },
      { id: 3, name: "Oncology" },
      { id: 4, name: "Dermatology" },
      { id: 5, name: "Pediatrics" },
    ];

    return (
      <Fragment>
        <Typography level="body-lg" fontWeight={"bold"}>
          Update
        </Typography>
        <Typography level="body-md">
          Make changes to the basic identification of the item to keep it up to
          date.
        </Typography>
        <Divider sx={{ marginTop: "20px" }} />

        <Box
          display="grid"
          gridTemplateColumns="1fr 2fr"
          columnGap={4}
          rowGap={2}
          p={3}
          bgcolor="#fdfdfd"
          borderRadius="12px"
          component={"form"}
          ref={formRef}
          noValidate
        >
          {/* Header */}
          <Typography level="body-sm" fontWeight="lg">
            Label
          </Typography>
          <Typography level="body-sm" fontWeight="lg">
            Value
          </Typography>
          {/* Classification */}
          <EditableAutoCompleteField
            label="Classification"
            defaultValue={classificationOptions.find(
              (item) => item.id === clicked?.item_classification?.id
            )}
            resetHook={() => {
              setInputs(
                "item_classification_id",
                clicked.item_classification?.id || null
              );
            }}
            isEqual={(a, b) => a?.id === b?.id}
            renderInput={(value, setValue) => (
              <>
                <Autocomplete
                  options={classificationOptions}
                  value={value}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(e, newValue) => {
                    setValue(newValue);
                    setInputs("item_classification_id", newValue?.id || null); // your external form state
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select classification"
                      required
                    />
                  )}
                />
              </>
            )}
          />

          {/* Category */}
          <EditableAutoCompleteField
            label="Category*"
            defaultValue={categoryOptions.find(
              (item) => item.id === clicked?.item_category?.id
            )}
            resetHook={() => {
              setInputs("item_category_id", clicked.item_category?.id || null);
            }}
            isEqual={(a, b) => a?.id === b?.id}
            renderInput={(value, setValue) => (
              <Autocomplete
                required
                options={categoryOptions}
                value={value}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(e, newValue) => {
                  setValue(newValue);
                  setInputs("item_category_id", newValue?.id || null); // your external form state
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Category" required />
                )}
              />
            )}
          />

          {/* Unit of measurement */}
          <EditableAutoCompleteField
            label="Unit of measurement*"
            defaultValue={unitOptions.find(
              (item) => item.id === clicked?.item_unit?.id
            )}
            resetHook={() => {
              setInputs("item_unit_id", clicked.item_unit?.id || null);
            }}
            isEqual={(a, b) => a?.id === b?.id}
            renderInput={(value, setValue) => (
              <Autocomplete
                required
                options={unitOptions}
                value={value}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(e, newValue) => {
                  setValue(newValue);
                  setInputs("item_unit_id", newValue?.id || null); // your external form state
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Unit" required />
                )}
              />
            )}
          />

          {/* Item name */}
          <EditableField
            label="Item name*"
            defaultValue={clicked?.name}
            resetHook={() => {
              setInputs("name", clicked?.name || null);
            }}
            renderInput={(value, setValue) => (
              <Input
                required
                value={value}
                onChange={(e) => {
                  setInputs("name", e.target.value);
                  setValue(e.target.value);
                }}
              />
            )}
          />
          <EditableAutoCompleteField
            label="Terminology*"
            defaultValue={terminologyOptions.find(
              (item) => item.id === clicked?.item_terminology?.id
            )}
            resetHook={() => {
              setInputs(
                "terminology_category_id",
                clicked.item_terminology?.id || null
              );
            }}
            isEqual={(a, b) => a?.id === b?.id}
            renderInput={(value, setValue) => (
              <Autocomplete
                required
                options={terminologyOptions}
                value={value}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(e, newValue) => {
                  setValue(newValue);
                  setInputs("terminology_category_id", newValue?.id || null); // your external form state
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Terminology" required />
                )}
              />
            )}
          />

          {/* Estimated budget */}
          <EditableField
            label="Estimated budget*"
            defaultValue={clicked?.estimated_budget}
            resetHook={() => {
              setInputs("estimated_budget", clicked?.estimated_budget || null);
            }}
            renderInput={(value, setValue) => (
              <Input
                required
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setInputs("estimated_budget", e.target.value || null);
                }}
              />
            )}
          />

          {/* Checkbox (Full width row) */}
          <Box
            gridColumn="1 / span 2"
            display="flex"
            alignItems="center"
            mt={2}
            bgcolor="#fff"
            p={2}
            borderRadius="8px"
            boxShadow="xs"
          >
            <Checkbox defaultChecked />
            <Typography level="body-sm" sx={{ ml: 1 }}>
              Requester has conducted a market research prior to setting the
              estimates.
            </Typography>
          </Box>
        </Box>

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
            onClick={
              isFormEdited
                ? () =>
                    updateItemRequest(
                      inputs,
                      () => {},
                      setAlertDialog,
                      getMyItemRequestLists,
                      reloadSelected
                    )
                : () => handleNext(1)
            }
          >
            {isFormEdited ? "Update" : "Next Step"}
          </Button>
        </Stack>
      </Fragment>
    );
  };

  const Step2 = () => {
    const [specs, setSpecs] = useState(
      clicked.item_specifications?.map((item) => ({
        ...item,
        current: item.description,
        value: item.description,
      }))
    );

    const handleChange = (index, newValue) => {
      const updated = [...specs];
      updated[index].current = newValue;
      setSpecs(updated);
    };

    const handleReset = (index) => {
      const updated = [...specs];
      updated[index].current = updated[index].value;
      setSpecs(updated);
    };

    const handleRemove = (index) => {
      const updated = specs.filter((_, i) => i !== index);
      setSpecs(updated);
    };

    const handleAdd = () => {
      setSpecs([...specs, { value: "", cusrrent: "" }]);
    };
    ///for the specification items inputs
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
        <Typography level="h4" fontWeight="lg" mb={1}>
          Specification for Item{" "}
          <Typography level="h4" component="span" color="warning">
            (#2023-0031)
          </Typography>
        </Typography>
        <Typography level="body-sm" mb={2}>
          List down unique identifiers for the item you want to create to
          specify it.
        </Typography>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Sheet
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: "12px",
                bgcolor: "#fdfdfd",
              }}
            >
              {/* Scrollable wrapper */}
              <Box
                sx={{
                  maxHeight: 300, // adjust to your desired max height
                  overflowY: "auto",
                  pr: 1, // optional right padding for scrollbar space
                }}
              >
                {/* Grid content */}
                <Box
                  display="grid"
                  gridTemplateColumns="1fr 2fr auto"
                  columnGap={2}
                  rowGap={2}
                >
                  {/* Header */}
                  <Typography level="body-sm" fontWeight="lg">
                    Label
                  </Typography>
                  <Typography level="body-sm" fontWeight="lg">
                    Final Value
                  </Typography>
                  <Box /> {/* Spacer for buttons */}
                  {/* Spec rows */}
                  {specs.map((spec, index) => {
                    const isEdited = spec.current !== spec.value;
                    return (
                      <Fragment key={index}>
                        <Typography
                          level="body-sm"
                          sx={{ alignSelf: "center" }}
                        >
                          Spec {index + 1}
                        </Typography>
                        <Input
                          value={spec.current}
                          onChange={(e) => handleChange(index, e.target.value)}
                          sx={{
                            height: 40,
                            "--Input-paddingInline": "0.75rem",
                            "--Input-minHeight": "40px",
                            border: isEdited
                              ? "1px solid var(--joy-palette-warning-outlinedBorder)"
                              : undefined,
                            backgroundColor: isEdited
                              ? "var(--joy-palette-warning-softBg)"
                              : undefined,
                          }}
                          endDecorator={
                            <Box minWidth="45px">
                              {isEdited && (
                                <Typography
                                  level="body-xs"
                                  color="warning"
                                  fontWeight="md"
                                  textAlign="right"
                                >
                                  edited
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Box display="flex" gap={1}>
                          {isEdited && (
                            <IconButton
                              size="sm"
                              color="warning"
                              onClick={() => handleReset(index)}
                            >
                              <MdReplay />
                            </IconButton>
                          )}
                          <IconButton
                            size="sm"
                            color="danger"
                            variant="outlined"
                            onClick={() => handleRemove(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Fragment>
                    );
                  })}
                </Box>
              </Box>

              {/* Add Another button outside scroll */}
              <Box mt={2}>
                <Button
                  startDecorator={<PlusCircleIcon />}
                  variant="soft"
                  onClick={handleAdd}
                  size="sm"
                >
                  Add another
                </Button>
              </Box>
            </Sheet>
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
            // disabled={isAuthorized ? false : true}
            loading={loader}
            loadingPosition="end"
            onClick={() => {
              return setStep(2);
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
    const { getMyItemRequestLists } = useUserRequestItemHook();
    const [status, setStatus] = React.useState("approve");
    const [remarks, setRemarks] = React.useState("");
    const [pin, setPin] = React.useState("");
    const { inputs, setInputs } = useLibItemHook();
    const { approveItemRequest } = useListUserRequestItemHook();
    const formRef = useRef();
    const handleNext = (step) => {
      const form = formRef.current;

      if (form.checkValidity()) {
        setStep(step);
      } else {
        form.reportValidity();
      }
    };

    return (
      <Fragment>
        <Typography level="h4" fontWeight="lg" mb={1}>
          Process request{" "}
          <Typography level="h4" component="span" color="warning">
            (#2023-0031)
          </Typography>
        </Typography>
        <Typography level="body-sm" mb={2}>
          Select a request status and reasons (if returned) to continue. You may
          add remarks if necessary.
        </Typography>

        {/* Custom Radio Buttons */}
        <Box display="flex" gap={2} mt={2} height={100}>
          <Box
            onClick={() => setStatus("approve")}
            sx={{
              flex: 1,
              px: 2,
              py: 1.5,
              borderRadius: "md",
              border: "2px solid",
              borderColor:
                status === "approve" ? "success.500" : "neutral.outlinedBorder",
              backgroundColor:
                status === "approve" ? "success.softBg" : "transparent",
              color: status === "approve" ? "success.700" : "text.primary",
              textAlign: "center",
              cursor: "pointer",
              display: "flex", // <-- Added
              alignItems: "center", // <-- Vertically centers content
              justifyContent: "center",
              "&:hover": {
                borderColor: "success.500",
                backgroundColor: "success.softHoverBg",
              },
            }}
          >
            Approve
          </Box>
          <Box
            onClick={() => setStatus("decline")}
            sx={{
              flex: 1,
              px: 2,
              py: 1.5,
              borderRadius: "md",
              border: "2px solid",
              borderColor:
                status === "decline" ? "warning.500" : "neutral.outlinedBorder",
              backgroundColor:
                status === "decline" ? "warning.softBg" : "transparent",
              color: status === "decline" ? "warning.700" : "text.primary",
              textAlign: "center",
              display: "flex", // <-- Added
              alignItems: "center", // <-- Vertically centers content
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "warning.500",
                backgroundColor: "warning.softHoverBg",
              },
            }}
          >
            Decline
          </Box>
        </Box>

        {/* Remarks */}
        <Box mt={3}>
          <Typography level="body-sm" fontWeight="md" mb={1}>
            Remarks
          </Typography>
          <Textarea
            minRows={3}
            placeholder="Enter your remarks here"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Box>

        {/* PIN */}
        <Box mt={3}>
          <Typography level="body-sm" fontWeight="md" mb={1}>
            Authorization PIN
          </Typography>
          <Input
            type="password"
            placeholder="******"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <Typography level="body-xs" mt={0.5}>
            Confirm your action by typing-in your authorization PIN.
          </Typography>
        </Box>

        {/* Buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ fontWeight: "normal" }}
            onClick={() => {
              setStep(1);
            }}
            color="neutral"
          >
            Previous
          </Button>
          <Button
            fullWidth
            sx={{ fontWeight: "normal" }}
            // disabled={isAuthorized ? false : true}
            // loading={loader}
            loadingPosition="end"
            onClick={() => {
              approveItemRequest(
                {
                  status: status == "approve" ? "approved" : "returned",
                },
                setAlertDialog,
                () => {
                  setOpenModal(false, false, false);
                },
                getMyItemRequestLists
              );
            }}
          >
            Confirm and Save
          </Button>
        </Stack>
      </Fragment>
    );
  };

  const ItemSummary = ({ data }) => {
    return (
      <Card
        variant="outlined"
        sx={{ maxWidth: 600, mx: "auto", my: 4, minWidth: 400 }}
      >
        <CardContent>
          <Typography level="h4">Item Summary</Typography>
          <Sheet variant="outlined" sx={{ my: 2, p: 2, borderRadius: "md" }}>
            <Typography level="body-sm">Classification</Typography>
            <Typography>{data.classification}</Typography>

            <Typography level="body-sm" mt={2}>
              Category
            </Typography>
            <Typography>{data.category}</Typography>

            <Typography level="body-sm" mt={2}>
              Unit of Measurement
            </Typography>
            <Typography>{data.uom}</Typography>

            <Typography level="body-sm" mt={2}>
              Item Name
            </Typography>
            <Typography>{data.itemName}</Typography>

            <Typography level="body-sm" mt={2}>
              Item Variant
            </Typography>
            <Chip color="primary" size="sm" variant="soft">
              {data.itemVariant}
            </Chip>

            <Typography level="body-sm" mt={2}>
              Estimated Budget
            </Typography>
            <Typography>₱ {data.estimatedBudget.toLocaleString()}</Typography>
          </Sheet>

          <Divider sx={{ my: 2 }} />

          <Typography level="h5" gutterBottom>
            Specifications
          </Typography>
          <List marker="disc">
            {data.specifications.map((spec, index) => (
              <ListItem key={index}>
                <ListItemDecorator>
                  <CheckCircle size={16} />
                </ListItemDecorator>
                {spec}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
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
  const getTerminology = useTerminologyHooks((state) => state.getTerminology);

  useEffect(() => {
    getCategories((status, message) => {});
    getClassifications((status, message) => {});
    getUnit((status, message) => {});
    getTerminology((status, message) => {});
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

export default ConsViewItemRequestedListModalContent;
