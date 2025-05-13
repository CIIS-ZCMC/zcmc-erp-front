import React, { Fragment, useState } from "react";
import useModalHook from "../../../../Hooks/ModalHook";
import moment from "moment";
import {
  useActivity,
  useActivityActions,
} from "../../../../Hooks/AOP/ActivityHook";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import useSnackbarHook from "../../../../Components/Common/SnackbarHook";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/joy";
import ConfirmationModalComponent from "../../../../Components/Common/Dialog/ConfirmationModalComponent";

export const MarkReviewFooter = ({ openMarkModal, setOpenMarkModal }) => {
  // STATE

  const [btnLoading, setBtnLoading] = useState(false);
  const titleStyles = { level: "body-xs", fontWeight: 400 };
  const activityId = localStorageGetter("activeActivityId");
  const activity = useActivity();

  const { is_reviewed } = activity ?? {};

  // HOOKS
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const { markAsReviewed, getActivityById } = useActivityActions();
  const { showSnack } = useSnackbarHook();

  // FUNCTIONS
  const handleClickMarkCheckbox = () => {
    setOpenMarkModal(true);
    const data = {
      status: "info",
      title: "Mark this activity as reviewed?",
      description:
        "Showing marks helps you determine which among all activities has successfully passed your double-checking so that you don't have to double-check again. Don’t worry, you can uncheck this later.",
    };

    setConfirmationModal(data);
  };

  const handleMarkAsReviewed = () => {
    setBtnLoading(true);
    markAsReviewed(activityId, (status, message) => {
      setBtnLoading(false);
      closeConfirmation();
      setOpenMarkModal(false);
      getActivityById(activityId, () => {}), showSnack(status, message);
      // getAOPApplicationById(AOP_APPLICATION_ID, () => {});
    });
  };

  return (
    <Fragment>
      <Stack gap={2}>
        {/* REVIEW */}
        <Typography
          level={titleStyles.level}
          fontWeight={titleStyles.fontWeight}
        >
          Double-checking support
        </Typography>
        <FormControl sx={{ gap: 1 }}>
          <Checkbox
            label="Mark activity as “Reviewed”"
            size="sm"
            sx={{ fontSize: 12, color: "neutral.800" }}
            color="primary"
            defaultChecked={is_reviewed}
            onChange={handleClickMarkCheckbox}
          />
          <FormHelperText sx={{ fontSize: 11, color: "neutral.400" }}>
            Showing marks helps you determine which among all activities has
            successfully passed your double-checking so that you don't have to
            double-check again.
          </FormHelperText>

          <FormHelperText sx={{ fontSize: 12, color: "neutral.600" }}>
            Marked as <b>“Reviewed”</b> on {moment().format("ll")}
          </FormHelperText>
        </FormControl>
      </Stack>

      {/* CONFIRM MARK REVIEWED */}
      {openMarkModal && (
        <ConfirmationModalComponent
          leftButtonAction={() => {
            closeConfirmation();
            setOpenMarkModal(false);
          }}
          leftButtonLabel="No, back to request"
          rightButtonLabel="Mark as “Reviewed”"
          rightButtonAction={handleMarkAsReviewed}
          isLoading={btnLoading}
        />
      )}
    </Fragment>
  );
};
