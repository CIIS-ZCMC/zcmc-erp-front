import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../../../Store/AuthStore";
import { approvalActions } from "../../../../Data/constants";
import { handleChangeInput } from "../../../../Utils/HandleInput";
import { Box, Divider, Stack, Typography } from "@mui/joy";
import RadioButtonComponent from "../../../../Components/Common/RadioButtonComponent";
import TextareaComponent from "../../../../Components/Form/TextareaComponent";
import InputComponent from "../../../../Components/Form/InputComponent";
import {
  useApprovalActions,
  useApprovalTimeline,
} from "../../../../Hooks/AOP/AOPApprovalHook";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import useModalHook from "../../../../Hooks/ModalHook";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import AlertDialogComponent from "../../../../Components/Common/Dialog/AlertDialogComponent";
import {
  useAOPApplicationObjectives,
  useAOPPermissions,
  useTimelineID,
} from "../../../../Hooks/AOP/AOPApplicationsHook";

const ProcessAOPContent = ({
  label = "Process request",
  buttonSx,
  fullWidth = true,
}) => {
  // HOOKS
  const apiPermissions = useAOPPermissions();

  const isDivisionChief = apiPermissions?.is_division_chief;
  const isPlanningOfficer = apiPermissions?.is_planning;
  const isBudgetOfficer = apiPermissions?.is_budget_officer;
  const isMCCOfficer = apiPermissions?.is_mcc;
  const canProcess = apiPermissions?.can_approve;

  const AOPApplicationObjectives = useAOPApplicationObjectives();
  const { processApplication } = useApprovalActions();
  const {
    setAlertDialog,
    closeAlertDialog,
    alertDialogState: { status },
  } = useModalHook();
  const timeline_id = useTimelineID();

  const [processData, setProcessData] = useState({ action: "approved" });
  const [disabledProcessRequest, setDisabledProcessRequest] = useState(false);

  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // FUNCTIONS
  const handleProcessRequest = () => {
    // Add validation for planning users
    setOpenProcessModal(true);
  };

  const confirmButtonDisabled =
    !processData?.pin ||
    !processData?.action ||
    processData?.pin?.length !== 6 ||
    (isDivisionChief && (!processData?.remarks || processData?.remarks === ""));

  const getNextOffice = () => {
    if (isDivisionChief) {
      return "Planning Unit";
    } else if (isPlanningOfficer) {
      return "Budget Section";
    } else if (isBudgetOfficer) {
      return "MCC";
    }
  };

  // PROCESS AOP
  const handleProcessAOP = () => {
    setBtnLoading(true);
    const form = {
      application_timeline_id: timeline_id,
      action: processData?.action === "approved" ? 4 : 6,
      remarks: processData?.remarks ?? null,
      authorization_pin: processData?.pin,
    };

    processApplication(form, (status, message) => {
      setBtnLoading(false);

      let data = {};
      console.log(status);
      if (status === 200) {
        data = {
          status: 200,
          isGlobal: false,
          title:
            processData.action === "returned"
              ? "The AOP request has been returned for revision"
              : "The AOP request successfully approved",
          description: isMCCOfficer
            ? `The AOP request has been successfully ${processData.action}. All parties involved will be notified of this update.`
            : processData.action === "returned"
              ? `The request has been returned to the requesting party for necessary revisions. They will be notified of your remarks and required changes.`
              : `Everyone can now see the changes you’ve made. The request is now ready for processing of the next approving body (${getNextOffice()}).`, //CHECK THIS IT DISPLAYS UNDEFINED ONCE THE BUDGET AND MCC APPPROVES
        };
      } else {
        data = {
          status: "error",
          isGlobal: false,
          title: "Failed to approve application",
          description:
            message ??
            "An error occurred while updating the status of the AOP request. Please check your authorization PIN and try again. If the problem persists, contact the system administrator.",
        };
      }

      setAlertDialog(data);
    });
  };

  const handleCloseConfirmation = () => {
    setOpenProcessModal(false);
    setDisabledProcessRequest(true);
    closeAlertDialog();
  };

  useEffect(() => {
    setDisabledProcessRequest(!canProcess);
  }, [canProcess]);

  return (
    <Fragment>
      <ButtonComponent
        label={label}
        disabled={disabledProcessRequest}
        onClick={handleProcessRequest}
        fullWidth={fullWidth}
        sx={buttonSx}
      />
      {/* MODAL */}
      <ModalComponent
        hasActionButtons
        isOpen={openProcessModal}
        handleClose={() => setOpenProcessModal(false)}
        title={`Approve request`}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary." //  Change if user is not planning officer
        }
        leftButtonLabel="Back to request"
        rightButtonLabel="Confirm and save"
        rightButtonAction={handleProcessAOP}
        isLoading={btnLoading}
        rightButtonDisabled={confirmButtonDisabled}
        maxWidth={500}
        content={
          <Stack gap={isDivisionChief && 1}>
            <Stack py={isPlanningOfficer ? 2 : 1}>
              {!isMCCOfficer && (
                <Box mb={2}>
                  <Typography level="title-sm" mb={1}>
                    Select the action you would like to take:
                  </Typography>
                  <RadioButtonComponent
                    disabled={btnLoading}
                    actions={approvalActions}
                    value={processData?.action}
                    handleChange={(e) =>
                      handleChangeInput(
                        "action",
                        setProcessData,
                        e.target.value,
                      )
                    }
                  />
                </Box>
              )}

              {isDivisionChief ? (
                <TextareaComponent
                  minRows={3}
                  label={"Remarks"}
                  isRequired
                  onChange={(e) =>
                    handleChangeInput("remarks", setProcessData, e.target.value)
                  }
                  value={processData?.remarks}
                  maxRows={10}
                  placeholder={"Enter your remarks here"}
                />
              ) : null}
            </Stack>

            {/* IF OMCC, AUTH PIN */}

            {isDivisionChief && <Divider />}
            <InputComponent
              type="password"
              label="Authorization pin"
              helperText={
                "Confirm you action by entering your 6-digit authorization PIN."
              }
              handleInput={(e) =>
                handleChangeInput("pin", setProcessData, e.target.value)
              }
              value={processData?.pin}
              isRequired={true}
            />
          </Stack>
        }
      />
      <AlertDialogComponent
        leftButtonAction={
          status === 200 ? handleCloseConfirmation : closeAlertDialog
        }
      />
    </Fragment>
  );
};

export default ProcessAOPContent;
