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
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import { MdReplay } from "react-icons/md";

const ConsViewItemRequestedListModalContent = () => {
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

  const EditableField = ({ label, defaultValue, renderInput }) => {
    const [value, setValue] = useState(defaultValue);
    const isEdited = value !== defaultValue;

    const handleReset = () => {
      setValue(defaultValue);
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
    // return (
    //   <ItemSummary
    //     data={{
    //       classification: "Sample classification 01",
    //       category: "Sample category 01",
    //       uom: "Sample UOM",
    //       itemName: "Sample item name 01",
    //       itemVariant: "High-end",
    //       estimatedBudget: 14000,
    //       specifications: ["Specification 1 detail", "Specification 2 detail"],
    //     }}
    //   />
    // );

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

        <Box
          display="grid"
          gridTemplateColumns="1fr 2fr"
          columnGap={4}
          rowGap={2}
          p={3}
          bgcolor="#fdfdfd"
          borderRadius="12px"
        >
          {/* Header */}
          <Typography level="body-sm" fontWeight="lg">
            Label
          </Typography>
          <Typography level="body-sm" fontWeight="lg">
            Value
          </Typography>

          {/* Classification */}
          <EditableField
            label="Classification"
            defaultValue="Sample classification"
            renderInput={(value, setValue) => (
              <Select value={value} onChange={(e, val) => setValue(val)}>
                <Option value="Sample classification">
                  Sample classification
                </Option>
                <Option value="Other classification">
                  Other classification
                </Option>
              </Select>
            )}
          />

          {/* Category */}
          <EditableField
            label="Category"
            defaultValue="Sample category 01"
            renderInput={(value, setValue) => (
              <Select value={value} onChange={(e, val) => setValue(val)}>
                <Option value="Sample category 01">Sample category 01</Option>
                <Option value="Other category">Other category</Option>
              </Select>
            )}
          />

          {/* Unit of measurement */}
          <EditableField
            label="Unit of measurement"
            defaultValue="Sample UOM"
            renderInput={(value, setValue) => (
              <Select value={value} onChange={(e, val) => setValue(val)}>
                <Option value="Sample UOM">Sample UOM</Option>
                <Option value="Alternative UOM">Alternative UOM</Option>
              </Select>
            )}
          />

          {/* Item name */}
          <EditableField
            label="Item name"
            defaultValue="Sample item name 01"
            renderInput={(value, setValue) => (
              <Input value={value} onChange={(e) => setValue(e.target.value)} />
            )}
          />

          {/* Item variant */}
          <EditableField
            label="Item variant"
            defaultValue="Mid-range"
            renderInput={(value, setValue) => (
              <Select value={value} onChange={(e, val) => setValue(val)}>
                <Option value="Low-end">Low-end</Option>
                <Option value="Mid-range">Mid-range</Option>
                <Option value="High-end">High-end</Option>
              </Select>
            )}
          />

          {/* Estimated budget */}
          <EditableField
            label="Estimated budget"
            defaultValue="₱ 14,000.00"
            renderInput={(value, setValue) => (
              <Input value={value} onChange={(e) => setValue(e.target.value)} />
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

        {/* Footer buttons */}
        {/* <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" color="neutral">Cancel</Button>
        <Button variant="solid" color="primary">Next step</Button>
      </Box> */}

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
    const serverData = [
      { label: "Spec1", value: "Large" },
      { label: "Spec2", value: "Blue" },
      { label: "Spec3", value: "Cotton" },
    ];

    const [specs, setSpecs] = useState(
      serverData.map((item) => ({ ...item, current: item.value }))
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
      setSpecs([...specs, { label: "New spec", value: "", current: "" }]);
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
                          {spec.label}
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
    const [status, setStatus] = React.useState("");
    const [remarks, setRemarks] = React.useState("");
    const [pin, setPin] = React.useState("");

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
              return setStep(2);
            }}
          >
            "Confirm and Save"
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

export default ConsViewItemRequestedListModalContent;
