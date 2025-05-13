import { Fragment, useEffect, useMemo, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useParams } from "react-router-dom";
import { approvalActions } from "../../../Data/constants";
import { Box, Divider, Grid, Stack, Typography } from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import moment from "moment";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import InputComponent from "../../../Components/Form/InputComponent";
import { useAOPApplication } from "../../../Hooks/AOP/AOPApplicationsHook";
import { useActivityActions } from "../../../Hooks/AOP/ActivityHook";
import { localStorageGetter } from "../../../Utils/LocalStorage";
import RadioButtonComponent from "../../../Components/Common/RadioButtonComponent";
import PostCommentComponent from "../../../Components/Form/PostCommentComponent";
import ObjectivesList from "./Contents/ObjectivesList";
import NoResultComponent from "../../../Components/Common/Table/NoResultComponent";
import DrawerComponent from "../../../Components/Common/DrawerComponent";
import CustomTabComponent from "../../../Components/Common/CustomTabComponent";
import { feedbackTabOptions } from "../../../Data/Options";
import {
  useAllComments,
  useCommentActions,
  useRemarks,
} from "../../../Hooks/CommentHook";
import CommentContainerComponent from "../../../Components/Comments/CommentContainerComponent";
import { groupByDate } from "../../../Utils/GroupData";
import { ActivityDetails } from "./Contents/ActivityDetails";
import { CommentsDetails } from "./Contents/CommentsDetails";

export default function ManageAOP() {
  const { id } = useParams();

  // AOP HOOK
  const AOPApplication =
    useAOPApplication() ?? localStorageGetter("aopApplication");
  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");

  // ACTIVITY HOOK
  const defaultActivityId = AOPApplication[0]?.activities[0]?.id;
  const activityId = localStorageGetter("activeActivityId");
  const { getActivityById } = useActivityActions();

  // COMMENTS HOOK
  const remarks = useRemarks();
  const {
    getCommentsByActivity,
    getCommentsByApplication,
    getRemarksByApplication,
  } = useCommentActions();
  const allComments = useAllComments();

  // STATES
  // const [activityLoading, setActivityLoading] = useState(false);
  const [action, setAction] = useState("approve");
  const [activeTab, setActiveTab] = useState(0);

  const AREA_CODE = localStorageGetter("aop_application_area_code");
  const FISCAL_YEAR = 2026;

  // MODAL
  const { setAlertDialog } = useModalHook();
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  // DATA
  const feedbackDisplay = useMemo(() => {
    const dataToDisplay = activeTab === 0 ? allComments : remarks;
    return groupByDate(dataToDisplay);
  }, [activeTab, allComments, remarks]);

  const feedbackCount = allComments?.length;

  // FUNCTIONS
  const handleViewFeedback = () => {
    setOpenFeedbackModal(true);
    getCommentsByApplication(() => {});

    getRemarksByApplication(() => {});
  };

  const handleProcessRequest = () => {
    setOpenProcessModal(true);
  };

  const handleShowAlert = () => {
    const data = {
      status: 200,
      title: "AOP request for F.Y. “2026” successfully approved.",
      description:
        "Everyone can now see the changes you’ve made. The request is now ready for processing of the next approving body (Division Chief).",
    };
    setOpenProcessModal(false);
    setAlertDialog(data);
  };

  // const handleClickComment = (id) => {
  //   Promise.all([
  //     getActivityById(id, () => {}),
  //     getCommentsByActivity(id, () => {}),
  //   ])
  //     .then(() => {
  //       setOpenFeedbackModal(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };

  const isDivisionHead = false;

  useEffect(() => {
    if (activityId == defaultActivityId) return;

    Promise.all([
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
              AOP <Typography textColor={"warning.400"}>#{id} </Typography>
              for Fiscal year{" "}
              <Typography textColor={"warning.400"}>{FISCAL_YEAR}'s</Typography>
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
              minHeight: "84vh",
              height: "84vh",
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
                    <ButtonComponent
                      variant={"outlined"}
                      label={`Go to feedback (${allComments?.length})`}
                      endDecorator={<ExternalLink size={14} />}
                      onClick={handleViewFeedback}
                    />
                    <ButtonComponent
                      label={"Process request"}
                      onClick={handleProcessRequest}
                    />
                  </Stack>
                }
                scrollable
                contentMaxHeight={"62vh"}
                contentMinHeight={"62vh"}
              >
                <ObjectivesList />
              </ContainerComponent>
            </Grid>

            {/* ACTIVITY DETAILS  */}
            <Grid item="true" xs={4} mt={3}>
              <ActivityDetails />
            </Grid>

            {/* COMMENTS  */}
            <Grid item="true" xs={4} mt={3}>
              <CommentsDetails />
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {/* PROCESS REQUEST */}
      <ModalComponent
        hasActionButtons
        isOpen={openProcessModal}
        handleClose={() => setOpenProcessModal(false)}
        title={`Process request `}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        }
        leftButtonLabel="Back to request"
        rightButtonLabel="Confirm and save"
        rightButtonAction={handleShowAlert}
        maxWidth={500}
        content={
          <Stack gap={2}>
            <Stack py={2}>
              <Typography level="title-sm" mb={1}>
                Select the action you would like to take:
              </Typography>
              <RadioButtonComponent
                actions={approvalActions}
                value={action}
                setValue={setAction}
              />
              {isDivisionHead && (
                <TextareaComponent
                  minRows={2}
                  label={"Remarks"}
                  maxRows={200}
                  placeholder={"Enter your remarks here"}
                />
              )}
            </Stack>

            <Divider />
            <InputComponent
              type="password"
              label="Authorization pin"
              helperText={
                "Confirm you action by typing-in your authorization PIN."
              }
              // setValue={handlePinInput}
              // value={pin}
            />
          </Stack>
        }
      />

      {/* VIEW FEEDBACK */}
      <DrawerComponent
        open={openFeedbackModal}
        setOpen={setOpenFeedbackModal}
        title={`Feedback in this request`}
        description={
          "The following list of feedback are based on your comments per activity and the Division Chief's remarks for this request as a whole."
        }
        content={
          <Stack gap={2} mt={2}>
            <CustomTabComponent
              tabOptions={feedbackTabOptions}
              onChange={setActiveTab}
            />

            <Divider />

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

              {Object.entries(feedbackDisplay).map(([date, messages], key) => (
                <Fragment key={key}>
                  {date !== moment().format("dddd, MMMM D") && (
                    <Divider sx={{ fontSize: "xs", mt: 0.5 }}>{date}</Divider>
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
              ))}
            </Stack>
          </Stack>
        }
      />
    </Fragment>
  );
}
