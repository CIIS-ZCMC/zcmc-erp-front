import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useAllComments, useRemarks } from "../../../../Hooks/CommentHook";
import { groupByDate } from "../../../../Utils/GroupData";
import { feedbackTabOptions } from "../../../../Data/Options";
import moment from "moment";
import { Box, Divider, Stack } from "@mui/joy";
import CustomTabComponent from "../../../../Components/Common/CustomTabComponent";
import NoResultComponent from "../../../../Components/Common/Table/NoResultComponent";
import CommentContainerComponent from "../../../../Components/Comments/CommentContainerComponent";
import DrawerComponent from "../../../../Components/Common/DrawerComponent";
import { ThreeDots } from "react-loader-spinner";
import { useUserTypes } from "../../../../Store/AuthStore";
import { localStorageGetter } from "../../../../Utils/LocalStorage";

import { useNavigate } from "react-router-dom";

export const FeedbackContent = ({
  openFeedbackModal,
  setOpenFeedbackModal,
  isLoading,
  comments,
  remarks,
  role,
}) => {

  const [activeTab, setActiveTab] = useState(0);
  const userDiviChief = role === 'Division Chief'

  // const feedbackCount = Array.isArray(allComments) ? allComments?.length : 0;
  const commentCount = comments?.length || 0;

  useEffect(() => {
    // console.log('comments', comments)
    // console.log('remarks', remarks)
    // console.log('activeTab', activeTab)
  }, [comments, remarks])

  return (
    <DrawerComponent
      open={openFeedbackModal}
      setOpen={setOpenFeedbackModal}
      title={`Feedback in this request`}
      description={
        "The following list of feedback are based on your comments per activity and the Division Chief's remarks for this request as a whole."
      }
      content={
        <Stack gap={2} mt={2}>
          {/* {!isLoading && (
            <Box
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
              height={"80vh"}
            >
              <ThreeDots
                visible={true}
                width="80"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </Box>
          )} */}

          <>

            {!userDiviChief && (
              <>
                <CustomTabComponent
                  tabOptions={feedbackTabOptions}
                  onChange={setActiveTab}
                />
                <Divider />
              </>
            )}

            <Stack gap={1.8} maxHeight={"60vh"} overflow={"auto"} pr={1}>

              {commentCount === 0 && (
                <Box
                  sx={{
                    height: "73vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NoResultComponent />{" "}
                </Box>
              )}

              {activeTab === 0 &&
                comments?.map(({ comment_id, comment, created_at, user, activity_id }) => {
                  const { name } = user
                  return <>

                    <CommentContainerComponent
                      key={comment_id}
                      name={name}
                      comment={comment}
                      // area_code={area_code}
                      date={created_at}
                      isActivity
                      handleClick={() => navigate(`aop/activities/${activity_id}`)}
                    />

                  </>
                })
              }

              {
                activeTab !== 0 &&
                remarks?.map(({ id, approver_user, remarks, created_at }) => {

                  const { name, role } = approver_user || {};

                  return <>
                    <CommentContainerComponent
                      key={id}
                      name={name}
                      comment={remarks}
                      area_code={role}
                      date={created_at}
                    />
                  </>
                })

              }

            </Stack>
          </>


        </Stack >
      }
    />
  );
};
