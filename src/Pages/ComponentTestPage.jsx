import React, { Fragment, useState } from "react";
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
import { AOP_CONSTANTS } from "../Data/constants";
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

  const accordionIds = [`parent-1`, `parent-2`];
  const children = [`children-1`];
  const [expanded, setExpanded] = useState([`parent-1`, `children-1`]);
  const [active, setActive] = useState(0);

  const handleClickActivity = (index) => {
    setActive(index);
  };

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

      {/* ACCORDION */}
      <ContainerComponent title={"Accordion component"}>
        <Stack width={400} gap={1}>
          {accordionIds.map((id) => (
            <CustomAccordionComponent
              id={id}
              expanded={expanded}
              setExpanded={setExpanded}
              title={`Objective #${id} - Core`}
              withEdit
            >
              <Stack gap={2}>
                <EllipsisComponent
                  label={"Objective:"}
                  text={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.`}
                />
                <EllipsisComponent
                  label={"Success indicators:"}
                  text={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
                />

                {children.map((id) => (
                  <CustomAccordionComponent
                    id={id}
                    size={"sm"}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    title={`Acitivities (5)`}
                  >
                    <Stack gap={1}>
                      {accordionIds.map((id, index) => (
                        <ActivityContainerComponent
                          onClick={() => handleClickActivity(index)}
                          active={index === active}
                          label={"Activity #1"}
                          text={
                            "For each ad campaign that you create for each ad campaign that you create. For each ad campaign that you create for each ad campaign that you create"
                          }
                        />
                      ))}
                    </Stack>
                  </CustomAccordionComponent>
                ))}
              </Stack>
            </CustomAccordionComponent>
          ))}
        </Stack>
      </ContainerComponent>

      <Stack mt={3}>
        <ContainerComponent
          title={
            "Select resources (items) for activity Activity: Sample activity..."
          }
          description="Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        >
          <Grid
            container
            spacing={3}
            columns={{ xs: 12, sm: 6, md: 12 }}
            sx={{
              flexGrow: 1,
              width: "auto",
              p: 1,
            }}
          >
            {/* ITEMS VIEW */}
            <Grid
              item="true"
              // width={{ sm: "100%", lg: "60%" }}
              xs={12} // Full width on extra small screens
              sm={2} // 2 items on small screens
              md={8}
            >
              <Stack gap={2}>
                <BoxComponent>
                  <Stack
                    direction={{ sm: "column", lg: "row" }}
                    alignItems={{ sm: "start", lg: "center" }}
                    gap={2}
                  >
                    <InputComponent
                      startDecorator={<Search size={13} />}
                      width={{ sm: "100%", lg: "20%" }}
                    />
                    <Typography level="body-xs">
                      Showing 16 of 16 Items
                    </Typography>
                  </Stack>
                </BoxComponent>
                <BoxComponent maxHeight={"65vh"}>
                  <Grid
                    container
                    spacing={3}
                    columns={{ xs: 12, sm: 6, md: 12 }}
                    sx={{
                      flexGrow: 1,
                      width: "auto",
                      p: 1,
                    }}
                  >
                    {Array(40)
                      .fill(null)
                      .map((_, index) => (
                        <Grid
                          key={index}
                          item="true"
                          xs={12}
                          sm={2}
                          md={6}
                          lg={4}
                          xl={3}
                        >
                          <ItemCardComponent />
                        </Grid>
                      ))}
                  </Grid>
                </BoxComponent>
              </Stack>
            </Grid>
          </Grid>
        </ContainerComponent>
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
    </Stack>
  );
}
