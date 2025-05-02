import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import ScrollableEditableTableComponent from "../../../Components/Common/Table/ScrollableEditableTable";
import { ppmpHeaders } from "../../../Data/Columns";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePPMPItemsHook } from "../../../Hooks/PPMPItemsHook";
import { descriptionsData, procurement_mode } from "../../../Data/dummy";
import usePPMPHook from "../../../Hooks/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import { expenseClassData } from "../../../Data/constants";
import { IoArrowDownOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdOpenInNew } from "react-icons/md";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import { grey } from "@mui/material/colors";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";

const options = ["Save as draft"];

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    tableData,
    loading,
    activityObject,
    activity,
    activityId,
    description,
    expenseClass,
    setTableData,
    setItemsData,
    setLoading,
    handleFieldChange,
    handleDeleteRow,
    handleSelectActivity,
    handleSelectExpense,
  } = usePPMPItemsHook();
  const {
    ppmp,
    modes,
    activities,
    getPPMPItems,
    getProcModes,
    getActivities,
    postPPMP,
  } = usePPMPHook();
  const { items, getItems } = useItemsHook();
  const {
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog,
  } = useModalHook();
  const { errors, setError, clearErrors } = userErrorInputHook();

  const [openAdd, setOpenAdd] = useState(false);
  const [openReq, setOpenReq] = useState(false);
  const [open, setOpen] = useState(false);
  const actionRef = React.useRef(null);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [pin, setPin] = useState(null);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
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
    if (pin === null) {
      setError("pin", true, "Please enter your authorization PIN.");
    } else {
      const formData = new FormData();
      formData.append("is_draft", is_draft);
      formData.append("PPMP_Items", JSON.stringify(tableData));

      await postPPMP(formData, (status, message, data) => {
        if (status === 201 || (status >= 200 && status < 300)) {
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

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        await Promise.all([
          new Promise((resolve) =>
            getPPMPItems((status, message, data) => resolve())
          ),
          new Promise((resolve) =>
            getItems((status, message, data) => resolve())
          ),
          new Promise((resolve) =>
            getProcModes((status, message, data) => resolve())
          ),
          new Promise((resolve) =>
            getActivities((status, message, data) => resolve())
          ),
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (ppmp?.ppmp_items?.length && tableData.length === 0) {
        setTableData(ppmp.ppmp_items);
      }
    }
  }, [loading, ppmp]);

  useEffect(() => {
    if (!loading && items?.length) {
      setItemsData(items);
    }
  }, [loading, items]);
  // useEffect(() => {
  //   if (tableData.length === 0) {
  //     setTableData(sampleData);
  //   }
  // }, [ppmp]);
  useEffect(() => {
    if (anchorRef.current) {
      console.log("Anchor Element:", anchorRef.current);
      anchorRef.current.style.border = "1px solid red"; // temp highlight
    }
  }, []);
  return (
    <Fragment>
      {console.log(items)}
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
              onClick={() => setOpenAdd(true)}
            />
            <ButtonComponent
              label={"Add item request"}
              color="success"
              variant={"outlined"}
              endDecorator={<BiPlus />}
              onClick={() => setOpenReq(true)}
            />
            <ButtonComponent
              label={"Save changes"}
              color="success"
              onClick={() => handleConfirmationModal()}
            />
          </Stack>
        }
      >
        <ScrollableEditableTableComponent
          columns={ppmpHeaders(handleDeleteRow, items, modes)}
          data={tableData}
          onFieldChange={handleFieldChange}
          isLoading={loading}
          options={descriptionsData}
          setData={setTableData}
          stripe={"even"}
          pageSize={10}
          stickLast
          stickSecond
        />
      </ContainerComponent>

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
                handleSelect={handleSelectActivity}
                value={activityObject}
                size="sm"
              />
              {description !== "" && (
                <>
                  <Divider />
                  <Typography sx={{ fontSize: 12, color: "gray" }}>
                    Description of selected activity
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>{description}</Typography>
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
                handleSelect={handleSelectExpense}
              />
            </Stack>
          </Fragment>
        }
        leftButtonLabel="Cancel"
        rightButtonLabel="Continue"
        rightButtonAction={() =>
          navigate(`/edit-ppmp/add-item/${expenseClass}`, {
            state: { activityObject },
          })
        }
        hasActionButtons
      />
      <ModalComponent
        isOpen={openReq}
        handleClose={() => setOpenReq(false)}
        title={"On what activity shall we assign the resources you’ll add?"}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        }
        minWidth={"380px"}
        maxWidth={"480px"}
        withProgress={true}
        content={
          <Fragment>
            <Stack spacing={2}>
              <AutocompleteComponent
                label={"Select one activity"}
                options={activities}
                getOptionLabel={(option) => option.activity_code || ""}
                handleSelect={handleSelectActivity}
                value={activityObject}
                size="sm"
              />
              {description !== "" && (
                <>
                  <Divider />
                  <Typography sx={{ fontSize: 12, color: "gray" }}>
                    Description of selected activity
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>{description}</Typography>
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
                handleSelect={handleSelectExpense}
              />
            </Stack>
          </Fragment>
        }
        leftButtonLabel="Cancel"
        rightButtonLabel="Continue"
        rightButtonAction={() =>
          navigate(`/edit-ppmp/add-item/${expenseClass}`, {
            state: { activityObject },
          })
        }
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
    </Fragment>
  );
}

export default PPMPItems;
