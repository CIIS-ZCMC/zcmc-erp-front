import React, { Fragment, useState } from "react";
import { useAuth, useUserTypes } from "../../../../Store/AuthStore";
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
import { useAOPApplication } from "../../../../Hooks/AOP/AOPApplicationsHook";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import useModalHook from "../../../../Hooks/ModalHook";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import AlertDialogComponent from "../../../../Components/Common/Dialog/AlertDialogComponent";
import { TEST_MODE } from "../../../../Services/Config";
import { APPROVAL_TIMELINE } from "../../../../Data/TestData";

const ProcessAOPContent = () => {
  // HOOKS
  const { isDivisionHead, isPlanning } = useUserTypes();
  const aopApplication = useAOPApplication();
  const { status: applicationStatus } = aopApplication || {};
  const { processAOP } = useApprovalActions();
  const { setAlertDialog, closeAlertDialog } = useModalHook();
  const approvalTimeline = useApprovalTimeline();
  const { user } = useAuth();

  const timeline = TEST_MODE ? APPROVAL_TIMELINE : approvalTimeline;

  // STATE
  const [processData, setProcessData] = useState({ action: "approved" });
  const [disabledProcessRequest, setDisabledProcessRequest] = useState(
    timeline?.some(
      (item) => item.approver_user_id === user?.id && item.status === "approved"
    )
  );

  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // FUNCTIONS
  const handleProcessRequest = () => {
    setOpenProcessModal(true);
  };

  const confirmButtonDisabled =
    !processData?.pin || !processData?.action || processData?.pin?.length !== 6;

  // PROCESS AOP
  const handleProcessAOP = () => {
    setBtnLoading(true);
    const form = {
      aop_application_id: AOP_APPLICATION_ID,
      status: processData?.action,
      remarks: processData?.remarks,
      authorization_pin: processData?.pin,
    };

    processAOP(form, (status, message) => {
      setBtnLoading(false);

      let data = {};

      if (status === 200) {
        data = {
          status: 200,
          isGlobal: false,
          title: "AOP request for F.Y. “2026” successfully approved.",
          description:
            "Everyone can now see the changes you’ve made. The request is now ready for processing of the next approving body (Division Chief).",
        };
      } else {
        data = {
          status: "error",
          isGlobal: false,
          title: "Failed to update status",
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

  return (
    <Fragment>
      <ButtonComponent
        label={"Process request"}
        disabled={disabledProcessRequest}
        onClick={handleProcessRequest}
      />

      {/* MODAL */}
      <ModalComponent
        hasActionButtons
        isOpen={openProcessModal}
        handleClose={() => setOpenProcessModal(false)}
        title={`Process request `}
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
          <Stack gap={2}>
            <Stack py={isPlanning ? 2 : 1}>
              {isPlanning && (
                <Box mb={2}>
                  <Typography level="title-sm" mb={1}>
                    Select the action you would like to take:
                  </Typography>
                  <RadioButtonComponent
                    actions={approvalActions}
                    value={processData?.action}
                    handleChange={(e) =>
                      handleChangeInput(
                        "action",
                        setProcessData,
                        e.target.value
                      )
                    }
                  />
                </Box>
              )}

              {/* IF OMCC, AUTH PIN */}
              {isPlanning || !isDivisionHead ? (
                <TextareaComponent
                  minRows={3}
                  label={"Remarks"}
                  setValue={(e) =>
                    handleChangeInput("remarks", setProcessData, e.target.value)
                  }
                  value={processData?.remarks}
                  maxRows={10}
                  placeholder={"Enter your remarks here"}
                />
              ) : null}
            </Stack>

            {!isDivisionHead && <Divider />}
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
            />
          </Stack>
        }
      />

      <AlertDialogComponent leftButtonAction={handleCloseConfirmation} />
    </Fragment>
  );
};

export default ProcessAOPContent;
