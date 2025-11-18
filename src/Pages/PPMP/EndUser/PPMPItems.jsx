import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
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
  Sheet,
  Tabs,
  TabList,
  Tab,
  ListItemDecorator,
  TabPanel,
  AspectRatio,
} from "@mui/joy";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import { useLocation, useNavigate } from "react-router-dom";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import { MdAdd, MdKeyboardArrowDown, MdOpenInNew } from "react-icons/md";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import { blue, grey, orange } from "@mui/material/colors";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import handleSingleChangeAutcomplete from "../../../Utils/HandleAutocomplete";
import { handleInputValidation } from "../../../Utils/HandleInput";
import PPMPTable from "./PPMPTable";
import { InfoIcon, PlusIcon } from "lucide-react";
import { useAuth } from "../../../Store/AuthStore";
import { socket } from "../../../Services/Socket";
import { usePPMPTotalStore } from "../../../Hooks/PPMP/PPMPItemsHook";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import CollapsibleTable from "./CollapsibleTable";
import { PPMP_HEADERS } from "../../../Data/Columns";
import {
  DocumentScannerOutlined,
  ExtensionOutlined,
  TextSnippetOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import ProcurementSchedule from "./ProcurementSchedule";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    modes,
    // is_draft,
    ppmp,
    activities,
    getPPMPItems,
    getProcModes,
    getActivities,
    postPPMP,
    postItemRequest,
    exportPPMP,
    updatePPMP,
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
  const ppmpTotal = usePPMPTotalStore((state) => state.ppmpTotal);

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
  const [editingRows, setEditingRows] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const updatedRowData = React.useRef({});

  const location = useLocation();
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

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

  const handleEditToggle = async (rowId) => {
    const isEditing = editingRows[rowId];

    if (isEditing) {
      // Save data
      const getDataFunc = updatedRowData.current[rowId];
      if (!getDataFunc) return;

      const updatedData = getDataFunc();

      try {
        updatePPMP(rowId, updatedData, (status, message) => {
          if (status === 200) {
            console.log("PPMP item updated successfully:", message);
          } else {
            console.error("Failed to update purchase type:", message);
          }
        });
      } catch (err) {
        console.error("Save error:", err);
      }
    }

    // Toggle edit state
    setEditingRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
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
    setPageLoader(true);
    getPPMPItems((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
      setPageLoader(false);
    });
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
    socket.connect(); // Connect every time component mounts
    socket.emit("authenticate", { id: id, area: assignedArea?.name });

    socket.on("editing", handleEditing);

    return () => {
      socket.off("editing");
      // socket.disconnect();
    };
  }, []);

  return (
    <Fragment>
      <PageTitle
        title={`PPMP for Fiscal Year ${currentFiscalYear}`}
        description={""}
        items={[
          {
            label: "PPMP",
            current: true,
          },
        ]}
      />
      {pageLoader ? (
        <Stack height="70vh" alignItems="center" justifyContent="center">
          <ThreeDotsLoader />
        </Stack>
      ) : (
        <>
          <BoxComponent my={2} bgColor={"#FAFAF9"} boxShadow="xs" p={2}>
            <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
              <Stack>
                <Stack direction={"row"} gap={1}>
                  <Typography level="body-md" sx={{ fontWeight: 600 }}>
                    Manage Resources for{" "}
                  </Typography>
                  <ChipComponent
                    label={`PPMP Fiscal Year ${currentFiscalYear}`} // change to dynamic activity name
                    color={"success"}
                    variant={"outlined"}
                    fontSize={12}
                    size={"sm"}
                  />
                </Stack>
                <Typography level="body-xs">
                  The below contains a list of resources synced from your
                  submitted AOP request. Click a row to expand and view more
                  details.
                </Typography>
              </Stack>
              <ButtonComponent
                label={"Add an Item"}
                startDecorator={<PlusIcon />}
                onClick={() => navigate("/ppmp/add-item")}
              />
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <SearchWithSuggestions />
            </Stack>
          </BoxComponent>
          <CollapsibleTable
            columns={PPMP_HEADERS(editingRows)}
            rows={ppmp}
            editingRows={editingRows}
            onEditToggle={handleEditToggle}
            onGetUpdatedData={(rowId, getDataFunc) => {
              updatedRowData.current[rowId] = getDataFunc;
            }}
          />
        </>
      )}

      {/* Submit item request */}

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
