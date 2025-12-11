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
  isActivity = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { isDivisionHead, isPlanning } = useUserTypes();

  useEffect(() => {
    console.log(isDivisionHead);
  }, [isDivisionHead]);


  // COMMENTS HOOK
  const remarks = useRemarks();
  const allComments = localStorageGetter("comments");

  // DATA
  const feedbackDisplay = useMemo(() => {
    let dataToDisplay;

    if (isPlanning) {
      dataToDisplay = remarks?.map((r) => ({ ...r, __type: "remark" }));
    } else {
      if (activeTab === 0) {
        dataToDisplay = allComments?.map((c) => ({ ...c, __type: "comment" }));
      } else {
        dataToDisplay = remarks?.map((r) => ({ ...r, __type: "remark" }));
      }
    }

    return groupByDate(dataToDisplay ?? []);
  }, [activeTab, allComments, isPlanning, remarks]);

  const feedbackCount =
    activeTab === 0
      ? Array.isArray(allComments)
        ? allComments?.length
        : 0
      : remarks?.length;

  useEffect(() => {
    if (isPlanning) {
      setActiveTab(1); // Switch to Remarks tab
    }
  }, [isPlanning]);

  useEffect(() => {
    console.log(isDivisionHead)
    console.log(feedbackDisplay)
  }, [isDivisionHead, feedbackDisplay])

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
              {!isPlanning && (
                <>
                  <CustomTabComponent
                    tabOptions={feedbackTabOptions}
                    onChange={setActiveTab}
                  />
                  <Divider />
                </>
              )}

              <Stack gap={1.8} maxHeight={"60vh"} overflow={"auto"} pr={1}>
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
                    <Fragment key={`${date}-${key}`}>
                      {date !== moment().format("dddd, MMMM D") && (
                        <Divider sx={{ fontSize: "xs", mt: 0.5 }}>
                          {date}
                        </Divider>
                      )}

                      {/* COMMENTS TAB */}
                      {activeTab === 0 &&
                        messages
                          ?.filter((m) => m.__type === "comment")
                          .map(
                            ({ name, area_code, created_at, comment }, idx) => (
                              <CommentContainerComponent
                                key={idx}
                                name={name}
                                comment={comment}
                                area_code={area}
                                date={created_at}
                                isActivity={isActivity}
                              />
                            )
                          )}

                      {/* REMARKS TAB */}
                      {activeTab === 1 &&
                        messages
                          ?.filter((m) => m.__type === "remark")
                          .map(
                            (
                              {
                                division_chief_name,
                                current_area_name,
                                created_at,
                                remark,
                              },
                              idx
                            ) => (
                              <CommentContainerComponent
                                key={idx}
                                name={division_chief_name}
                                comment={remark}
                                area_code={current_area_name}
                                date={created_at}
                              />
                            )
                          )}
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
