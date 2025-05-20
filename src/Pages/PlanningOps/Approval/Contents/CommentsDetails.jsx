import React, { Fragment, useMemo, useState } from "react";
import { useComments } from "../../../../Hooks/CommentHook";
import { Divider, Stack } from "@mui/joy";
import SimpleCommentComponent from "../../../../Components/Comments/SimpleCommentComponent";
import { groupByDate } from "../../../../Utils/GroupData";
import moment from "moment";
import NoResultComponent from "../../../../Components/Common/Table/NoResultComponent";
import PostCommentComponent from "../../../../Components/Form/PostCommentComponent";
import ContainerComponent from "../../../../Components/Common/ContainerComponent";
import { useActivityLoadingState } from "../../../../Hooks/AOP/ActivityHook";

export const CommentsDetails = () => {
  const comments = useComments();
  const [postCommentModal, setPostCommentModal] = useState(false);
  const commentsDisplay = useMemo(() => groupByDate(comments), [comments]);
  const isLoading = useActivityLoadingState();
  return (
    <Fragment>
      <ContainerComponent
        noBoxShadow
        title={"Comments for the selected activity"}
        description={
          "Write comments below as your feedback or input for this selected activity only."
        }
        scrollable
        contentMaxHeight={"35.5vh"}
        contentMinHeight={"35.5vh"}
        isLoading={isLoading}
        footer={
          <PostCommentComponent
            setPostCommentModal={setPostCommentModal}
            postCommentModal={postCommentModal}
          />
        }
      >
        <Stack gap={2.5} mr={1}>
          {Object.keys(commentsDisplay)?.length === 0 && <NoResultComponent />}

          {Object.entries(commentsDisplay).map(([date, messages]) => (
            <Fragment key={date}>
              {date !== moment().format("dddd, MMMM D") && (
                <Divider sx={{ fontSize: "xs", mt: 0.5 }}>{date}</Divider>
              )}

              {messages?.map(
                ({ name, area_code, created_at, comment }, key) => (
                  <SimpleCommentComponent
                    key={key}
                    name={name}
                    comment={comment}
                    area_code={area_code}
                    date={created_at}
                  />
                )
              )}
            </Fragment>
          ))}
        </Stack>
      </ContainerComponent>
    </Fragment>
  );
};
