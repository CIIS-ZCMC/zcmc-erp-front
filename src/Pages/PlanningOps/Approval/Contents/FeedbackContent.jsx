import React, { Fragment, useMemo, useState } from "react";
import { useAllComments, useRemarks } from "../../../../Hooks/CommentHook";
import { useUserTypes } from "../../../../Hooks/UserHook";
import { groupByDate } from "../../../../Utils/GroupData";
import { feedbackTabOptions } from "../../../../Data/Options";
import moment from "moment";
import { Box, Divider, Stack } from "@mui/joy";
import CustomTabComponent from "../../../../Components/Common/CustomTabComponent";
import NoResultComponent from "../../../../Components/Common/Table/NoResultComponent";
import CommentContainerComponent from "../../../../Components/Comments/CommentContainerComponent";
import DrawerComponent from "../../../../Components/Common/DrawerComponent";
import { ThreeDots } from "react-loader-spinner";

export const FeedbackContent = ({
  openFeedbackModal,
  setOpenFeedbackModal,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { isDivisionHead } = useUserTypes();

  // COMMENTS HOOK
  const remarks = useRemarks();
  const allComments = useAllComments();

  // DATA
  const feedbackDisplay = useMemo(() => {
    const dataToDisplay = isDivisionHead
      ? remarks
      : activeTab === 0
      ? allComments
      : remarks;
    return groupByDate(dataToDisplay);
  }, [activeTab, allComments, isDivisionHead, remarks]);

  const feedbackCount = allComments?.length;

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
          {isLoading ? (
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
          ) : (
            <>
              {!isDivisionHead && (
                <>
                  <CustomTabComponent
                    tabOptions={feedbackTabOptions}
                    onChange={setActiveTab}
                  />
                  <Divider />
                </>
              )}
              <Stack gap={1.8} maxHeight={"70vh"} overflow={"auto"} pr={1}>
                {feedbackCount === 0 && (
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
                {Object.entries(feedbackDisplay).map(
                  ([date, messages], key) => (
                    <Fragment key={key}>
                      {date !== moment().format("dddd, MMMM D") && (
                        <Divider sx={{ fontSize: "xs", mt: 0.5 }}>
                          {date}
                        </Divider>
                      )}

                      {/* COMMENTS */}
                      {activeTab === 0
                        ? messages?.map(
                            ({ name, area_code, created_at, comment }, key) => (
                              <CommentContainerComponent
                                key={key}
                                name={name}
                                comment={comment}
                                area_code={area_code}
                                date={created_at}
                                isActivity
                              />
                            )
                          )
                        : messages?.map(
                            (
                              {
                                division_chief_name,
                                division_chief_area_code,
                                created_at,
                                remarks,
                              },
                              key
                            ) => (
                              <CommentContainerComponent
                                key={key}
                                name={division_chief_name}
                                comment={remarks}
                                area_code={division_chief_area_code}
                                date={created_at}
                              />
                            )
                          )}
                      {/* REMARKS */}
                    </Fragment>
                  )
                )}
              </Stack>
            </>
          )}
        </Stack>
      }
    />
  );
};
