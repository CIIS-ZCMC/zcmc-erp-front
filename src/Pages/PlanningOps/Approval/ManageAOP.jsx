import { Fragment, useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/joy";
import { useParams, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
;
import useObjectivesStore from "../../../Store/ObjectivesStore";

import useObjectivesHook from "../../../Hooks/ObjectivesHook";

import ObjectivesList from "./Contents/ObjectivesList";
import { ActivityDetails } from "./Contents/ActivityDetails";
import { CommentsDetails } from "./Contents/CommentsDetails";
import { FeedbackContent } from "./Contents/FeedbackContent";
import ProcessAOPContent from "./Contents/ProcessAOPContent";

export default function ManageAOP() {

  const params = useParams();
  const aopId = params.id;

  const { getObjectives } = useObjectivesHook();
  const { applicationObjectives } = useObjectivesStore();

  useEffect(() => {
    getObjectives(aopId, (status, message) => {
      return
    })
  }, [])

  const {
    current_user,
    objectives,
    processable,
    fiscal_year,
    status,
    status_id,
    latest_application_timeline,
    activity_comments,
    application_timelines,
  } = applicationObjectives;

  const { role, area_name } = current_user || {};
  const { id } = latest_application_timeline || {};

  // useEffect(() => {
  //   console.log('app timelines:', application_timelines)
  //   console.log('user role:', role)
  // }, [applicationObjectives, role]);

  const userMCC = role === 'MCC';
  const userPlanning = role === 'Planning Unit';

  // STATES
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  // FUNCTIONS
  const handleViewFeedback = () => {
    setOpenFeedbackModal(true);
  };

  const isAllowedFeedbackViewing = () => {
    return !userMCC;
  };

  const remarksCount = application_timelines?.length || 0;
  const commentCount = activity_comments?.length || 0;
  const feedbackCount = commentCount + remarksCount;

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Manage
              <Typography textColor={"warning.400"}>{area_name}'s</Typography>{" "}
              AOP
              {/* AOP <Typography textColor={"warning.400"}>#{id} </Typography> */}
              for Fiscal Year
              <Typography textColor={"warning.400"}>{fiscal_year}</Typography>
            </Typography>
          }
          description={
            "Each objective has its own list of activities. Mark each activity as reviewed and process the request to continue."
          }
        />
        {/* CONTENT */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 12,
            border: 1,
            borderColor: "neutral.100",
            padding: 0,
            pr: 2.5,
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
                        label={`Go to feedback (${feedbackCount})`}
                        endDecorator={<ExternalLink size={14} />}
                        onClick={handleViewFeedback}
                      />
                    )}

                    <ProcessAOPContent
                      processable={processable}
                      timelineId={id}
                      aopId={aopId}
                      role={role}
                    />

                  </Stack>
                }
                scrollable
                contentMaxHeight={"62vh"}
                contentMinHeight={"62vh"}
              >
                <ObjectivesList
                  objectives={objectives}
                />

              </ContainerComponent>
            </Grid>

            {/* ACTIVITY DETAILS  */}
            <Grid
              item="true"
              xs={!userPlanning ? 8 : 4}
              mt={3}
            >
              <ActivityDetails />
            </Grid>

            {/* COMMENTS  */}
            <Grid
              item="true"
              xs={4}
              mt={3}
              display={!userPlanning && "none"}
            >
              <CommentsDetails


              />
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {/* PROCESS REQUEST */}

      <FeedbackContent
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        comments={activity_comments}
        remarks={application_timelines}
        feedbackCount={feedbackCount}
        role={role}
      />
    </Fragment>
  );
}
