import CardComponent from "@Components/Common/Card/CardComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { TextSnippetOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import React, { Fragment } from "react";

export default function SuccessSubmissionModal({
  openSuccessDialog,
  setOpenSuccessDialog,
  nextYear,
  happensNext = [],
}) {
  return (
    <Fragment>
      <ModalComponent
        isOpen={openSuccessDialog}
        title={
          <Typography level="title-lg" color="">
            AOP and PPMP for F.Y. {nextYear}{" "}
            <b style={{ fontWeight: 600, color: "green" }}>
              successfully submitted for review.
            </b>
          </Typography>
        }
        description="Your AOP and PPMP applications has been sent to designated to the next approving body and notified them for approvals."
        content={
          <Stack padding={2}>
            <CardComponent
              statusColor={"#0288D1"}
              bgcolor={"#E0F5FF"}
              justifyContentHeader={"flex-start"}
              cardHeader={
                <Typography
                  level="title-lg"
                  startDecorator={<TextSnippetOutlined />}
                  color="primary"
                  mb={2}
                >
                  What Happens Next?
                </Typography>
              }
              cardBody={
                <Stack
                  spacing={2}
                  textAlign={"left"}
                  sx={{ textAlign: "justify" }}
                >
                  {happensNext.map((item, index) => item.description)}
                </Stack>
              }
            />
          </Stack>
        }
        maxWidth={"571px"}
        handleClose={() => setOpenSuccessDialog(false)}
        hasActionButtons
        noRightButton={true}
        leftButtonLabel="Close"
        leftButtonAction={() => setOpenSuccessDialog(false)}
        leftButtonVariant="solid"
      />
    </Fragment>
  );
}
