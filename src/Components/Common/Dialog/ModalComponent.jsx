import PropTypes from "prop-types";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Modal,
  ModalDialog,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { BiX } from "react-icons/bi";
import ButtonComponent from "../ButtonComponent";
import { Transition } from "react-transition-group";
import { useRef, useState } from "react";
import InputComponent from "../../Form/InputComponent";

ModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  content: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleClose: PropTypes.func.isRequired,
  rightButtonLabel: PropTypes.string,
  rightButtonAction: PropTypes.func,
  leftButtonLabel: PropTypes.string,
  leftButtonAction: PropTypes.func,
  rightButtonDisabled: PropTypes.bool,
  withProgress: PropTypes.bool,
  progressValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool,
  noRightButton: PropTypes.bool,
  noDivider: PropTypes.bool,
};

// SEE PROP TYPES FOR REFERENCE
function ModalComponent({
  isOpen, // Modal state, determines whether the modal is visible
  content, // The primary content displayed within the modal
  title, // The title of the modal, typically displayed at the top
  description, // A subtitle, styled with a smaller font
  minWidth, // Minimum width of the modal for automatic sizing
  maxWidth, // Maximum width of the modal for automatic sizing
  handleClose, // Callback function trigger to close the modal This can also be used for left button as the default action for "Close"
  rightButtonLabel = "Proceed", // Label for the right-side button within the modal
  rightButtonAction, // Function executed when the right-side button is clicked
  rightButtonDisabled, // Disables the right-side button when set to true
  leftButtonLabel = "Close", // Label for the left-side button within the modal
  leftButtonAction, // Function executed when the left-side button is clicked
  withProgress, // Enables a linear progress bar, useful for multi-step processes
  progressValue, // Represents the progress step value, such as [10, 20, 30, 40]
  isLoading, // Indicates whether the right-side button is in a loading state
  noRightButton, // If set to true, the right button is not displayed Defaults to false
  noDivider = false, // If set to true, the divider between the title and content is hidden
}) {
  const nodeRef = useRef(null); // New update
  const theme = useTheme();
  const custom = theme.palette.custom;

  const handleCloseModal = (event, reason) => {
    // Prevent closing the modal when backdrop is clicked
    if (reason === "backdropClick") {
      event.stopPropagation();
      return;
    }
    handleClose();
  };

  // STATES

  return (
    <Transition in={isOpen} timeout={300} nodeRef={nodeRef}>
      {(state) => (
        <Modal
          keepMounted
          open={!["exited", "exiting"].includes(state)}
          onClose={handleCloseModal} // Use the updated handler
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: "none",
                transition: `opacity 300ms, backdrop-filter 300ms`,
                ...{
                  entering: { opacity: 1, backdropFilter: "blur(8px)" },
                  entered: { opacity: 1, backdropFilter: "blur(8px)" },
                }[state],
              },
            },
          }}
          sx={[
            state === "exited"
              ? { visibility: "hidden" }
              : { visibility: "visible" },
          ]}
        >
          <ModalDialog
            minWidth={minWidth}
            maxWidth={maxWidth}
            sx={{
              width: "auto",
              borderRadius: 20,
              opacity: 0,
              transition: `opacity 300ms`,
              ...{
                entering: { opacity: 1 },
                entered: { opacity: 1 },
              }[state],
            }}
          >
            {/* TITLE */}
            <DialogTitle
              sx={{ alignItems: "start", justifyContent: "space-between" }}
            >
              <Stack gap={0.3}>
                <Typography fontSize={{ xs: 15, lg: 18 }} fontWeight={600}>
                  {title}
                </Typography>
                <Typography
                  fontWeight={400}
                  fontSize={{ xs: 12, lg: 13 }}
                  color="neutral"
                >
                  {description}
                </Typography>
              </Stack>
              {!noDivider && (
                <IconButton variant="plain" onClick={handleClose}>
                  <BiX fontSize={27} />
                </IconButton>
              )}
            </DialogTitle>

            {withProgress && (
              <LinearProgress
                determinate
                value={progressValue}
                sx={{ color: custom.buttonBg }}
              />
            )}
            {!noDivider && <Divider sx={{ mx: 0.2 }} />}

            {/* CONTENT */}
            <DialogContent>{content}</DialogContent>

            {/* FOOTER */}
            <Divider sx={{ mx: 0.2 }} />
            <DialogActions>
              <Box
                sx={{
                  width:
                    minWidth > "70vw" || maxWidth > "70vw" ? "20%" : "100%",
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row-reverse" },
                }}
              >
                {!noRightButton && (
                  <ButtonComponent
                    label={rightButtonLabel}
                    fullWidth
                    isLoading={isLoading}
                    onClick={rightButtonAction}
                    isDisabled={rightButtonDisabled || isLoading}
                  />
                )}

                <ButtonComponent
                  variant="outlined"
                  color="success"
                  label={leftButtonLabel}
                  fullWidth={!noRightButton}
                  onClick={leftButtonAction ?? handleClose}
                  isDisabled={isLoading}
                />
              </Box>
            </DialogActions>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}

export default ModalComponent;
