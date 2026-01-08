import React, { Fragment, useEffect, useState } from "react";
import useModalHook from "../../../../Hooks/ModalHook";
import {
  useActivity,
  useActivityActions,
  useActivityUIStates,
} from "../../../../Hooks/AOP/ActivityHook";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import useSnackbarHook from "../../../../Hooks/SnackbarHook";
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/joy";
import ConfirmationModalComponent from "../../../../Components/Common/Dialog/ConfirmationModalComponent";
import { useAOPApplicationsActions } from "../../../../Hooks/AOP/AOPApplicationsHook";
import { useApprovalTimeline } from "../../../../Hooks/AOP/AOPApprovalHook";
import { useAuth } from "../../../../Store/AuthStore";

export const MarkReviewFooter = ({
  openMarkModal,
  setOpenMarkModal,
  // isApproved,
}) => {
  // HOOKS
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const { markAsReviewed, getActivityById, markAsUnreviewed } =
    useActivityActions();
  const { showSnack } = useSnackbarHook();
  const { getAOPApplicationById } = useAOPApplicationsActions();
  const { user } = useAuth();
  const approvalTimeline = useApprovalTimeline();
  const { activeActivity } = useActivityUIStates();
  const activity = useActivity();
  const { is_reviewed } = activity ?? {};

  // STATE
  const [btnLoading, setBtnLoading] = useState(false);
  const titleStyles = { level: "body-xs", fontWeight: 400 };
  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");
  const [isReviewed, setIsReviewed] = useState(true);
  const [disabledCheckbox, setDisabledCheckbox] = useState(false);

  // FUNCTIONS
  const handleClickMarkCheckbox = () => {
    setOpenMarkModal(true);
    const data = {
      status: "info",
      title: is_reviewed
        ? "Remove review mark from this activity?"
        : "Mark this activity as reviewed?",
      description: is_reviewed
        ? "Are you sure you want to remove the review mark? You can mark this activity as reviewed again later if needed."
        : "Showing marks helps you determine which among all activities has successfully passed your double-checking so that you don't have to double-check again. Don’t worry, you can uncheck this later.",
    };

    setConfirmationModal(data);
  };

  const handleMarkAsReviewed = () => {
    setIsReviewed(true);
    setBtnLoading(true);

    if (is_reviewed) {
      markAsUnreviewed(activeActivity, (status, message) => {
        setBtnLoading(false);
        closeConfirmation();
        setOpenMarkModal(false);
        getActivityById(activeActivity, () => {}), showSnack(status, message);
        getAOPApplicationById(AOP_APPLICATION_ID, () => {});
      });
    } else {
      markAsReviewed(activeActivity, (status, message) => {
        setBtnLoading(false);
        closeConfirmation();
        setOpenMarkModal(false);
        getActivityById(activeActivity, () => {}), showSnack(status, message);
        getAOPApplicationById(AOP_APPLICATION_ID, () => {});
      });
    }
  };

  useEffect(() => {
    setIsReviewed(is_reviewed);
  }, [activity, is_reviewed]);

  useEffect(() => {
    if (!Array.isArray(approvalTimeline) || !user?.id) return;

    const isApproved = approvalTimeline.some(
      (item) => item.approver_user_id === user.id && item.status === "approved"
    );

    // console.log("isApproved", approvalTimeline);

    setDisabledCheckbox(isApproved);
  }, [approvalTimeline, user?.id]);
  return (
    <Fragment>
      {/* {JSON.stringify(is_reviewed)} */}
      <Stack gap={2}>
        {/* REVIEW */}
        <Typography
          level={titleStyles.level}
          fontWeight={titleStyles.fontWeight}
        >
          Double-checking support
        </Typography>
        <Box sx={{ gap: 1 }}>
          <FormControl>
            <Checkbox
              label="Mark activity as “Reviewed”"
              size="sm"
              sx={{ fontSize: 12, color: "neutral.800" }}
              color="primary"
              checked={isReviewed} // ✅ controlled
              disabled={disabledCheckbox}
              onChange={handleClickMarkCheckbox}
            />

            <FormHelperText sx={{ fontSize: 11, color: "neutral.400" }}>
              Showing marks helps you determine which among all activities has
              successfully passed your double-checking so that you don't have to
              double-check again.
            </FormHelperText>
          </FormControl>

          {/* {is_reviewed && (
            <FormHelperText sx={{ fontSize: 12, color: "neutral.600" }}>
              Marked as <b>“Reviewed”</b> on{" "}
              {moment(is_reviewed_date).format("ll")}
            </FormHelperText>
          )} */}
        </Box>
      </Stack>

      {/* CONFIRM MARK REVIEWED */}
      {openMarkModal && (
        <ConfirmationModalComponent
          leftButtonAction={() => {
            closeConfirmation();
            setOpenMarkModal(false);
          }}
          leftButtonLabel="No, back to request"
          rightButtonLabel={is_reviewed ? "Remove mark" : 'Mark as "Reviewed"'}
          rightButtonAction={handleMarkAsReviewed}
          isLoading={btnLoading}
        />
      )}
    </Fragment>
  );
};
