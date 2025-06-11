import React, { Fragment, useCallback, useState } from "react";
import ModalComponent from "../Components/Common/Dialog/ModalComponent";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import ButtonComponent from "../Components/Common/ButtonComponent";
import { AOP_CONSTANTS, approvalActions } from "../Data/constants";
import ConfirmationModalComponent from "../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../Hooks/ModalHook";
import ContainerComponent from "../Components/Common/ContainerComponent";
import ItemCardComponent from "../Components/Resources/ItemCardComponent";
import BoxComponent from "../Components/Common/Card/BoxComponent";
import InputComponent from "../Components/Form/InputComponent";
import { Edit, Pencil, PencilIcon, Search } from "lucide-react";
import CustomAccordionComponent from "../Components/Common/Accordion/CustomAccordionComponent";
import EllipsisComponent from "../Components/Common/Typography/EllipsisComponent";
import { ActivityContainerComponent } from "../Components/Activities/ActivityContainerComponent";
import RadioButtonComponent from "../Components/Common/RadioButtonComponent";
import TextareaComponent from "../Components/Form/TextareaComponent";
import AlertDialogComponent from "../Components/Common/Dialog/AlertDialogComponent";

export default function ComponentTestPage() {
  const [open, setOpen] = useState(false);

  const { AOP_TITLE, AOP_SUBHEADING } = AOP_CONSTANTS;
  const { setAlertDialog, setConfirmationModal, closeAlertDialog } = useModalHook();

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
      isGlobal: false,
      description:
        "Your AOP request has been sent to designated to the next approving body and notified them for approvals.",
    };
    setAlertDialog(data);
  };

  const accordionIds = [`parent-1`, `parent-2`];
  const children = [`children-1`];
  const [expanded, setExpanded] = useState([`parent-1`, `children-1`]);
  const [active, setActive] = useState(0);

  const handleClickActivity = (index) => {
    setActive(index);
  };

  const [action, setAction] = useState(null);
  const [newComment, setNewComment] = useState("");
  return (
    <Stack gap={5}>
      <Stack gap={1} direction={"row"}>
        <ButtonComponent onClick={() => setOpen(true)} label={"Open modal"} />
        <ButtonComponent
          variant={"outlined"}
          color="primary"
          onClick={handleConfirmationModal}
          label={"Open confirmation modal"}
        />
      </Stack>

      <Stack gap={2} py={1}>
        {<pre>{newComment}</pre>}
        <TextareaComponent
          label={"Comment"}
          minRows={7.3}
          maxRows={7.3}
          value={newComment}
          setValue={setNewComment}
          placeholder={"Add your comments here"}
        />
      </Stack>

      {/* Test Modal */}
      <ModalComponent
        isOpen={open}
        handleClose={() => setOpen(false)}
        title={AOP_TITLE}
        description={AOP_SUBHEADING}
        content={
          <Stack gap={2} py={1}>
            <Typography level="title-sm" mt={1}>
              Select the action you would like to take:
            </Typography>
            <RadioButtonComponent
              actions={approvalActions}
              value={action}
              setAction={setAction}
            />
          </Stack>
        }
      />
      {/* Test Confirmation Modal */}
      <ConfirmationModalComponent
        leftButtonLabel="Back to editor"
        rightButtonAction={() => handleShowAlert(200)}
        withAuthPin
        withDivider
        content={"This is a content"}
      />

      <AlertDialogComponent
        leftButtonLabel="'confirm"
        leftButtonAction={() => { alert('navigating....'); closeAlertDialog() }}
      />
    </Stack>
  );
}
