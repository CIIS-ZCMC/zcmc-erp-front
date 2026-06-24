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
import { useAOPPermissions } from "@Hooks/AOP/AOPApplicationsHook";
import { useNavigate } from "react-router-dom";
import CommentsSkeleton from "@Components/Comments/CommentsSkeleton";

export const FeedbackContent = ({
  openFeedbackModal,
  setOpenFeedbackModal,
  isLoading,
  isActivity = false,
}) => {
  const apiPermissions = useAOPPermissions();
  const navigate = useNavigate();

  const isPlanningOfficer = apiPermissions?.is_planning;
  const [activeTab, setActiveTab] = useState(0);

  // COMMENTS HOOK
  const remarks = useRemarks();
  const allComments = localStorageGetter("all_comments");

  // DATA
  const feedbackDisplay = useMemo(() => {
    let dataToDisplay;

    if (isPlanningOfficer) {
      dataToDisplay = remarks?.map((r) => ({ ...r, __type: "remark" }));
    } else {
      if (activeTab === 0) {
        dataToDisplay = allComments?.map((c) => ({ ...c, __type: "comment" }));
      } else {
        dataToDisplay = remarks?.map((r) => ({ ...r, __type: "remark" }));
      }
    }

    return groupByDate(dataToDisplay ?? []);
  }, [activeTab, allComments, isPlanningOfficer, remarks]);

  const feedbackCount =
    activeTab === 0
      ? Array.isArray(allComments)
        ? allComments?.length
        : 0
      : remarks?.length;

  useEffect(() => {
    if (isPlanningOfficer) {
      setActiveTab(1); // Switch to Remarks tab
    }
  }, [isPlanningOfficer]);

  return (
    <DrawerComponent
      open={openFeedbackModal}
      setOpen={setOpenFeedbackModal}
      title={`Feedback in this request`}
      description={
        "The following list of feedback are based on your comments per activity and the Division Chief's remarks for this request as a whole."
      }
      content={
        <Stack gap={2}>
          {isLoading ? (
            <CommentsSkeleton />
          ) : (
            <>
              {!isPlanningOfficer && (
                <>
                  <CustomTabComponent
                    tabOptions={feedbackTabOptions}
                    onChange={setActiveTab}
                  />
                  <Divider />
                </>
              )}

              <Stack
                gap={1.8}
                maxHeight={"65vh"}
                overflow={"auto"}
                pr={1}
                pb={3}
              >
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
                            (
                              {
                                name,
                                area,
                                area_code,
                                created_at,
                                comment,
                                activity_name,
                                path,
                              },
                              idx,
                            ) => (
                              <CommentContainerComponent
                                key={idx}
                                name={name}
                                comment={comment}
                                area_code={area}
                                date={created_at}
                                isActivity={isActivity}
                                activityName={activity_name}
                                path={path}
                                withActivityPath={true}
                                handleClick={() => navigate(path)}
                              />
                            ),
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
                                area_name,
                                created_at,
                                remark,
                                action,
                                role,
                              },
                              idx,
                            ) => (
                              <CommentContainerComponent
                                key={idx}
                                name={division_chief_name}
                                comment={remark}
                                area_code={area_name}
                                date={created_at}
                                action={action}
                              />
                            ),
                          )}
                    </Fragment>
                  ),
                )}
              </Stack>
            </>
          )}
        </Stack>
      }
    />
  );
};
