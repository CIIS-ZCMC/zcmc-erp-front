import React, { Fragment } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/joy";
import { grey } from "@mui/material/colors";
import { ArrowForward, WarningAmber } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";

export default function PPMPSubmissionModal({
  openSave,
  setOpenSave,
  nextYear,
  handleSubmit,
  buttonLoader,
  pin,
  setPin,
  errorMessage,
  setErrorMessage,
}) {
  const navigate = useNavigate();

  const handleClose = () => {
    setOpenSave(false);
    if (setPin) setPin("");
    if (setErrorMessage) setErrorMessage("");
  };

  const errorText =
    typeof errorMessage === "object" && errorMessage !== null
      ? errorMessage.message
      : errorMessage;

  const isAopDraft =
    typeof errorText === "string" &&
    errorText.toLowerCase().includes("aop is still in draft");

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
        minWidth={"571px"}
        handleClose={handleClose}
        content={
          <>
            {errorText && (
              <Alert
                variant="soft"
                color="danger"
                startDecorator={
                  <WarningAmber
                    sx={{
                      color: "danger.600",
                      fontSize: 24,
                      alignSelf: "flex-start",
                      mt: 0.2,
                    }}
                  />
                }
                sx={{
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "danger.300",
                  p: 2,
                  mt: 1.5,
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    level="title-sm"
                    color="danger"
                    sx={{ fontWeight: 700 }}
                  >
                    {isAopDraft
                      ? "AOP Submission Required"
                      : "Submission Blocked"}
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      color: "danger.800",
                      mt: 0.5,
                      lineHeight: 1.5,
                    }}
                  >
                    {errorText}
                  </Typography>
                  {isAopDraft && (
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="sm"
                        variant="solid"
                        color="danger"
                        onClick={() => {
                          handleClose();
                          navigate("/aop");
                        }}
                        endDecorator={<ArrowForward sx={{ fontSize: 16 }} />}
                        sx={{
                          fontWeight: 600,
                          fontSize: 13,
                          borderRadius: "6px",
                          boxShadow: "sm",
                        }}
                      >
                        Go to AOP Submission
                      </Button>
                    </Box>
                  )}
                </Box>
              </Alert>
            )}

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

            <AuthorizationPinComponent
              pin={pin}
              setPin={(val) => {
                setPin && setPin(val);
                if (setErrorMessage) setErrorMessage("");
              }}
              isLoading={buttonLoader}
            />
          </>
        }
        hasActionButtons
        leftButtonLabel="Cancel"
        leftButtonVariant="outlined"
        leftButtonAction={handleClose}
        rightButtonLabel="Submit"
        rightButtonAction={() => handleSubmit()}
        isLoading={buttonLoader}
        loadingLabel="Submitting..."
        rightButtonDisabled={!pin}
      />
    </Fragment>
  );
}
