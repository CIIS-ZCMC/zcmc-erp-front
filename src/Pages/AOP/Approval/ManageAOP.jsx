import { Fragment, useEffect, useMemo, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Stack, Typography } from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import {
  useAOPApplication,
  useAOPApplicationObjectives,
  useAOPApplicationsActions,
  useHasDispense,
  useLoadingState,
} from "../../../Hooks/AOP/AOPApplicationsHook";
import { useActivityActions } from "../../../Hooks/AOP/ActivityHook";
import { localStorageGetter } from "../../../Utils/LocalStorage";
import ObjectivesList from "./Contents/ObjectivesList";
import {
  useAllComments,
  useCommentActions,
  useComments,
  useRemarks,
} from "../../../Hooks/CommentHook";
import { ActivityDetails } from "./Contents/ActivityDetails";
import { CommentsDetails } from "./Contents/CommentsDetails";
import { FeedbackContent } from "./Contents/FeedbackContent";
import { useUserTypes } from "../../../Store/AuthStore";
import ProcessAOPContent from "./Contents/ProcessAOPContent";
import { useApprovalActions } from "../../../Hooks/AOP/AOPApprovalHook";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { OpenInNew } from "@mui/icons-material";

export default function ManageAOP() {
  const { isPlanning, isMCC } = useUserTypes();
  const { getAOPApprovalTimeline } = useApprovalActions();
  const { id: AOP_APPLICATION_ID } = useParams();
  const { getAOPApplicationById } = useAOPApplicationsActions();
  const navigate = useNavigate();
  // COMMENTS HOOK
  const {
    getCommentsByActivity,
    getCommentsByApplication,
    getRemarksByApplication,
  } = useCommentActions();
  const { getActivityById } = useActivityActions();

  const allComments = useComments() ?? localStorageGetter("comments");
  const isLoading = useLoadingState();
  const AOPApplication = useAOPApplication();
  const objectives = useAOPApplicationObjectives();
  const remarks = useRemarks();
  const hasDispense = useHasDispense();

  // ACTIVITY ID
  // ✅ SAFE DERIVATION
  const defaultActivityId = objectives?.[0]?.activities?.[0]?.id ?? null;

  // STATES
  const [isRemarksLoading, setIsRemarksLoading] = useState(true);
  const AREA_CODE = AOPApplication?.area_from;
  const FISCAL_YEAR = new Date().getFullYear() + 1;
  // MODAL
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  // FUNCTIONS
  const handleViewFeedback = async () => {
    setOpenFeedbackModal(true);
    setIsRemarksLoading(true);

    try {
      await Promise.all([
        getCommentsByApplication(AOP_APPLICATION_ID, () => {}),
        getRemarksByApplication(AOP_APPLICATION_ID, () => {}),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRemarksLoading(false);
    }
  };

  const isAllowedFeedbackViewing = !isMCC;

  useEffect(() => {
    if (!AOP_APPLICATION_ID) return;

    getAOPApplicationById(AOP_APPLICATION_ID);
    getAOPApprovalTimeline(AOP_APPLICATION_ID);
    getCommentsByApplication(AOP_APPLICATION_ID);
    getRemarksByApplication(AOP_APPLICATION_ID);
  }, [AOP_APPLICATION_ID]);

  useEffect(() => {
    if (!defaultActivityId) return;

    Promise.all([
      getActivityById(defaultActivityId),
      getCommentsByActivity(defaultActivityId),
    ]).catch(console.error);
  }, [defaultActivityId]);

  return (
    <Fragment>
      {isLoading ? (
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          my={2}
          height={"85vh"}
        >
          <ThreeDotsLoader />
        </Stack>
      ) : (
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
            withArrowBack
            onClickArrow={() => navigate("/approval")}
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
                    To view the Project Procurement Management Plan for this
                    AOP, click the button below.
                  </Typography>
                  <Stack
                    spacing={2}
                    direction={!hasDispense ? "column" : "row"}
                  >
                    <ButtonComponent
                      label={`${AREA_CODE} PPMP`}
                      fullWidth={true}
                      variant={"soft"}
                      onClick={() =>
                        navigate(
                          `/approval/view-ppmp/${AOP_APPLICATION_ID}/${"regular"}`,
                        )
                      }
                      endDecorator={<OpenInNew />}
                    />
                    {hasDispense && (
                      <ButtonComponent
                        label="Dispensing PPMP"
                        fullWidth={true}
                        variant={"soft"}
                        onClick={() =>
                          navigate(
                            `/approval/view-ppmp/${AOP_APPLICATION_ID}/${"dispensed"}`,
                          )
                        }
                        endDecorator={<OpenInNew />}
                      />
                    )}
                  </Stack>
                </ContainerComponent>
                <ContainerComponent
                  title={"List of objectives and activities"}
                  description={
                    "Collapse an objective and select one of its activities to view more information."
                  }
                  footer={
                    <Stack direction={"row"} spacing={2}>
                      {isAllowedFeedbackViewing && (
                        <ButtonComponent
                          variant={"outlined"}
                          label={`Go to feedback (${
                            isPlanning ? remarks?.length : allComments?.length
                          })`}
                          endDecorator={<ExternalLink size={14} />}
                          onClick={handleViewFeedback}
                        />
                      )}
                      {/* PROCESS REQUEST */}

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
      )}

      <FeedbackContent
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        isLoading={isRemarksLoading}
        isActivity={false}
      />
    </Fragment>
  );
}
