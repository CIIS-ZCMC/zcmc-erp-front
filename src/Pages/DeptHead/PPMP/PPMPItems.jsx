import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import {
  Checkbox,
  Divider,
  Link,
  Stack,
  Typography,
  Box,
  Select,
  selectClasses,
  Option,
} from "@mui/joy";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import { useNavigate } from "react-router-dom";
import { usePPMPItemsHook } from "../../../Hooks/PPMPItemsHook";
import usePPMPHook from "../../../Hooks/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import { expenseClassData } from "../../../Data/constants";
import { MdAdd, MdKeyboardArrowDown, MdOpenInNew } from "react-icons/md";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import { grey } from "@mui/material/colors";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import handleSingleChangeAutcomplete from "../../../Utils/HandleAutocomplete";
import handleInputValidation from "../../../Utils/HandleInput";
import PageLoader from "../../../Components/Loading/PageLoader";
import PPMPTable from "./PPMPTable";

function PPMPItems(props) {
  const navigate = useNavigate();
  const { description, setLoading, handleSelectActivity, handleSelectExpense } =
    usePPMPItemsHook();
  const { modes, activities, getProcModes, getActivities, postPPMP } =
    usePPMPHook();
  const {
    classification,
    categories,
    units,
    items,
    getItems,
    getItemCategories,
    getItemClassification,
    getItemUnits,
  } = useItemsHook();
  const {
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog,
  } = useModalHook();
  const { errors, setError, clearErrors } = userErrorInputHook();

  const [activity, setActivity] = useState({});
  const [expenseClass, setExpenseClass] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openReq, setOpenReq] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [itemReq, setItemReq] = useState({
    specs: [
      { id: Date.now(), value: "" },
      { id: Date.now() + 1, value: "" },
      { id: Date.now() + 2, value: "" },
    ],
  });

  const options = [
    {
      name: "Save as draft",
      value: "draft",
      action: () => handleSubmit(1),
    },
    {
      name: "Add item request",
      value: "add",
      action: () => {
        setActivity({});
        setExpenseClass({});
        setOpenReq(true);
      },
    },
  ];

  const addSpec = () => {
    setItemReq((prev) => ({
      ...prev,
      specs: [...prev.specs, { id: Date.now(), value: "" }],
    }));
  };

  const removeSpec = (id) => {
    setItemReq((prev) => ({
      ...prev,
      specs: prev.specs.filter((spec) => spec.id !== id),
    }));
  };

  const handleChange = (id, value) => {
    setItemReq((prev) => ({
      ...prev,
      specs: prev.specs.map((spec) =>
        spec.id === id ? { ...spec, value } : spec
      ),
    }));
  };

  const handleConfirmationModal = () => {
    const data = {
      status: "success",
      title:
        "Changes on PPMP are ready to be reflected to your AOP. Would you like to have a preview first before saving changes?",
      description:
        "Document previews will be generated and downloaded in Microsoft Excel Spreadsheet (.xls) file format. The document preview is for viewing purposes only to help you ensure that all fields are filled-up correctly and accurately.",
    };

    setConfirmationModal(data);
  };

  const handleSubmit = async (is_draft) => {
    if (pin === null && is_draft === 0) {
      setError("pin", true, "Please enter your authorization PIN.");
    } else {
      setPageLoader(true);

      const ppmp_items = JSON.parse(localStorage.getItem("ppmp-items")) || [];
      const formData = new FormData();
      formData.append("is_draft", is_draft);
      formData.append("PPMP_Items", JSON.stringify(ppmp_items));

      await postPPMP(formData, (status, message, data) => {
        //return data then save sa localstorage
        localStorage.setItem("ppmp-items", JSON.stringify(data.ppmp_items));
        setPageLoader(false);
        if (status === 201) {
          const data = {
            status: "success",
            title: "PPMP for F.Y. 2026 successfully submitted for approval.",
            description:
              "Your PPMP request has been sent to designated to the next approving body and notified them for approvals.",
          };

          setAlertDialog(data);
        } else {
          const data = {
            status: "error",
            title: message,
            description: message,
          };

          setAlertDialog(data);
        }
      });
    }
  };

  const handleNextStep = () => {
    console.log(itemReq);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // const handleDeleteRow = (id) => {
  //   // Optional: Show loading spinner
  //   setLoading(true);
  //   setTimeout(() => {
  //     const updated = tableData.filter((row) => row.id !== id);
  //     setLoading(false);
  //     setTableData(updated);
  //     localStorage.setItem("ppmp-items", JSON.stringify(updated));
  //   }, 1000);
  // };

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      // Step 2: Wrap callbacks in Promises for async/await
      const wrap = (fn) => new Promise((resolve) => fn(() => resolve()));

      try {
        // Step 3: Fetch all other needed data
        await Promise.all([
          wrap(getActivities),
          wrap(getItemClassification),
          wrap(getItemCategories),
          wrap(getItemUnits),
          wrap(getProcModes),
          wrap(getItems),
        ]);
      } catch (err) {
        console.error("Fetching error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <Fragment>
      <ContainerComponent
        title={"List of items"}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        sx={{ mt: 3 }}
        actions={
          <Stack direction={"row"} spacing={1}>
            <ButtonComponent
              label={"Add item"}
              color="success"
              variant={"outlined"}
              endDecorator={<BiPlus />}
              onClick={() => {
                setActivity({});
                setExpenseClass({});
                setOpenAdd(true);
              }}
            />
            <Select
              placeholder="More options"
              color="success"
              indicator={<MdKeyboardArrowDown />}
              sx={{
                width: "150px",
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            >
              {options.map((option, index) => (
                <Option
                  key={index}
                  value={option?.value}
                  onClick={option?.action}
                >
                  {option?.name}
                </Option>
              ))}
            </Select>

            <ButtonComponent
              label={"Save changes"}
              color="success"
              onClick={() => handleConfirmationModal()}
            />
          </Stack>
        }
      >
        <PPMPTable
          ppmpTable={tableData}
          items={items}
          setPPMPTable={setTableData}
          modes={modes.data}
          categories={categories}
          classifications={classification}
        />
      </ContainerComponent>

      {/* Add items to ppmp */}
      <ModalComponent
        isOpen={openAdd}
        handleClose={() => setOpenAdd(false)}
        title={"On what activity shall we assign the resources you’ll add?"}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        }
        minWidth={"380px"}
        maxWidth={"480px"}
        content={
          <Fragment>
            <Stack spacing={2}>
              <AutocompleteComponent
                label={"Select one activity"}
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
                  <Divider />
                </>
              )}

              <AutocompleteComponent
                label={"Select expense class"}
                helperText={
                  "Expense class determine the type of budget to be used for the items that are to be selected."
                }
                options={expenseClassData}
                value={expenseClass}
                setValue={setExpenseClass}
              />
            </Stack>
          </Fragment>
        }
        leftButtonLabel="Cancel"
        rightButtonLabel="Continue"
        rightButtonAction={() =>
          navigate(`/edit-ppmp/add-item/${expenseClass}`, {
            state: { activity },
          })
        }
        hasActionButtons
      />

      {/* Submit item request */}
      <ModalComponent
        isOpen={openReq}
        handleClose={() => setOpenReq(false)}
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
        minWidth={"400px"}
        maxWidth={"480px"}
        height={step === 1 ? "auto" : step === 2 ? "652px" : "680px"}
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
                      <Divider />
                    </>
                  )}

                  <AutocompleteComponent
                    label={"Select expense class"}
                    name="expense_class"
                    helperText={
                      "Expense class determine the type of budget to be used for the items that are to be selected."
                    }
                    options={expenseClassData}
                    getOptionLabel={(option) => option.label || ""}
                    value={expenseClass}
                    setValue={setExpenseClass}
                  />
                </Stack>
              )}
              {step === 2 && (
                <Stack spacing={2} mb={1}>
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
                  <TextareaComponent
                    label="Item name"
                    name="item_name"
                    helperText="Use a specific and descriptive naming convention for best results."
                    value={itemReq?.item_name}
                    onChange={(e) =>
                      handleInputValidation(e, setItemReq, setError)
                    }
                    size="sm"
                    minRows={3}
                  />
                  <Stack direction={"row"} gap={1} width="100%">
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
                    <InputComponent
                      label="Estimated budget"
                      name="estimated_budget"
                      size="sm"
                      value={itemReq?.estimated_budget}
                      handleInput={(e) => handleInputValidation(e, setItemReq)}
                      color="primary"
                    />
                  </Stack>
                  <AutocompleteComponent label="Variant" />

                  <Checkbox
                    label="I have conducted a market research prior setting the budget estimates."
                    sx={{ color: grey[600] }}
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
                    <Box height={"235px"} overflow="auto">
                      {itemReq?.specs?.map((spec, index) => (
                        <Box key={spec.id} sx={{ mb: 0.5 }}>
                          <Stack spacing={1}>
                            <TextareaComponent
                              label={`Specification ${index + 1}:`}
                              placeholder="e.g., Size: Large"
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
            handleSubmit(0);
          }
        }}
        hasActionButtons
      />
      <ConfirmationModalComponent
        leftButtonLabel="Back to editor"
        rightButtonLabel="Save changes"
        rightButtonAction={() => handleSubmit(0)}
        onClose={() => closeConfirmation()}
        withDivider={true}
        content={
          <>
            <Typography fontSize={12} sx={{ color: grey[600] }}>
              Available preview:
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography fontSize={13} py={2}>
                Project Procurement Management Plan - 2023-0031.xls
              </Typography>
              <Link
                endDecorator={<MdOpenInNew />}
                fontSize={12}
                underline="always"
                color="success"
              >
                Open preview
              </Link>
            </Stack>
          </>
        }
        withAuthPin={true}
        setAuthPin={setPin}
      />
      <AlertDialogComponent leftButtonAction={() => closeAlertDialog()} />
      <PageLoader isLoading={pageLoader} />
    </Fragment>
  );
}

export default PPMPItems;
