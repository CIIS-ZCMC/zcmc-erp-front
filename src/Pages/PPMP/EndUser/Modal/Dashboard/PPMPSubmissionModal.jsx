import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { Stack, Typography } from "@mui/joy";
import { grey } from "@mui/material/colors";
import React, { Fragment } from "react";

export default function PPMPSubmissionModal({
  openSave,
  setOpenSave,
  nextYear,
  handleSubmit,
  buttonLoader,
  setPin,
}) {
  return (
    <Fragment>
      <ModalComponent
        isOpen={openSave}
        title={
          <Typography color="success">
            Official Submission Confirmation
          </Typography>
        }
        description={`You are about to officially submit your Annual Operational Plan and Project Procurement Management Plan for Fiscal Year ${nextYear} to the approving bodies for review and approval.`}
        maxWidth={"571px"}
        handleClose={() => setOpenSave(false)}
        content={
          <>
            <Stack
              sx={{
                bgcolor: grey[100],
                border: `1px solid ${grey[400]}`,
                borderRadius: 10,
                padding: 2,
                mt: 1.5,
              }}
              spacing={1}
            >
              <Typography
                level="body-sm"
                sx={{ fontWeight: 500, color: grey[800] }}
              >
                Please confirm the following:
              </Typography>
              <Typography level="body-sm" sx={{ color: grey[800] }}>
                <b>✓</b> All information provided is accurate and complete
              </Typography>
              <Typography level="body-sm" sx={{ color: grey[800] }}>
                <b>✓</b> All required resource item details have been properly
                filled out
              </Typography>
              <Typography level="body-sm" sx={{ color: grey[800] }}>
                <b>✓</b> You have the authority to submit this document
              </Typography>
            </Stack>
            <AuthorizationPinComponent setPin={setPin} />
          </>
        }
        hasActionButtons
        noRightButton={true}
        leftButtonLabel="Submit"
        leftButtonVariant="solid"
        leftButtonAction={() => handleSubmit()}
        isLoading={buttonLoader}
      />
    </Fragment>
  );
}
