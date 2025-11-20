import React, { Fragment, useEffect, useState } from "react";
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
// import { useAOPApplication } from "../../../../Hooks/AOP/AOPApplicationsHook";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import useModalHook from "../../../../Hooks/ModalHook";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import AlertDialogComponent from "../../../../Components/Common/Dialog/AlertDialogComponent";
import { TEST_MODE } from "../../../../Services/Config";
import { APPROVAL_TIMELINE } from "../../../../Data/TestData";

const ProcessAOPContent = ({ aopId, timelineId, role }) => {
  // HOOKS

  const { isDivisionHead, isPlanning, isMCC } = useUserTypes();

  const { processAOP } = useApprovalActions();

  const {
    setAlertDialog,
    closeAlertDialog,
    alertDialogState: { status },
  } = useModalHook();
  const approvalTimeline = useApprovalTimeline();
  const { user } = useAuth();

  const timeline = approvalTimeline?.some(
    (item) => item.approver_user_id === user?.id && item.status === "approved"
  );

  // STATE
  const [remarks, setRemarks] = useState("");
  const [pin, setPin] = useState("");

  const [processData, setProcessData] = useState({ action: "approved" });
  const [disabledProcessRequest, setDisabledProcessRequest] = useState(true);

  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // FUNCTIONS
  const handleProcessRequest = () => {
    setOpenProcessModal(true);
  };

  const confirmButtonDisabled =
    !pin ||
    pin.length !== 6;
  // (role !== "Planning Unit" && (!remarks || remarks.trim() === "")) ||
  // remarks === null;

  const getNextOffice = () => {
    if (role === "Division Chief") {
      return "Planning Unit";
    } else if (role === "Planning Unit") {
      return "MCC";
    }
  };

  // PROCESS AOP
  const handleProcessAOP = () => {

    const payload = {
      application_timeline_id: timelineId,
      action: processData.action === 'approved' ? 4 : 6,
      remarks,
      authorization_pin: pin,
    }


    console.log(payload)

    processAOP(payload, (status, message) => {
      setBtnLoading(false);

      let data = {};

      if (status === 200) {
        data = {
          status: 200,
          isGlobal: false,
          title:
            processData.action === "returned"
              ? "The AOP request has been returned for revision"
              : "The AOP request successfully approved",
          description: isMCC
            ? `The AOP request has been successfully ${processData.action}. All parties involved will be notified of this update.`
            : processData.action === "returned"
              ? `The request has been returned to the requesting party for necessary revisions. They will be notified of your remarks and required changes.`
              : `Everyone can now see the changes you’ve made. The request is now ready for processing of the next approving body (${getNextOffice()}).`,
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
    })


    setBtnLoading(true);
  };

  const handleCloseConfirmation = () => {
    setOpenProcessModal(false);
    setDisabledProcessRequest(true);
    closeAlertDialog();
  };

  useEffect(() => {
    setDisabledProcessRequest(timeline);
  }, [timeline]);

  return (
    <Fragment>
      <ButtonComponent
        label={"Process request"}
        disabled={disabledProcessRequest ?? true}
        onClick={handleProcessRequest}
      />{" "}
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
          <>
            <Stack
              gap={(role === "Division Chief" && role !== "MCC") && 1}
            >
              <Stack
                py={role === "Planning" ? 2 : 1}
              >

                {(role === "Division Chief" || role === "Planning Unit") &&
                  <Box mb={2}>

                    <Typography level="title-sm" mb={1}>
                      Select the action you would like to take:
                    </Typography>

                    <RadioButtonComponent
                      disabled={btnLoading}
                      actions={approvalActions}
                      value={processData?.action}
                      handleChange={(e) => {

                        console.log(e.target.value)

                        handleChangeInput(
                          "action",
                          setProcessData,
                          e.target.value
                        )
                      }}
                    />
                  </Box>
                }

                {/* IF OMCC, AUTH PIN */}
                {role === "Division Chief" && role !== "MCC" ? (
                  <TextareaComponent
                    minRows={3}
                    label={"Remarks"}
                    isRequired
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value)
                    }}
                    maxRows={10}
                    placeholder={"Enter your remarks here"}
                  />
                ) : null}

              </Stack>

              {(role === "Division Chief" && role !== "MCC") && <Divider />}

              <InputComponent
                type="password"
                label="Authorization pin"
                helperText={
                  "Confirm you action by entering your 6-digit authorization PIN."
                }
                value={pin}
                setValue={setPin}
              />

            </Stack>
          </>
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
