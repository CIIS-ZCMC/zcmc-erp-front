import React, { Fragment, useState } from "react";
import ModalComponent from "../Components/Common/Dialog/ModalComponent";
import { Button, Checkbox, Stack } from "@mui/joy";
import ButtonComponent from "../Components/Common/ButtonComponent";
import { AOP_CONSTANTS } from "../Data/constants";
import ConfirmationModalComponent from "../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../Hooks/ModalHook";
import AlertDialogComponent from "../Components/Common/Dialog/AlertDialogComponent";

export default function ComponentTestPage() {
  const [open, setOpen] = useState(false);

  const { AOP_TITLE, AOP_SUBHEADING } = AOP_CONSTANTS;
  const { setAlertDialog, setConfirmationModal } = useModalHook();

  const handleConfirmationModal = () => {
    const data = {
      status: 200,
      title:
        "Changes on PPMP are ready to be reflected to your AOP. Would you like to have a preview first before saving changes?",
      description:
        "Document previews will be generated and downloaded in Microsoft Excel Spreadsheet (.xls) file format. The document preview is for viewing purposes only to help you ensure all fields are filled-up correctly and accurately.",
    };

    setConfirmationModal(data);
  };

  const handleShowAlert = (status) => {
    const data = {
      status: status,
      title: "AOP for F.Y. 2026 successfully submitted for approval.",
      description:
        "Your AOP request has been sent to designated to the next approving body and notified them for approvals.",
    };

    setAlertDialog(data);
  };

  return (
    <Fragment>
      <Stack gap={1} direction={"row"}>
        <ButtonComponent onClick={() => setOpen(true)} label={"Open modal"} />{" "}
        <ButtonComponent
          variant={"outlined"}
          color="primary"
          onClick={handleConfirmationModal}
          label={"Open confirmation modal"}
        />
      </Stack>

      {/* Test Modal */}
      <ModalComponent
        isOpen={open}
        handleClose={() => setOpen(false)}
        title={AOP_TITLE}
        description={AOP_SUBHEADING}
        content={<Fragment>This is a content for ModalComponent</Fragment>}
      />

      {/* Test Confirmation Modal */}
      <ConfirmationModalComponent
        leftButtonLabel="Back to editor"
        rightButtonAction={() => handleShowAlert(200)}
        withAuthPin
        withDivider
        content={"This is a content"}
      />

      {/* Test AlertDialog Modal */}
      <AlertDialogComponent />
    </Fragment>
  );
}
