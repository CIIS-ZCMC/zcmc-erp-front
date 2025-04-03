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
import useModalHook from "../../../Hooks/ModalHook";
import { getStatusIcon } from "../../../Utils/StatusIcon";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import {
  getModeColorScheme,
  getStatusColorScheme,
} from "../../../Utils/ColorScheme";

AlertDialogComponent.propTypes = {
  rightButtonLabel: PropTypes.string,
  rightButtonAction: PropTypes.func,
  leftButtonLabel: PropTypes.string,
  leftButtonAction: PropTypes.func,
  rightButtonDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  noRightButton: PropTypes.bool,
};

function AlertDialogComponent({
  rightButtonLabel = "Proceed",
  rightButtonAction,
  rightButtonDisabled,
  leftButtonLabel = "Close",
  leftButtonAction,
  isLoading,
  noRightButton = true,
}) {
  const {
    alertDialogState: { isOpen, status, title, description },
    closeAlertDialog,
  } = useModalHook();

  console.log("isOpen:", isOpen); // Debugging log

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal keepMounted open={isOpen} onClose={closeAlertDialog}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ModalDialog
              sx={{
                width: "auto",
                maxWidth: "20%",
                borderRadius: 20,
              }}
            >
              <DialogTitle
                sx={{ alignItems: "start", justifyContent: "space-between" }}
              >
                <Stack gap={1}>
                  <Box mb={2}>{getStatusIcon(status)}</Box>
                  <Typography
                    fontSize={{ xs: 15, lg: 18 }}
                    fontWeight={600}
                    color={getModeColorScheme(status).colorScheme}
                  >
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
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}

export default AlertDialogComponent;
