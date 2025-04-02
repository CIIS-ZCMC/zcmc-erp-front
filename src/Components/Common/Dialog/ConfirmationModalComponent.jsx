import PropTypes from "prop-types";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import ButtonComponent from "../ButtonComponent";
import { Transition } from "react-transition-group";
import { useRef, useState } from "react";
import useModalHook from "../../../Hooks/ModalHook";
import { getStatusIcon } from "../../../Utils/StatusIcon";
import InputComponent from "../../Form/InputComponent";

ConfirmationModalComponent.propTypes = {
  content: PropTypes.node,
  rightButtonLabel: PropTypes.string,
  rightButtonAction: PropTypes.func,
  rightButtonDisabled: PropTypes.bool,
  leftButtonLabel: PropTypes.string,
  leftButtonAction: PropTypes.func,
  isLoading: PropTypes.bool,
  withAuthPin: PropTypes.bool,
  withDivider: PropTypes.bool,
  setAuthPin: PropTypes.func,
  pinHelperText: PropTypes.string,
};

// SEE PROP TYPES FOR REFERENCE
function ConfirmationModalComponent({
  content, // The primary content displayed within the modal
  rightButtonLabel = "Proceed", // Label for the right-side button within the modal
  rightButtonAction, // Function executed when the right-side button is clicked
  rightButtonDisabled, // Disables the right-side button when set to true
  leftButtonLabel = "Cancel", // Label for the left-side button within the modal
  leftButtonAction = null, // Function executed when the left-side button is clicked
  isLoading, // Indicates whether the right-side button is in a loading state
  withAuthPin, // Auth pin confirmation; Use the setAuthPin for state management
  withDivider, // To display modal between header and footer
  setAuthPin, // Handle auth pin input
  pinHelperText = "Confirm you action by typing-in your authorization PIN.",
}) {
  // HOOKS
  const nodeRef = useRef(null);
  const {
    confirmationModalState: { isOpen = false, title, description, status },
    closeConfirmation,
  } = useModalHook();

  // STATES
  const [pin, setPin] = useState(null);

  const handlePinInput = (value) => {
    if (setAuthPin) setAuthPin(value);
    setPin(value);
  };

  return (
    <Transition nodeRef={nodeRef} in={isOpen} timeout={500}>
      {(state) => (
        <Modal
          keepMounted
          open={!["exited", "exiting"].includes(state)}
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: "none",
                transition: `opacity 300ms, backdrop-filter 300ms`,
                ...{
                  entering: { opacity: 1, backdropFilter: "blur(8px)" },
                  entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  exiting: { opacity: 0, backdropFilter: "none" },
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
              width: "auto",
              height: "auto",
              maxHeight: "80%",
              maxWidth: "540px",
              borderRadius: 20,
              opacity: 0,
              padding: 3.5,
              transition: `opacity 400ms`,
              ...{
                entering: { opacity: 1 },
                entered: { opacity: 1 },
                exiting: { opacity: 0 },
              }[state],
            }}
          >
            {/* TITLE */}
            <DialogTitle
              sx={{ alignItems: "start", justifyContent: "space-between" }}
            >
              <Stack gap={1}>
                {getStatusIcon(status)}
                <Typography fontSize={{ xs: 20, lg: 20 }} fontWeight={600}>
                  {title}
                </Typography>
                <Typography
                  fontWeight={400}
                  fontSize={{ xs: 14, lg: 14 }}
                  color="neutral"
                >
                  {description}
                </Typography>
              </Stack>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent sx={{ py: withAuthPin && 2, overflow: "hidden" }}>
              {withDivider && <Divider sx={{ my: 0.5 }} />}

              {content && <Box py={2}>{content}</Box>}

              {withDivider && <Divider sx={{ my: 0.5 }} />}

              {withAuthPin && (
                <InputComponent
                  type="password"
                  label="Authorization pin"
                  helperText={pinHelperText}
                  setValue={handlePinInput}
                  value={pin}
                />
              )}
            </DialogContent>

            {/* FOOTER */}
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
                  variant="outlined"
                  label={leftButtonLabel}
                  onClick={leftButtonAction ?? closeConfirmation}
                  isDisabled={isLoading}
                  fullWidth={!rightButtonAction}
                />

                <ButtonComponent
                  label={rightButtonLabel}
                  isLoading={isLoading}
                  onClick={rightButtonAction}
                  isDisabled={rightButtonDisabled || isLoading}
                />
              </Box>
            </DialogActions>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}

export default ConfirmationModalComponent;
