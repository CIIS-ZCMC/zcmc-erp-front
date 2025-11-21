import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { Stack, Typography, Snackbar, Alert } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import { InfoIcon, PlusIcon } from "lucide-react";
import { useAuth } from "../../../Store/AuthStore";
import { socket } from "../../../Services/Socket";
import { usePPMPTotalStore } from "../../../Hooks/PPMP/PPMPItemsHook";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import CollapsibleTable from "./CollapsibleTable";
import { PPMP_HEADERS } from "../../../Data/Columns";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import useSnackbarHook from "../../../Hooks/SnackbarHook";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    modes,
    ppmp_id,
    ppmp,
    ppmp_total,
    pagination,
    getPPMPItems,
    postPPMP,
    postItemRequest,
    exportPPMP,
    updatePPMP,
    removeActivity,
    removeItem,
  } = usePPMPHook();
  const {
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog,
  } = useModalHook();
  const { errors, setError, clearErrors } = userErrorInputHook();
  const { showSnack } = useSnackbarHook();
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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const updatedRowData = React.useRef({});

  const location = useLocation();
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  // const { is_draft } = location.state || {};

  // Filter results when search changes
  const filteredPPMPItems = useMemo(() => {
    if (!search) return ppmp;
    return ppmp?.filter((item) =>
      item.item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, ppmp]);

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

  const handleEditToggle = async (rowId, onToggle, isSaveClick) => {
    const isEditing = editingRows[rowId];

    if (isEditing && !isSaveClick) {
      return;
    }
    if (isEditing && isSaveClick) {
      const getDataFunc = updatedRowData.current[rowId];
      if (!getDataFunc) return;

      const updatedData = getDataFunc();

      try {
        updatePPMP(rowId, updatedData, (status, message) => {
          if (status === 200) {
            showSnack(200, message);

            // collapse row only on success
            onToggle(false);

            setEditingRows((prev) => ({
              ...prev,
              [rowId]: false,
            }));
          } else {
            setAlertDialog({
              status: "danger",
              title: "Failed to save.",
              isGlobal: false,
              description: message,
            });
            // do nothing — keep row open
          }
        });
      } catch (err) {
        setAlertDialog({
          status: "danger",
          title: "Save error.",
          isGlobal: false,
          description: err,
        });
        // do nothing — keep row open
      }
      return;
    }
    // Enter edit mode
    setEditingRows((prev) => ({
      ...prev,
      [rowId]: true,
    }));
    // Force open row when entering edit
    onToggle(true);
  };

  const handleDeleteItem = async (id) => {
    await removeItem(id, (status, message) => {
      // setLoading(false);

      if (status === 200) {
        console.log("✅ Resource updated successfully:", message);
      } else {
        console.error("❌ Failed to update resource:", message);
      }
    });
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
    getPPMPItems(
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
        setPageLoader(false);
      },
      page,
      perPage
    );
  }, [page, perPage]);

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
      {console.log(ppmp)}
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
              <Stack spacing={1}>
                <Stack direction={"row"} gap={1.5}>
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
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <SearchBarComponentv2
                value={search}
                setValue={setSearch}
                placeholder="Search resources..."
                fullWidth
              />
              <BoxComponent px={2} py={0.5} bgColor={"white"} borderRadius={10}>
                <Typography
                  textTransform={"uppercase"}
                  level="body-xs"
                  color="primary"
                  textAlign={"right"}
                >
                  Total Cost
                </Typography>
                <Typography
                  textTransform={"uppercase"}
                  level="body-lg"
                  color="primary"
                  textAlign={"right"}
                  fontWeight={600}
                >
                  &#8369;{" "}
                  {ppmp_total.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </BoxComponent>
            </Stack>
          </BoxComponent>
          <CollapsibleTable
            columns={PPMP_HEADERS(editingRows)}
            rows={filteredPPMPItems}
            editingRows={editingRows}
            onEditToggle={handleEditToggle}
            onGetUpdatedData={(rowId, getDataFunc) => {
              updatedRowData.current[rowId] = getDataFunc;
            }}
            onRemoveActivity={removeActivity}
            ppmpId={ppmp_id}
            currentPage={pagination?.current_page}
            totalPages={pagination?.last_page}
            totalRows={pagination?.total}
            onNextPage={() => {
              if (page < pagination?.last_page) setPage(page + 1);
            }}
            onPrevPage={() => {
              if (page > 1) setPage(page - 1);
            }}
            onDeletePPMP={handleDeleteItem}
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
