import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/joy";
import TextareaComponent from "./TextareaComponent";
import ButtonComponent from "../Common/ButtonComponent";
import { useComment, useCommentActions } from "../../Hooks/CommentHook";

const PostCommentComponent = ({ activityId }) => {
  const comment = useComment();
  const { setComment, postComment } = useCommentActions();
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    postComment({ activityId: activityId, comment: comment }, (status) => {
      setLoading(false);
      if (status === 200) {
        setComment("");
      }
    });
  };

  return (
    <Stack gap={2}>
      <TextareaComponent
        label={"Comment"}
        color="success"
        minRows={7.3}
        maxRows={7.3}
        value={comment}
        setValue={setComment}
        placeholder={"Add your comments here"}
      />
      <Box>
        <ButtonComponent
          label={"Post comment"}
          width="auto"
          onClick={submit}
          isLoading={loading}
          disabled={!comment}
        />
      </Box>
    </Stack>
  );
};

export default PostCommentComponent;
