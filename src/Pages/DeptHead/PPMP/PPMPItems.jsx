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
  Snackbar,
  Alert,
} from "@mui/joy";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import { useLocation, useNavigate } from "react-router-dom";
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
import { handleInputValidation } from "../../../Utils/HandleInput";
import PageLoader from "../../../Components/Loading/PageLoader";
import PPMPTable from "./PPMPTable";
import ConfirmationModal from "../../../Components/Common/Dialog/ConfirmationModal";
import { InfoIcon } from "lucide-react";
import { useAuth } from "../../../Store/AuthStore";
import { socket } from "../../../Services/Socket";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    modes,
    // is_draft,
    activities,
    getPPMPItems,
    getProcModes,
    getActivities,
    postPPMP,
    postItemRequest,
    exportPPMP,
  } = usePPMPHook();
  const {
    classification,
    categories,
    units,
    items,
    variants,
    getItems,
    getItemCategories,
    getItemClassification,
    getItemUnits,
    getVariants,
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
  const [openSave, setOpenSave] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openReq, setOpenReq] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [dlLoader, setDlLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [editLoad, setEditLoad] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [step, setStep] = useState(1);
  const [openNotify, setOpenNotify] = useState(false);
  const [pin, setPin] = useState("");
  const [editor, setEditor] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [is_draft, setIsDraft] = useState(1);
  const [itemReq, setItemReq] = useState({
    specs: [
      { id: Date.now(), value: "" },
      { id: Date.now() + 1, value: "" },
      { id: Date.now() + 2, value: "" },
    ],
  });

  const location = useLocation();
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};

  // const { is_draft } = location.state || {};

  //SNACKBAR
  const notify = () => setOpenNotify(true);
  const handleCloseSnack = () => {
    setEditor(null);
    setOpenNotify(false);
  };

  const editSignal = () => {
    socket.emit("start-edit", {
      userId: id,
      name: name,
      area: assignedArea?.name,
    });
  };

  const disconnectSignal = () => {
    socket.emit("stop-edit", {
      userId: id,
      area: assignedArea?.name,
    });
    setShow(false);
    handleCloseSnack();
  };

  const handleEditing = ({ editable, showEdit, editorName, editorId }) => {
    setDisabled(!editable);
    setShow(showEdit);
    setOpenNotify(editable ? false : true);
    setEditor(() => {
      return { editorName: editorName, editorId: editorId };
    });

    if (!editable) {
      return notify();
    }
  };

  const handleEditClick = () => {
    setEditLoad(true);
    setTimeout(() => {
      editSignal();
      setShow(true);
      setEditLoad(false);
    }, 500);
  };

  const specsContainerRef = useRef(null);

  const addSpec = () => {
    setItemReq((prev) => {
      const newSpecs = [...prev.specs, { id: Date.now(), value: "" }];

      // Allow the DOM to update before scrolling
      setTimeout(() => {
        if (specsContainerRef.current) {
          specsContainerRef.current.lastElementChild?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, 100);

      return {
        ...prev,
        specs: newSpecs,
      };
    });
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

  //CONFIRMATION MODAL
  const handleConfirmationModal = () => {
    setOpenDel(false);
    setOpenSave(true);
    const data = {
      status: "success",
      title:
        "Changes on PPMP are ready to be reflected to your AOP. Would you like to proceed with the changes?",
      description:
        "After submission, a document preview will be available and can be downloaded in Microsoft Excel Spreadsheet (.xls) file format. Please input your authorization pin to proceed with the submission.",
    };

    setConfirmationModal(data);
  };

  //SAVE CHANGES
  const handleSubmit = async (is_draft) => {
    if (pin === "" && is_draft === 0) {
      setAlertDialog({
        status: "error",
        title: "Missing Authorization PIN",
        description: "Please enter your authorization PIN before submitting.",
      });
      return;
    }

    setButtonLoader(true);

    try {
      const ppmp_items = JSON.parse(localStorage.getItem("ppmp-items")) || [];
      const formData = new FormData();
      if (is_draft === 0) {
        formData.append("pin", pin);
      }
      formData.append("is_draft", is_draft);
      formData.append("PPMP_Items", JSON.stringify(ppmp_items));

      const result = await new Promise((resolve) => {
        postPPMP(formData, (status, message, data) =>
          resolve({ status, message, data })
        );
      });

      const { status, message, data } = result;

      const alertData =
        status === 201
          ? {
              status: "success",
              title: is_draft
                ? "Saved as draft"
                : "PPMP for F.Y. 2026 successfully submitted for approval.",
              description: is_draft
                ? "Your PPMP request has been save as draft. You can continue editing it later or submit it for approval."
                : "Your PPMP request has been sent to the next approving body and they have been notified for approvals.",
            }
          : {
              status: "error",
              title: message,
              description: message,
            };

      setAlertDialog(alertData);

      if (status === 201) {
        localStorage.setItem("ppmp-items", JSON.stringify(data.ppmp_items));
        setIsDraft(data.is_draft);
        localStorage.setItem("is_draft", JSON.stringify(data.is_draft));
        closeConfirmation();
        setOpenSave(false);
        disconnectSignal();
        handleCloseSnack();
      }
    } catch (error) {
      setAlertDialog({
        status: "error",
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setButtonLoader(false);
    }
  };

  //SUBMIT ADD ITEM REQUEST
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

  const handleNavigate = () => {
    clearErrors();
    let hasError = false;
    if (isEmptyObject(activity)) {
      setError("activity", true, "Please select an option");
      hasError = true;
    }
    if (hasError) return;

    navigate("/edit-ppmp/add-item", {
      state: { activity },
    });
  };

  const isEmptyObject = (obj) =>
    obj && typeof obj === "object" && Object.keys(obj).length === 0;

  const handleNextStep = () => {
    clearErrors();
    let hasError = false;
    if (step === 1) {
      if (isEmptyObject(activity)) {
        setError("activity", true, "Please select an option");
        hasError = true;
      }

      if (hasError) return;
    }
    if (step === 2) {
      let hasError = false;
      if (!itemReq.classification) {
        setError("classification", true, "Please select a classification");
        hasError = true;
      }
      if (!itemReq.category) {
        setError("category", true, "Please select a category");
        hasError = true;
      }
      if (!itemReq?.item_name || itemReq.item_name.trim() === "") {
        setError("item_name", true, "Item name is required");
        hasError = true;
      }
      if (!itemReq.unit) {
        setError("unit", true, "Please select a unit of measure");
        hasError = true;
      }
      if (!itemReq?.estimated_budget || isNaN(itemReq.estimated_budget)) {
        setError("estimated_budget", true, "Please enter a valid budget");
        hasError = true;
      }
      if (!itemReq.variant) {
        setError("variant", true, "Please select a variant");
        hasError = true;
      }

      if (hasError) return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleClose = () => {
    close;
    closeAlertDialog();
    setOpenReq(false);
    setItemReq({});
    setActivity({});
    setExpenseClass({});
    setPin("");
  };

  const exportToCSV = () => {
    setDlLoader(true);
    exportPPMP({ export: true }, (status, message) => {
      if (status === 200) {
        setDlLoader(false);
        setAlertDialog({
          status: "success",
          title: "PPMP Downloaded",
          description: "Your PPMP has been successfully downloaded.",
        });
      } else {
        setDlLoader(false);
        setAlertDialog({
          status: "error",
          title: "PPMP Download failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  useEffect(() => {
    async function fetchAll() {
      // Step 2: Wrap callbacks in Promises for async/await
      const wrap = (fn) => new Promise((resolve) => fn(() => resolve()));

      try {
        setPageLoader(true);
        const localData = localStorage.getItem("ppmp-items");
        if (!localData) {
          await wrap(getPPMPItems); // ✅ await here
          setReloadFlag((prev) => !prev);
        }

        // Fetch is_draft after localStorage is updated
        const updatedIsDraft =
          JSON.parse(localStorage.getItem("is_draft")) || 0;
        setIsDraft(updatedIsDraft);
        // Step 3: Fetch all other needed data
        await Promise.all([
          wrap(getActivities),
          wrap(getItemClassification),
          wrap(getItemCategories),
          wrap(getItemUnits),
          wrap(getProcModes),
          wrap(getItems),
          wrap(getVariants),
        ]);
      } catch (err) {
        console.error("Fetching error:", err);
      } finally {
        setPageLoader(false);
      }
    }

    fetchAll();
  }, []);

  useEffect(() => {
    if (!assignedArea?.name) return;

    socket.emit("register-user", {
      userId: id,
      name: name,
      area: assignedArea.name,
    });
  }, [assignedArea]);

  useEffect(() => {
    socket.on("editing", handleEditing);
    return () => {
      socket.off("editing"); // Clean up on unmount
    };
  }, [socket]);

  // AUTHENTICATE
  useEffect(() => {
    socket.emit("authenticate", {
      id: id,
      area: assignedArea?.name,
    });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, []);

  return (
    <Fragment>
      {console.log("editor", is_draft)}
      <ContainerComponent
        title={"List of items"}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        sx={{ mt: 3 }}
        actions={
          <Stack direction={"row"} spacing={1}>
            <ButtonComponent
              label={"Add Item Request"}
              color="primary"
              variant={"outlined"}
              endDecorator={<BiPlus />}
              onClick={() => {
                setActivity({});
                setExpenseClass({});
                setOpenReq(true);
              }}
            />
            <ButtonComponent
              label="Export PPMP"
              onClick={() => exportToCSV()}
              isLoading={dlLoader}
              loadingLabel={"Exporting..."}
              variant="outlined"
              disabled={is_draft === 1}
            />
            {is_draft === 1 && (
              <ButtonComponent
                label={show ? "Exit Edit Mode" : "Edit PPMP"}
                onClick={() => (show ? disconnectSignal() : handleEditClick())}
                isLoading={editLoad}
                color={show ? "danger" : "primary"}
                disabled={disabled}
              />
            )}

            {/* {show && (
              <ButtonComponent
                label={"Exit Edit Mode"}
                onClick={() => disconnectSignal()}
                color="danger"
              />
            )} */}
          </Stack>
        }
      >
        {is_draft === 1 && (
          <>
            <Stack mb={2} direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={1}>
                <InfoIcon size={20} style={{ color: "primary" }} />
                <Typography fontSize={14} color="primary">
                  This is for viewing only. Click the <b>"Edit PPMP"</b> button
                  to update your PPMP.
                </Typography>
              </Stack>
              <Stack direction="row" gap={1}>
                <ButtonComponent
                  label="Add Item"
                  variant="outlined"
                  disabled={!show}
                  endDecorator={<BiPlus />}
                  onClick={() => {
                    setActivity({});
                    setExpenseClass({});
                    setOpenAdd(true);
                  }}
                />
                <ButtonComponent
                  label="Save as draft"
                  onClick={() => handleSubmit(1)}
                  disabled={!show}
                  isLoading={buttonLoader}
                  loadingLabel={"Saving..."}
                />
                <ButtonComponent
                  label="Submit PPMP"
                  disabled={!show || is_draft === 0}
                  onClick={() => handleConfirmationModal()}
                />
              </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        <PPMPTable
          ppmpTable={tableData}
          items={items}
          setPPMPTable={setTableData}
          modes={modes.data}
          categories={categories}
          classifications={classification}
          openDel={openDel}
          setOpenDel={setOpenDel}
          setOpensave={setOpenSave}
          setSelectedID={setSelectedID}
          id={selectedID}
          loading={pageLoader}
          setLoading={setPageLoader}
          isEditing={show}
          setIsEditing={setShow}
          reloadFlag={reloadFlag}
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
                label={"Select an activity"}
                name={"activity"}
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

              {/* <AutocompleteComponent
                label={"Select expense class"}
                helperText={
                  "Expense class determine the type of budget to be used for the items that are to be selected."
                }
                name={"expenseClass"}
                options={expenseClassData}
                getOptionLabel={(option) => option?.label || ""}
                value={expenseClass}
                setValue={setExpenseClass}
              /> */}
            </Stack>
          </Fragment>
        }
        leftButtonLabel="Cancel"
        rightButtonLabel="Continue"
        rightButtonAction={() => handleNavigate()}
        hasActionButtons
      />

      {/* Submit item request */}
      <ModalComponent
        isOpen={openReq}
        handleClose={() => {
          setOpenReq(false);
        }}
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
                    </>
                  )}
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
      {openSave && (
        <ConfirmationModalComponent
          leftButtonLabel="Back to editor"
          rightButtonLabel="Save changes"
          rightButtonAction={() => handleSubmit(0)}
          leftButtonAction={() => {
            setOpenSave(false);
            closeConfirmation();
          }}
          isLoading={buttonLoader}
          setAuthPin={setPin}
          withAuthPin={true}
        />
      )}

      <AlertDialogComponent leftButtonAction={() => handleClose()} />
      <Snackbar
        open={openNotify}
        // autoHideDuration={2000}
        onClose={handleCloseSnack}
        color="success"
      >
        <Alert
          onClose={handleCloseSnack}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {editor?.editorName} is currently editing
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default PPMPItems;
