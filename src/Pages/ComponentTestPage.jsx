import React, { Fragment, useState } from "react";
import ModalComponent from "../Components/Common/Dialog/ModalComponent";
import { Button, Checkbox, Grid, Stack, Typography } from "@mui/joy";
import ButtonComponent from "../Components/Common/ButtonComponent";
import { AOP_CONSTANTS } from "../Data/constants";
import ConfirmationModalComponent from "../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../Hooks/ModalHook";
import ContainerComponent from "../Components/Common/ContainerComponent";
import ItemCardComponent from "../Components/Resources/ItemCardComponent";
import BoxComponent from "../Components/Common/Card/BoxComponent";
import InputComponent from "../Components/Form/InputComponent";
import { Search } from "lucide-react";

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
        <ButtonComponent onClick={() => setOpen(true)} label={"Open modal"} />
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
    </Fragment>
  );
}
