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
import { useState } from "react";
import useModalHook from "../../../Hooks/ModalHook";
import { getStatusIcon } from "../../../Utils/StatusIcon";
import InputComponent from "../../Form/InputComponent";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";

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

function ConfirmationModalComponent({
  content,
  rightButtonLabel = "Proceed",
  rightButtonAction,
  rightButtonDisabled,
  leftButtonLabel = "Cancel",
  leftButtonAction = null,
  isLoading,
  withAuthPin,
  withDivider,
  setAuthPin,
  pinHelperText = "Confirm you action by typing-in your authorization PIN.",
  errors = {},
}) {
  const {
    confirmationModalState: { isOpen = false, title, description, status },
    closeConfirmation,
  } = useModalHook();

  const [pin, setPin] = useState(null);

  const handlePinInput = (value) => {
    if (setAuthPin) setAuthPin(value);
    setPin(value);
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <Modal keepMounted open={isOpen} onClose={closeConfirmation}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalDialog
              sx={{
                width: "auto",
                height: "auto",
                maxHeight: "80%",
                maxWidth: "540px",
                borderRadius: 20,
                padding: 3.5,
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
                    name="pin"
                    label="Authorization pin"
                    helperText={pinHelperText}
                    setValue={handlePinInput}
                    value={pin}
                    errors={errors}
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
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}

export default ConfirmationModalComponent;
