import { Fragment, useEffect, useMemo, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink, Info, MessageSquare } from "lucide-react";
import { formatPeso } from "@Utils/FormatPeso";
import {
  getAOPCardColorScheme,
  getStatusColorScheme,
} from "../../../Utils/ColorScheme";
import {
  useAOPApplication,
  useAOPApplicationObjectives,
  useAOPApplicationsActions,
  useAOPPermissions,
  useHasDispense,
  useLoadingState,
} from "../../../Hooks/AOP/AOPApplicationsHook";
import { ListSkeleton } from "@Components/Common/Loading/SkeletonLoader";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
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
import {
  useApprovalActions,
  useApprovalTimeline,
} from "../../../Hooks/AOP/AOPApprovalHook";
import {
  AssignmentOutlined,
  BuildOutlined,
  CheckOutlined,
  CreateOutlined,
  ExtensionOutlined,
  KeyboardReturnOutlined,
  LightbulbOutlined,
  OpenInNew,
  PendingActions,
  PeopleOutlined,
  UndoOutlined,
} from "@mui/icons-material";
import { MarkReviewFooter } from "./Contents/MarkReviewFooter";
import CardComponent from "@Components/Common/Card/CardComponent";
import { blue, grey, red } from "@mui/material/colors";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import DrawerComponent from "../../../Components/Common/DrawerComponent";
import StepperComponent from "../../../Components/Stepper/StepperComponent";
import moment from "moment";

import ObjectivesCard from "../EndUser/status/ObjectivesCard";
import ActivitiesCard from "../EndUser/status/ActivitiesCard";
import ResourcesCard from "../EndUser/status/ResourcesCard";
import ResponsiblePersonCard from "../EndUser/status/ResponsiblePersonCard";
import CostCard from "../EndUser/status/CostCard";
import AccordionComponent from "@Components/Common/AccordionComponent";
import AccordionSummary from "../EndUser/accordion/Objectives/AccordionSummary";
import AccordionDetails from "../EndUser/accordion/Objectives/AccordionDetails";
import ChipComponent from "@Components/Common/ChipComponent";
import { AOP_SUMMARY } from "../../../Data/constants";
import { useAopApplication } from "@Store/ObjectivesStore";

export default function ManageAOP() {
  const isLoading = useLoadingState();
  const apiPermissions = useAOPPermissions();

  const isPlanningOfficer = apiPermissions?.is_planning;
  const isMCCOfficer = apiPermissions?.is_mcc;

  const { getAOPApprovalTimeline } = useApprovalActions();
  const approvalTimeline = useApprovalTimeline();
  const { id: AOP_APPLICATION_ID } = useParams();
  const { getAOPApplicationById } = useAOPApplicationsActions();
  const navigate = useNavigate();
  // COMMENTS HOOK
  const { getCommentsByApplication, getRemarksByApplication } =
    useCommentActions();

  const allComments = useComments() ?? localStorageGetter("comments");

  const aopApplicationObjectives = useAOPApplicationObjectives();
  const aopApplication = useAOPApplication();
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

  // STATES
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [isRemarksLoading, setIsRemarksLoading] = useState(true);
  const [openMarkModal, setOpenMarkModal] = useState(false);
  const [openTimelineModal, setOpenTimelineModal] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [expandedObjective, setExpandedObjective] = useState(null);
  const [targetActivityId, setTargetActivityId] = useState(null);

  const FISCAL_YEAR = new Date().getFullYear() + 1;

  // FUNCTIONS
  const handleSelectActivityFromFeedback = (commentItem) => {
    const actId = commentItem?.activity_id;
    const actName = commentItem?.activity_name;

    const foundObj = aopApplicationObjectives?.find((obj) =>
      obj.activities?.some(
        (act) =>
          (actId && (act.id == actId || act.activity_id == actId)) ||
          (actName && (act.name === actName || act.activity_name === actName))
      )
    );

    const foundAct = foundObj?.activities?.find(
      (act) =>
        (actId && (act.id == actId || act.activity_id == actId)) ||
        (actName && (act.name === actName || act.activity_name === actName))
    );

    const targetObjId = foundObj?.id;
    const targetActId = foundAct?.id || actId;

    if (targetObjId) {
      setExpandedObjective(targetObjId);
    }
    if (targetActId) {
      setTargetActivityId(targetActId);
      setTimeout(() => {
        const el = document.getElementById(`activity-accordion-${targetActId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350);
    }
  };

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

  const handleViewTimeline = () => {
    setOpenTimelineModal(true);
    setIsTimelineLoading(true);
    getAOPApprovalTimeline(AOP_APPLICATION_ID, () => {
      setIsTimelineLoading(false);
    });
  };

  const isAllowedFeedbackViewing = !isMCCOfficer;

  // DYNAMIC AOP CARD COLOR SCHEME & ICON
  const cardTheme = useMemo(() => {
    const statusText = aopApplication?.status || "Pending";
    const theme = getAOPCardColorScheme(statusText);
    const s = statusText.toLowerCase();

    let icon = <PendingActions sx={{ fontSize: 32 }} color="warning" />;
    if (s.includes("returned")) {
      icon = <KeyboardReturnOutlined sx={{ fontSize: 32 }} color="danger" />;
    } else if (s.includes("approved")) {
      icon = <CheckOutlined sx={{ fontSize: 32 }} color="success" />;
    } else if (s.includes("awaiting")) {
      icon = <CreateOutlined sx={{ fontSize: 32 }} color="primary" />;
    }

    return {
      ...theme,
      icon,
      statusTitle: statusText,
      description:
        aopApplication?.status_description || theme.defaultDescription,
    };
  }, [aopApplication?.status, aopApplication?.status_description]);

  useEffect(() => {
    if (!AOP_APPLICATION_ID) return;

    getAOPApplicationById(AOP_APPLICATION_ID);
    getAOPApprovalTimeline(AOP_APPLICATION_ID);
  }, [AOP_APPLICATION_ID]);

  return (
    <Fragment>
      <Stack gap={2.5} pb={2}>
        <PageTitle
          title={
            <Typography>
              AOP for Fiscal Year{" "}
              <Typography textColor={"primary.600"}>{FISCAL_YEAR}</Typography>
            </Typography>
          }
          description={
            "The following below serves as the summary of the department’s AOP request."
          }
          items={[
            {
              label: aopApplication?.area_from,
              current: true,
            },
          ]}
          actions={
            <Stack direction="row" spacing={1.5} alignItems="center">
              <ProcessAOPContent />
            </Stack>
          }
          withArrowBack
          onClickArrow={() => navigate("/approval")}
        />

        {/* TOP ROW: STATUS CARD + METADATA BOX + TOP ACTION BUTTONS */}
        <Grid
          container
          spacing={2}
          columns={{ xs: 12, md: 12, lg: 12 }}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* AOP STATUS CARD */}
          <Grid item xs={12} md={5} lg={4.5}>
            <CardComponent
              statusColor={cardTheme.statusColor}
              bgcolor={cardTheme.bgcolor}
              cardBody={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      flexShrink: 0,
                      bgcolor: cardTheme.avatarBg,
                      color: cardTheme.iconColor,
                      width: 52,
                      height: 52,
                    }}
                    size="lg"
                  >
                    {cardTheme.icon}
                  </Avatar>
                  <Stack textAlign="left" spacing={0.3}>
                    <Typography
                      level="body-sm"
                      sx={{ color: cardTheme.labelColor, fontWeight: 600 }}
                    >
                      AOP Status
                    </Typography>
                    <Typography
                      level="h3"
                      sx={{
                        color: cardTheme.titleColor,
                        fontWeight: 600,
                        fontSize: { xs: "1.4rem", md: "1.6rem" },
                        lineHeight: 1.2,
                      }}
                    >
                      {cardTheme.statusTitle}
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: cardTheme.textColor,
                        mt: 0.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {cardTheme.description}
                    </Typography>
                  </Stack>
                </Stack>
              }
            />
          </Grid>

          {/* SUBMISSION METADATA BOX */}
          <Grid
            item
            xs={12}
            md={7.5}
            lg={7.5}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "center",
              height: "auto",
              width: "100%",
              backgroundColor: "white",
              gap: 2,
              borderRadius: "md",
              p: 1.5,
            }}
          >
            <Box
              bgcolor={grey[100]}
              sx={{
                p: 2,
                flex: 1,
                textAlign: "left",
                alignContent: "center",
                borderRadius: "md",
              }}
            >
              <Typography level="body-xs" color="neutral">
                SUBMITTED BY
              </Typography>
              <Typography
                level="body-sm"
                textColor="primary.700"
                fontWeight={700}
              >
                {aopApplication?.area_from}
              </Typography>
            </Box>
            <Box
              bgcolor={grey[100]}
              sx={{
                pl: 2,
                flex: 1,
                textAlign: "left",
                alignContent: "center",
                borderRadius: "md",
              }}
            >
              <Typography level="body-xs" color="neutral">
                DATE SUBMITTED
              </Typography>
              <Typography
                level="body-sm"
                textColor="primary.700"
                fontWeight={700}
                mt={0.5}
              >
                {isLoading ? (
                  <CircularProgress size="sm" />
                ) : aopApplication?.date_submitted ? (
                  moment(aopApplication.date_submitted).format("MMMM DD, YYYY")
                ) : (
                  "October 30, 2025"
                )}
              </Typography>
            </Box>
            <Box
              bgcolor={grey[100]}
              sx={{
                pl: 2,
                flex: 1,
                textAlign: "left",
                alignContent: "center",
                borderRadius: "md",
              }}
            >
              <Typography level="body-xs" color="neutral">
                DAYS PENDING
              </Typography>
              <Typography
                level="body-sm"
                textColor="primary.700"
                fontWeight={700}
                mt={0.5}
              >
                {isLoading ? (
                  <CircularProgress size="sm" />
                ) : aopApplication?.days_pending ? (
                  `${aopApplication.days_pending} Days`
                ) : (
                  "3 Days"
                )}
              </Typography>
            </Box>
            <Stack spacing={1.5} justifyContent="center" height="100%">
              <ButtonComponent
                variant="soft"
                color="primary"
                label="Approval Timeline"
                startDecorator={<AssignmentOutlined sx={{ fontSize: 18 }} />}
                onClick={handleViewTimeline}
                isLoading={isTimelineLoading}
                fullWidth
              />
              {isAllowedFeedbackViewing && (
                <ButtonComponent
                  variant="soft"
                  color="primary"
                  label="All Feedback"
                  startDecorator={<MessageSquare size={16} />}
                  endDecorator={
                    <Box
                      sx={{
                        bgcolor: "white",
                        color: "primary.700",
                        borderRadius: "50%",
                        minWidth: 22,
                        height: 22,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        px: 0.5,
                        ml: "auto",
                      }}
                    >
                      {aopApplication?.counts?.feedbacks_count}
                    </Box>
                  }
                  onClick={handleViewFeedback}
                  fullWidth
                  sx={{
                    borderRadius: 10,
                    height: 42,
                    fontSize: 13,
                    fontWeight: 700,
                    justifyContent: "space-between",
                  }}
                />
              )}
            </Stack>
          </Grid>

          {/* TOP ACTION BUTTONS */}
          <Grid item xs={12} md={3} lg={2.5}></Grid>
        </Grid>

        {/* 5 KPI SUMMARY CARDS */}
        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 10, lg: 5 }}>
          {/* CARD 1: OBJECTIVES */}
          <Grid item xs={12} sm={6} md={2} lg={1}>
            <ObjectivesCard
              hasFunction={true}
              objectiveCount={aopApplication?.counts?.objectives_count}
              successIndicatorCount={
                aopApplication?.counts?.unified_success_indicators_count
              }
              handleNavigate={() =>
                navigate(`/approval/view-ppmp/${AOP_APPLICATION_ID}/regular`)
              }
            />
          </Grid>

          {/* CARD 2: ACTIVITIES */}
          <Grid item xs={12} sm={6} md={2} lg={1}>
            <ActivitiesCard
              activitiesCount={aopApplication?.counts?.activities_count}
              gadActivitiesCount={aopApplication?.counts?.gad_activities_count}
              nonGadActivitiesCount={
                aopApplication?.counts?.non_gad_activities_count
              }
            />
          </Grid>

          {/* CARD 3: RESOURCES */}
          <Grid item xs={12} sm={6} md={2} lg={1}>
            <ResourcesCard
              resourcesCount={aopApplication?.counts?.resources_count}
              totalCost={aopApplication?.counts?.total_cost}
              aop={aopApplication}
            />
          </Grid>

          {/* CARD 4: RESPONSIBLE PERSONS */}
          <Grid item xs={12} sm={6} md={2} lg={1}>
            <ResponsiblePersonCard
              PersonsCount={aopApplication?.counts?.responsible_people_count}
              designationCount={aopApplication?.counts?.designations_only}
              usersCount={aopApplication?.counts?.users_only}
            />
          </Grid>

          {/* CARD 5: TOTAL COST */}
          <Grid item xs={12} sm={6} md={2} lg={1}>
            <CostCard totalCost={aopApplication?.ppmp_total || 0} />
          </Grid>
        </Grid>

        {/* DETAILED BREAKDOWN ACCORDION */}
        <BoxComponent p={0}>
          <Grid
            xs={12}
            bgcolor="#004366"
            sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
            p={2}
          >
            <Grid xs={12}>
              <Typography textColor={"white"}>
                {AOP_SUMMARY?.SUMMARY_TITLE ||
                  "Detailed Breakdown: Objectives, Activities, Resources & Personnel"}
              </Typography>
            </Grid>
          </Grid>

          <Grid container>
            <Grid xs={12}>
              <Box p={1.5}>
                {isLoading ? (
                  <ListSkeleton rows={4} />
                ) : aopApplicationObjectives?.length === 0 ? (
                  <Stack alignItems="center" p={4}>
                    <Typography level="body-sm" color="neutral">
                      No objectives found for this application.
                    </Typography>
                  </Stack>
                ) : (
                  aopApplicationObjectives?.map((item, index) => {
                    const id = item.id;
                    const objective = item.objective;
                    const function_description = item.function_description;
                    const activities = item.activities || [];

                    const description =
                      typeof objective === "object"
                        ? objective?.description || objective?.name
                        : objective ||
                          function_description ||
                          `Objective #${index + 1}`;

                    const activities_count = activities?.length ?? 0;

                    const objectiveIndex = index + 1;

                    return (
                      <AccordionComponent
                        key={id || index}
                        expanded={expandedObjective === id}
                        onChange={(event, isExpanded) =>
                          setExpandedObjective(isExpanded ? id : null)
                        }
                        expandedStyles={{ mb: 2 }}
                        summaryStyles={(expanded) => ({
                          bgcolor: expanded ? "#E0F5FF" : "background.body",
                        })}
                        accordionSummary={
                          <AccordionSummary
                            index={objectiveIndex}
                            objectiveName={description}
                            activitiesCount={activities_count}
                            cost={activities?.reduce(
                              (acc, activity) =>
                                acc + (activity.counts?.total_cost || 0),
                              0,
                            )}
                          />
                        }
                        accordionDetails={
                          <>
                            {activities.length === 0 && (
                              <Stack alignItems="center">
                                <Typography
                                  p={4}
                                  textAlign={"center"}
                                  level="body-sm"
                                  whiteSpace="pre-wrap"
                                >
                                  No activities added yet.
                                  <br />
                                  Activities define what your unit will do to
                                  achieve this objective.
                                </Typography>
                              </Stack>
                            )}

                            <AccordionDetails
                              objId={id}
                              activities={activities}
                              withActivityBtn={false}
                              targetActivityId={targetActivityId}
                            />
                          </>
                        }
                      />
                    );
                  })
                )}
              </Box>
            </Grid>
          </Grid>
        </BoxComponent>

        {/* FLOATING APPROVAL DECISION BAR */}
        <Box
          sx={{
            position: "sticky",
            bottom: 10,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            bgcolor: "white",
            borderRadius: 16,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.12)",
            border: "1px solid",
            borderColor: "neutral.200",
            p: 2.5,
            px: 3.5,
            zIndex: 1000,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.3}>
            <Typography level="title-sm" fontWeight={700}>
              Ready to make a decision?
            </Typography>
            <Typography level="body-xs" textColor="neutral.500">
              Ensure you've reviewed all objectives, activities, resources, and
              feedback before proceeding.
            </Typography>
          </Stack>

          <Box sx={{ minWidth: 180 }}>
            <ProcessAOPContent
              label="Process Request"
              buttonSx={{
                bgcolor: "#005596",
                ":hover": { bgcolor: "#004073" },
                borderRadius: 8,
                height: 44,
                px: 3.5,
                fontWeight: 600,
                fontSize: 14,
              }}
              fullWidth={false}
            />
          </Box>
        </Box>
      </Stack>

      {openFeedbackModal && (
        <FeedbackContent
          openFeedbackModal={openFeedbackModal}
          setOpenFeedbackModal={setOpenFeedbackModal}
          isLoading={isRemarksLoading}
          isActivity={false}
          onSelectActivity={handleSelectActivityFromFeedback}
        />
      )}

      {openTimelineModal && (
        <DrawerComponent
          open={openTimelineModal}
          setOpen={setOpenTimelineModal}
          title={`Approval timeline for this Application`}
          description={
            "The list below shows the current status of the request."
          }
          content={
            <Stack mt={2}>
              {isTimelineLoading ? (
                <ThreeDotsLoader />
              ) : (
                <StepperComponent data={approvalTimeline} />
              )}
            </Stack>
          }
        />
      )}
    </Fragment>
  );
}
