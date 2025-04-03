import PropTypes from "prop-types";
import {
  Box,
  DialogActions,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import ButtonComponent from "../ButtonComponent";
import { Transition } from "react-transition-group";
import { useRef } from "react";
import useModalHook from "../../../Hooks/ModalHook";
import { getStatusIcon } from "../../../Utils/StatusIcon";

AlertDialogComponent.propTypes = {
  rightButtonLabel: PropTypes.string,
  rightButtonAction: PropTypes.func,
  leftButtonLabel: PropTypes.string,
  leftButtonAction: PropTypes.func,
  rightButtonDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  noRightButton: PropTypes.bool,
};

// SEE PROP TYPES FOR REFERENCE
function AlertDialogComponent({
  rightButtonLabel = "Proceed", // Label for the right-side button within the modal
  rightButtonAction, // Function executed when the right-side button is clicked
  rightButtonDisabled, // Disables the right-side button when set to true
  leftButtonLabel = "Close", // Label for the left-side button within the modal
  leftButtonAction, // Function executed when the left-side button is clicked
  isLoading, // Indicates whether the right-side button is in a loading state
  noRightButton = true, // If set to true, the right button is not displayed Defaults to false
}) {
  const nodeRef = useRef(null);

  const {
    alertDialogState: { isOpen, status, title, description },
    closeAlertDialog,
  } = useModalHook();

  return (
    <Transition in={isOpen} timeout={800} nodeRef={nodeRef}>
      {(state) => (
        <Modal
          keepMounted
          open={!["exited", "exiting"].includes(state)}
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: "none",
                transition: `opacity 800ms, backdrop-filter 800ms`,
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
            sx={{
              width: "30%",
              borderRadius: 20,
              opacity: 0,
              transition: `opacity 800ms`,
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
              <Stack gap={1}>
                <Box mb={2}>{getStatusIcon(status)}</Box>
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
            </DialogTitle>

            <DialogActions>
              <Box
                sx={{
                  width: rightButtonAction ? "auto" : "100%",
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <ButtonComponent
                  label={leftButtonLabel}
                  onClick={leftButtonAction ?? closeAlertDialog}
                  isDisabled={isLoading}
                  fullWidth={!rightButtonAction}
                />

                {!noRightButton && (
                  <ButtonComponent
                    label={rightButtonLabel}
                    isLoading={isLoading}
                    onClick={rightButtonAction}
                    isDisabled={rightButtonDisabled || isLoading}
                  />
                )}
              </Box>
            </DialogActions>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}

export default AlertDialogComponent;
