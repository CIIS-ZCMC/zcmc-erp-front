import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/joy";
import TextareaComponent from "./TextareaComponent";
import ButtonComponent from "../Common/ButtonComponent";
import { useComment, useCommentActions } from "../../Hooks/CommentHook";
import ConfirmationModalComponent from "../Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../Hooks/ModalHook";
import useSnackbarHook from "../Common/SnackbarHook";
import { localStorageGetter } from "../../Utils/LocalStorage";
import { useAOPApplicationsActions } from "../../Hooks/AOP/AOPApplicationsHook";

const PostCommentComponent = ({ postCommentModal, setPostCommentModal }) => {
  const comment = useComment();
  const activityId = localStorageGetter("activeActivityId");
  const { setComment, postComment } = useCommentActions();
  const [loading, setLoading] = useState(false);
  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const { showSnack } = useSnackbarHook();
  const { getAOPApplicationById } = useAOPApplicationsActions();

  const submit = () => {
    setLoading(true);
    postComment({ activityId: activityId, comment: comment }, (status) => {
      setLoading(false);
      setPostCommentModal(false);
      closeConfirmation();

      if (status === 201) {
        setComment("");
        getAOPApplicationById(AOP_APPLICATION_ID, () => {});
        showSnack(200, "Comment posted successfully");
      } else {
        showSnack(200, "Comment posted successfully");
      }
    });
  };

  const handleConfirmationModal = () => {
    setPostCommentModal(true);
    const data = {
      status: "warning",
      title: "Confirm Comment Submission",
      description:
        "Please confirm your action before proceeding. Once submitted, this comment will be permanently recorded and cannot be modified or deleted.",
    };

    setConfirmationModal(data);
  };

  return (
    <Stack gap={2}>
      <TextareaComponent
        label={"Comment"}
        color="primary"
        minRows={6.5}
        maxRows={6.5}
        value={comment}
        setValue={setComment}
        placeholder={"Add your comments here"}
      />
      <Box>
        <ButtonComponent
          label={"Post comment"}
          width="auto"
          onClick={handleConfirmationModal}
          disabled={!comment}
        />
      </Box>

      {/* Test Confirmation Modal */}
      {postCommentModal && (
        <ConfirmationModalComponent
          leftButtonLabel="Cancel"
          rightButtonAction={submit}
          rightButtonLabel="Post comment"
          isLoading={loading}
          rigthbUtt
        />
      )}
    </Stack>
  );
};

export default PostCommentComponent;
