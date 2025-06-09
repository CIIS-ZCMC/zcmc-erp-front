import React, { Fragment, useState } from "react";
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
import { useLocation } from "react-router-dom";

function ManagePPMP() {
  // HOOKS
  const { setAlertDialog } = useModalHook();
  const { ppmpApplicationItems, ppmpApplication } = usePPMP();
  const { receivePPMP } = usePPMPApplicationActions();
  const location = useLocation();
  const PPMP_ID = location?.pathname?.split("/")[3];

  // STATES
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [index, setIndex] = React.useState("all");
  const [authPin, setAuthPin] = useState(null);

  // MODAL
  const handleOpenModal = () => setReceiveModalOpen(true);
  const handleCloseModal = () => setReceiveModalOpen(false);

  //  FUNCTIONS
  const handleReceive = () => {
    let data = {};
    receivePPMP(
      { authorization_pin: authPin, ppmp_application_id: PPMP_ID },
      (status, message) => {
        if (status == 200) {
          data = {
            status: status,
            title: message ? message : "PPMP successfully received.",
            description:
              "This request is now completed and closed for further pr`ocessing. We’ve also notified the requester (HRMO) about this change.",
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

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Viewing PPMP{" "}
              <Typography textColor={"warning.400"}>#2023-0031</Typography> from{" "}
              <Typography textColor={"warning.400"}>{"HRMO"}</Typography>
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
                disabled={ppmpApplication?.status === "Received"}
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
                "Confirm you action by typing-in your authorization PIN."
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
