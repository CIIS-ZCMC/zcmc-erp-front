import { Fragment, useEffect, useMemo, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Checkbox, Grid, Stack, Typography } from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import {
  useAOPApplication,
  useAOPApplicationObjectives,
  useAOPApplicationsActions,
  useAOPPermissions,
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
import ProcessAOPContent from "./Contents/ProcessAOPContent";
import { useApprovalActions } from "../../../Hooks/AOP/AOPApprovalHook";
import { OpenInNew } from "@mui/icons-material";
import { MarkReviewFooter } from "./Contents/MarkReviewFooter";

export default function ManageAOP() {
  // const { isPlanning, isMCC } = useUserTypes();

  const apiPermissions = useAOPPermissions();

  const isPlanningOfficer = apiPermissions?.is_planning;
  const isMCCOfficer = apiPermissions?.is_mcc;

  const { getAOPApprovalTimeline } = useApprovalActions();
  const { id: AOP_APPLICATION_ID } = useParams();
  const { getAOPApplicationById } = useAOPApplicationsActions();
  const navigate = useNavigate();
  // COMMENTS HOOK
  const { getCommentsByApplication, getRemarksByApplication } =
    useCommentActions();

  const allComments = useComments() ?? localStorageGetter("comments");

  const AOPApplication = useAOPApplication();
  const objectives = useAOPApplicationObjectives();
  const remarks = useRemarks();
  const hasDispense = useHasDispense();

  const allReviewed = Boolean(
    objectives?.length &&
    objectives.every(
      (obj) =>
        Array.isArray(obj.activities) &&
        obj.activities.length > 0 &&
        obj.activities.every((a) => a.is_reviewed),
    ),
  );

  // ACTIVITY ID
  // ✅ SAFE DERIVATION
  const defaultActivityId = objectives?.[0]?.activities?.[0]?.id ?? null;

  // STATES
  const [isRemarksLoading, setIsRemarksLoading] = useState(true);
  const [openMarkModal, setOpenMarkModal] = useState(false);

  const AREA_CODE = AOPApplication?.area_code;
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

  const isAllowedFeedbackViewing = !isMCCOfficer;

  useEffect(() => {
    if (!AOP_APPLICATION_ID) return;

    getAOPApplicationById(AOP_APPLICATION_ID);
    getAOPApprovalTimeline(AOP_APPLICATION_ID);
  }, [AOP_APPLICATION_ID]);

  // useEffect(() => {
  //   if (!defaultActivityId) return;

  //   getActivityById(defaultActivityId);
  // }, [defaultActivityId]);

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
          withArrowBack
          onClickArrow={() => navigate("/approval")}
        />
        {/* CONTENT */}
        <Box
        // sx={{
        //   backgroundColor: "white",
        //   borderRadius: 12,
        //   border: 1,
        //   borderColor: "neutral.100",
        //   padding: 0,
        // }}
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
                <Typography level="body-xs" mb={1}>
                  To view the Project Procurement Management Plan for this AOP,
                  click the button below.
                </Typography>
                <Stack spacing={2} direction={!hasDispense ? "column" : "row"}>
                  <ButtonComponent
                    label={`Open PPMP`}
                    fullWidth={true}
                    variant={"soft"}
                    size={"sm"}
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
                  <Stack>
                    <Typography sx={{ mb: 1 }}>
                      Collapse an objective and select one of its activities to
                      view more information.
                    </Typography>
                    {isPlanningOfficer && (
                      <MarkReviewFooter
                        setOpenMarkModal={setOpenMarkModal}
                        openMarkModal={openMarkModal}
                        allReviewed={allReviewed}
                        isMarkAll
                      />
                    )}
                  </Stack>
                }
                footer={
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent={"space-between"}
                  >
                    {isAllowedFeedbackViewing && (
                      <ButtonComponent
                        variant={"outlined"}
                        label={`Go to feedback`}
                        endDecorator={<ExternalLink size={14} />}
                        onClick={handleViewFeedback}
                        fullWidth={true}
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
            <Grid item="true" xs={!isPlanningOfficer ? 8 : 4} mt={3}>
              <ActivityDetails />
            </Grid>

            {/* COMMENTS  */}
            <Grid
              item="true"
              xs={4}
              mt={3}
              display={!isPlanningOfficer && "none"}
            >
              <CommentsDetails />
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {openFeedbackModal && (
        <FeedbackContent
          openFeedbackModal={openFeedbackModal}
          setOpenFeedbackModal={setOpenFeedbackModal}
          isLoading={isRemarksLoading}
          isActivity={false}
        />
      )}
    </Fragment>
  );
}
