import React, { Fragment, useEffect, useState } from "react";
import { PPMP_CONSTANTS } from "../../../Data/constants";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { PPMP_VIEW_HEADER, ppmpHeaders } from "../../../Data/Columns";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { Box, Stack, Typography } from "@mui/joy";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import useModalHook from "../../../Hooks/ModalHook";
import {
  usePPMP,
  usePPMPApplicationActions,
} from "../../../Hooks/PPMP/PPMPApplicationHook";
import { useLocation, useNavigate } from "react-router-dom";

function ManagePPMP() {
  // HOOKS
  const { setAlertDialog } = useModalHook();
  const { ppmpApplicationItems, ppmpApplication } = usePPMP();
  const { receivePPMP, getPPMPApplicationByID } = usePPMPApplicationActions();
  const location = useLocation();
  const navigate = useNavigate();
  const PPMP_ID = location?.pathname?.split("/")[3];

  // STATES
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [authPin, setAuthPin] = useState(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [disabledReceivePPMP, setDisabledReceivePPMP] = useState(true);

  useEffect(() => {
    setDisabledReceivePPMP(ppmpApplication?.status === "Received" || false);
  }, [ppmpApplication?.status]);

  // MODAL
  const handleOpenModal = () => setReceiveModalOpen(true);
  const handleCloseModal = () => setReceiveModalOpen(false);

  //  FUNCTIONS
  const handleReceive = () => {
    setIsBtnLoading(true);
    let data = {};
    receivePPMP(
      { authorization_pin: authPin, ppmp_application_id: PPMP_ID },
      (status, message) => {
        setIsBtnLoading(false);
        if (status == 200) {
          data = {
            status: status,
            title: message ? message : "PPMP successfully received.",
            description:
              "This request is now completed and closed for further processing. We’ve also notified the requester about this change.",
          };
          setReceiveModalOpen(false);
        } else {
          data = {
            status: "error",
            title: message ? message : "Something went wrong.",
            description:
              "We encountered an error while processing your request. Please try again or contact support if the issue persists.",
          };
        }

        setAlertDialog(data);
      }
    );
  };

  const handleBack = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  useEffect(() => {
    // Fetch the PPMP application items if not already loaded
    getPPMPApplicationByID(PPMP_ID, () => {});
  }, []);

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Viewing{" "}
              <Typography textColor={"warning.400"}>
                {ppmpApplication?.requester_area}'s{" "}
              </Typography>
              PPMP for year {ppmpApplication?.year}
            </Typography>
          }
          description={"Based on actual live data from the end-user’s request."}
        />

        <ContainerComponent
          title={"List of resources"}
          description={
            "The table below contains a list of resources added by the end-user."
          }
          footer={
            <Stack direction={"row"} gap={1}>
              <ButtonComponent
                onClick={handleBack}
                variant="outlined"
                color="primary"
                label={"Go back"}
              />
              <ButtonComponent
                variant="solid"
                color="primary"
                label={"Receive PPMP"}
                onClick={handleOpenModal}
                disabled={disabledReceivePPMP}
              />
            </Stack>
          }
        >
          <ScrollableTableComponent
            columns={PPMP_VIEW_HEADER}
            data={ppmpApplicationItems}
          />
        </ContainerComponent>
      </Stack>

      {/* RECEIVE MODAL */}
      <ModalComponent
        isOpen={receiveModalOpen}
        handleClose={handleCloseModal}
        hasActionButtons
        leftButtonAction={handleCloseModal}
        rightButtonAction={handleReceive}
        isLoading={isBtnLoading}
        rightButtonDisabled={!authPin || authPin.length < 6 || authPin === ""}
        title={
          <Typography>
            Receive the request{" "}
            <Typography textColor="warning.400">(#2023-0031) </Typography> from
            <Typography textColor="warning.400"> HRMO</Typography>?
          </Typography>
        }
        description={
          "Acknowledge the completion and approvals of this PPMP request by receiving it on your end."
        }
        minWidth={500}
        maxWidth={500}
        content={
          <Box py={2}>
            <InputComponent
              isRequired
              type="password"
              label="Authorization pin"
              helperText={
                "Confirm you action by entering your 6-digit authorization PIN."
              }
              setValue={setAuthPin}
              value={authPin}
            />
          </Box>
        }
      />
    </Fragment>
  );
}

export default ManagePPMP;
