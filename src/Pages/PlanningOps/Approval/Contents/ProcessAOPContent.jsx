import React, { Fragment, useEffect, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import RadioButtonComponent from "../../../../Components/Common/RadioButtonComponent";
import TextareaComponent from "../../../../Components/Form/TextareaComponent";
import InputComponent from "../../../../Components/Form/InputComponent";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import AlertDialogComponent from "../../../../Components/Common/Dialog/AlertDialogComponent";

import {
  useApprovalActions,
  useApprovalTimeline,
} from "../../../../Hooks/AOP/AOPApprovalHook";
import useModalHook from "../../../../Hooks/ModalHook";

// import { useAOPApplication } from "../../../../Hooks/AOP/AOPApplicationsHook";

import { approvalActions, PROCESS_AOP, } from "../../../../Data/constants";
import { handleChangeInput } from "../../../../Utils/HandleInput";
import { localStorageGetter } from "../../../../Utils/LocalStorage";

const ProcessAOPContent = ({ aopId, timelineId, role, processable }) => {
  // HOOKS

  const {
    RETURN_AOP,
    SUCCESS_AOP,
    APPROVED_AOP,
    MCC_APPROVED_AOP,
    RETURNED_AOP,
    ERROR,
    SELECT_ACTION_LABEL,
    MODAL_TITLE,
    MODAL_DESCRIPTION,
    INPUT_HELPER,

  } = PROCESS_AOP;

  const navigate = useNavigate()

  const hasRole = (userRole) => role === userRole;

  const userPlanning = hasRole('Planning Unit');
  const userDiviChief = hasRole('Division Chief');
  const userMCC = hasRole('MCC');

  const { processPPMP } = useApprovalActions();

  const {
    setAlertDialog,
    closeAlertDialog,
    alertDialogState: { status },
  } = useModalHook();

  const approvalTimeline = useApprovalTimeline();

  const timeline = approvalTimeline?.some(
    (item) => item.approver_user_id === user?.id && item.status === "approved"
  );

  // STATE
  const [remarks, setRemarks] = useState("");
  const [pin, setPin] = useState("");

  const [processData, setProcessData] = useState({ action: "approved" });
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
    if (userDiviChief) {
      return 'Planning Unit';
    } else if (userPlanning) {
      return 'MCC';
    }
  };

  // PROCESS AOP
  const handleProcessAOP = () => {

    const payload = {
      ppmp_application_timeline_id: timelineId,
      action: processData.action === 'approved' ? 4 : 6,
      remarks,
      authorization_pin: pin,
    }

    processPPMP(payload, (status, message) => {
      setBtnLoading(false);

      let data = {};

      if (status === 200) {
        data = {
          status: processData.action === "returned" ? 404 : 200,
          isGlobal: false,
          title:
            processData.action === "returned"
              ? RETURN_AOP
              : SUCCESS_AOP,
          description: userMCC
            ? MCC_APPROVED_AOP
            : processData.action === "returned"
              ? RETURNED_AOP
              : `${APPROVED_AOP} (${getNextOffice()}).`,
        };
      } else {
        data = {
          status: "error",
          isGlobal: false,
          title: "Failed to update status",
          description:
            message ?? ERROR,
        };
      }
      setAlertDialog(data);
    })

    setBtnLoading(true);
  };

  const handleCloseConfirmation = () => {

    setBtnLoading(true)
    setOpenProcessModal(false);
    // setDisabledProcessRequest(true);
    setTimeout(() => {
      navigate('/aop-approval')
      closeAlertDialog()
      setBtnLoading(false);
    }, 2000)

  };

  useEffect(() => {
    // setDisabledProcessRequest(timeline);
  }, [timeline]);

  return (
    <Fragment>

      <ButtonComponent
        label={"Process request"}
        disabled={!processable}
        onClick={handleProcessRequest}
      />

      {/* MODAL */}
      <ModalComponent
        hasActionButtons
        isOpen={openProcessModal}
        handleClose={() => setOpenProcessModal(false)}
        title={MODAL_TITLE}
        description={MODAL_DESCRIPTION}//  Change if user is not planning officer
        leftButtonLabel="Back to request"
        rightButtonLabel="Confirm and save"
        rightButtonAction={handleProcessAOP}
        isLoading={btnLoading}
        rightButtonDisabled={confirmButtonDisabled}
        maxWidth={500}
        content={
          <>
            <Stack
              gap={(userDiviChief && !userMCC) && 1}
            >
              <Stack
                py={userPlanning ? 2 : 1}
              >
                {(userDiviChief || userPlanning) &&
                  <Box mb={2}>

                    <Typography level="title-sm" mb={1}>
                      {SELECT_ACTION_LABEL}
                    </Typography>

                    <RadioButtonComponent
                      disabled={btnLoading}
                      actions={approvalActions}
                      value={processData?.action}
                      handleChange={(e) => {
                        // console.log(e.target.value)
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
                {userDiviChief && !userMCC ? (
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

              {(userDiviChief && !userMCC) && <Divider />}

              <InputComponent
                type="password"
                label="Authorization pin"
                helperText={INPUT_HELPER}
                value={pin}
                setValue={setPin}
              />

            </Stack>
          </>
        }
      />

      <AlertDialogComponent
        isLoading={btnLoading}
        // leftButtonAction={
        //   status === 200 ? handleCloseConfirmation : closeAlertDialog
        // }
        leftButtonAction={() => handleCloseConfirmation()}
        rightButtonAction={() => handleCloseConfirmation()}
        noRightButton={false}
      />
    </Fragment>
  );
};

export default ProcessAOPContent;
