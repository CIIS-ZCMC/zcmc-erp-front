import { Fragment, useEffect, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Stack, Typography } from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import {
  useAOPApplication,
  useAOPApplicationObjectives,
} from "../../../Hooks/AOP/AOPApplicationsHook";
import { useActivityActions } from "../../../Hooks/AOP/ActivityHook";
import { localStorageGetter } from "../../../Utils/LocalStorage";
import ObjectivesList from "./Contents/ObjectivesList";
import {
  useAllComments,
  useCommentActions,
  useRemarks,
} from "../../../Hooks/CommentHook";
import { ActivityDetails } from "./Contents/ActivityDetails";
import { CommentsDetails } from "./Contents/CommentsDetails";

import { FeedbackContent } from "./Contents/FeedbackContent";
import { useUserTypes } from "../../../Store/AuthStore";
import ProcessAOPContent from "./Contents/ProcessAOPContent";
import { useApprovalActions } from "../../../Hooks/AOP/AOPApprovalHook";
import BoxComponent from "@Components/Common/Card/BoxComponent";

export default function ManageAOP() {
  const { isPlanning, isMCC } = useUserTypes();
  const { getAOPApprovalTimeline } = useApprovalActions();
  const AOPApplication = useAOPApplication();
  const navigate = useNavigate();

  // AOP HOOK
  const AOPApplicationObjectives =
    useAOPApplicationObjectives() ??
    localStorageGetter("aopApplicationObjectives");

  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");

  // ACTIVITY HOOK
  const defaultActivityId = AOPApplicationObjectives[0]?.activities[0]?.id;
  const activityId = localStorageGetter("activeActivityId");
  const { getActivityById } = useActivityActions();

  // COMMENTS HOOK
  const {
    getCommentsByActivity,
    getCommentsByApplication,
    getRemarksByApplication,
  } = useCommentActions();
  const allComments = useAllComments() ?? localStorageGetter("all_comments");

  const remarks = useRemarks();

  // STATES
  const [isRemarksLoading, setIsRemarksLoading] = useState(true);

  const AREA_CODE = localStorageGetter("aop_application_area_code");
  const FISCAL_YEAR = new Date().getFullYear() + 1;

  // MODAL
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  // FUNCTIONS
  const handleViewFeedback = () => {
    setOpenFeedbackModal(true);
    setIsRemarksLoading(true);

    const fetch = () => {
      // if (!isDivisionHead || !isMCC) {
      getCommentsByApplication(AOP_APPLICATION_ID, () => {});
      // }

      getRemarksByApplication(AOP_APPLICATION_ID, () => {
        setTimeout(() => setIsRemarksLoading(false), 1000);
      });
    };

    Promise.all(fetch())
      .then(() => {
        setIsRemarksLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comments or remarks:", error);
        setIsRemarksLoading(false);
      });
  };

  const isAllowedFeedbackViewing = () => {
    return !isMCC;
  };

  useEffect(() => {
    if (activityId == defaultActivityId) return;

    Promise.all([
      getAOPApprovalTimeline(AOP_APPLICATION_ID, () => {}),
      getActivityById(defaultActivityId, () => {}),
      getCommentsByActivity(defaultActivityId, () => {}),
      getCommentsByApplication(AOP_APPLICATION_ID, () => {}),
    ]).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Manage{" "}
              <Typography textColor={"warning.400"}>{AREA_CODE}'s</Typography>{" "}
              AOP{" "}
              {/* AOP <Typography textColor={"warning.400"}>#{id} </Typography> */}
              for Fiscal Year{" "}
              <Typography textColor={"warning.400"}>{FISCAL_YEAR}</Typography>
            </Typography>
          }
          description={
            "Each objective has its own list of activities. Mark each activity as reviewed and process the request to continue."
          }
          items={[
            {
              label: "AOP",
              current: true,
            },
          ]}
        />
        {/* CONTENT */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 12,
            border: 1,
            borderColor: "neutral.100",
            padding: 0,
            pr: 1.5,
          }}
        >
          <Grid
            container
            columns={{ xs: 4, sm: 4, md: 4, lg: 12 }}
            columnSpacing={{ md: 0, lg: 3 }}
            rowSpacing={{ xs: 1, sm: 3, md: 1 }}
            sx={{
              minHeight: "85vh",
              height: "85vh",
              msOverflowY: "auto",
              overflowY: "auto",
            }}
          >
            {/* OBJECTIVES  */}
            <Grid item="true" xs={4} height={{ md: "auto", lg: "100%" }}>
              <ContainerComponent sx={{ mb: 1 }}>
                <Typography level="body-sm" mb={2}>
                  To view the <b>Project Procurement Management Plan</b> of{" "}
                  <b>{AREA_CODE}</b>, click the button below.
                </Typography>
                <ButtonComponent
                  label="View PPMP"
                  fullWidth={true}
                  variant={"soft"}
                  onClick={() =>
                    navigate(`/aop-approval/view-ppmp/${AOP_APPLICATION_ID}`)
                  }
                />
              </ContainerComponent>
              {console.log(allComments, remarks)}
              <ContainerComponent
                title={"List of objectives and activities"}
                description={
                  "Collapse an objective and select one of its activities to view more information."
                }
                footer={
                  <Stack direction={"row"} spacing={2}>
                    {isAllowedFeedbackViewing() && (
                      <ButtonComponent
                        variant={"outlined"}
                        label={`Go to feedback (${
                          isPlanning
                            ? allComments?.comments?.length
                            : remarks?.length
                        })`}
                        endDecorator={<ExternalLink size={14} />}
                        onClick={handleViewFeedback}
                      />
                    )}
                    <ProcessAOPContent />
                  </Stack>
                }
                scrollable
                contentMaxHeight={"46vh"}
                contentMinHeight={"46vh"}
              >
                <ObjectivesList />
              </ContainerComponent>
            </Grid>

            {/* ACTIVITY DETAILS  */}
            <Grid item="true" xs={!isPlanning ? 8 : 4} mt={3}>
              <ActivityDetails />
            </Grid>

            {/* COMMENTS  */}
            <Grid item="true" xs={4} mt={3} display={!isPlanning && "none"}>
              <CommentsDetails />
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {/* PROCESS REQUEST */}

      <FeedbackContent
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        isLoading={isRemarksLoading}
      />
    </Fragment>
  );
}
