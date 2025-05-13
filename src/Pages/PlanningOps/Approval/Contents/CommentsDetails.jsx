import React, { Fragment } from "react";
import { useComments } from "../../../../Hooks/CommentHook";
import { Stack } from "@mui/joy";
import SimpleCommentComponent from "../../../../Components/Comments/SimpleCommentComponent";

export const CommentsDetails = () => {
  const comments = useComments();
  return (
    <Fragment>
      <Stack gap={2.5} mr={1}>
        {comments.map(({ user, comment, date }, index) => (
          <SimpleCommentComponent
            key={index}
            name={user}
            comment={comment}
            date={date}
          />
        ))}
      </Stack>
    </Fragment>
  );
};
