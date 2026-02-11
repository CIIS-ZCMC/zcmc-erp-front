import { Box, Button, Grid, Stack, Typography } from "@mui/joy";

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";

import ButtonComponent from "@Components/Common/ButtonComponent";
import AlertDialogComponent from "@Components/Common/Dialog/AlertDialogComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";

import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import ChipComponent from "@Components/Common/ChipComponent";
import { FeedbackContent } from "../Approval/Contents/FeedbackContent";

import useAOPHook from "../../../Hooks/AOP/AOPHook";
import useModalHook from "../../../Hooks/ModalHook";
import useObjectivesHook from "../../../Hooks/ObjectivesHook";

import useObjectivesStore from "../../../Store/ObjectivesStore";
import useAOPStore, { useAOPActions } from "../../../Store/AOPStore";
import useFeedbackStore from "../../../Store/FeedbackStore";

import Title from "./Title/Title";
import Header from "./Header/Header";
import Draft from "./Mode/Draft";
import AOPEmpty from "./AOPEmpty";
import AOPEmptyObjectives from "./AOPEmptyObjectives";
import Timeline from "./Timeline/Timeline";
import Checklist from "./Checklist/Checklist";
import FiscalYearModal from "./Modal/FiscalYearModal";
import AOPDataSummary from "./AOPDataSummary";

import { ANNUAL_OPS } from "../../../Data/constants";
import {
  useCommentActions,
  useComments,
  useRemarks,
} from "../../../Hooks/CommentHook";
import TextareaComponent from "@Components/Form/TextareaComponent";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import { Edit } from "@mui/icons-material";

function DashboardEndUser(props) {
  const { header, description } = ANNUAL_OPS;

  const navigate = useNavigate();

  const { getObjectives } = useObjectivesHook();
  const { createAOP, getAopBySectorAndYear, getAopYearList, updateMission } =
    useAOPHook();
  const { setAlertDialog, closeAlertDialog } = useModalHook();
  const { showSnack } = useSnackbarHook();

  const { aop, mission, fiscalYear, yearDetails } = useAOPStore();
  const { setMission, clearMission } = useAOPActions();
  const { feedback } = useFeedbackStore();

  const [openFiscalYearModal, setOpenFiscalYearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAopLoading, setIsAopLoading] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updateMissionValue, setUpdateMissionValue] = useState("");

  const {
    getCommentsByActivity,
    getCommentsByApplication,
    getRemarksByApplication,
  } = useCommentActions();

  const allComments = useComments() ?? localStorageGetter("comments");

  const remarks = useRemarks();

  const { activity_comments, application_timelines, current_user } = feedback;

  const { role } = current_user || {};

  useEffect(() => {
    // console.log("user aop applications data", aop);
    // console.log('user aop applications data', aop)
    // console.log('user aop applications data', aop)
    // console.log('role', role);
    // console.log('feedback', feedback);
  }, [feedback, aop]);

  const remarksCount = application_timelines?.length || 0;
  const commentCount = activity_comments?.length || 0;
  const feedbackCount = commentCount + remarksCount;

  const handleClose = () => {
    setIsLoading(true);
    setTimeout(() => {
      // window.location.reload();
      clearMission();
      setOpenFiscalYearModal(false);
      closeAlertDialog();
      setIsLoading(false);
      navigate(0);
    }, 2000);
  };

  const handleOpenEdit = () => {
    setOpenEditModal(true);
    setUpdateMissionValue(mission);
  };

  const handleSaveAOP = async () => {
    setIsLoading(true);

    const body = {
      mission,
      year: fiscalYear,
    };

    try {
      await createAOP(body, (status, message) => {
        if (status === 200) {
          // console.log(`fiscal year: ${fiscalYear}, mission: ${mission}`);
          setIsLoading(false);
          handleClose();
        } else {
          setAlertDialog({
            status: "error",
            title: `${message}`,
            description: "Please try again later",
          });
          setIsLoading(false);
          console.error(" Failed to create aop:", message);
        }
      });
    } catch (error) {
      console.error("Error creatinh aop:", error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const handleSaveMission = async () => {
    if (!mission || mission.trim() === "") {
      setAlertDialog({
        status: "error",
        title: "Mission cannot be empty",
        description: "Please enter a valid mission statement",
      });
      return;
    }

    setIsLoading(true);

    const body = {
      mission: updateMissionValue,
    };

    try {
      await updateMission({ id: aop.id }, body, (status, message) => {
        if (status === 200) {
          showSnack(200, message);
          setIsLoading(false);
          setOpenEditModal(false);
        } else {
          setIsLoading(false);
          setAlertDialog({
            status: "error",
            title: message,
            description: "Failed to update mission. Please try again.",
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  useEffect(() => {
    setIsAopLoading(true);

    const params = { year: fiscalYear };

    getAopBySectorAndYear(params, (status, message) => {
      const success = status >= 200 && status < 300;

      if (!success) {
        // show error toast here
      }

      setIsAopLoading(false); // always executed
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    getAopYearList((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        setIsLoading(false);
        return; //Toast error
      }

      setIsLoading(false);
    });
  }, []);

  const { next_year_included, years } = yearDetails || {};

  const handleNavigateObjectives = () => {
    navigate(`/aop/objectives/${aop.id}`, {
      state: { aopId: aop.id }, // do not change state name
    });
  };

  const handleChangeFiscalYear = (e) => {
    // console.log(e)
    setIsLoading(true);
    const params = { year: e };

    getAopBySectorAndYear(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  };

  return (
    <Fragment>
      {isAopLoading ? (
        <>
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
        </>
      ) : aop ? (
        <Fragment>
          {/* Title here */}
          <Title />

          <BoxComponent
            mt={3}
            boxShadow={"xs"}
            borderRadius={10}
            height={"80vh"}
          >
            <Grid
              xs={12}
              bgcolor="#006599"
              sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              p={2}
              mb={1}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={1}
              >
                {/* Header here */}
                <Header
                  yearsData={years}
                  nextYearIncluded={next_year_included}
                  mission={mission}
                  handleChange={handleChangeFiscalYear}
                  handleEdit={handleOpenEdit}
                />

                {/* {aop?.status?.id !== 4 && (
                  
                )} */}

                <Draft status={aop?.status.id} />
                {/* 
                {aop?.status?.id !== 1 && (
                  <>
      
                    <ButtonComponent
                      variant={"soft"}
                      label={"Feedback"}
                      onClick={() => handleViewFeedback()}
                      endDecorator={
                        <ChipComponent
                          variant={"soft"}
                          size={"sm"}
                          label={
                            allComments?.length === 0
                              ? remarks?.length
                              : allComments?.length
                          }
                        />
                      }
                      startDecorator={<MessageSquareText size={16} />}
                    />
                  </>
                )} */}
              </Stack>
            </Grid>

            <Grid
              container
              bgcolor="#FAFAFA"
              spacing={2}
              sx={{
                flexGrow: 1,
                mt: 2,
                px: 1,
                pb: 1,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                overflow: "hidden",
              }}
              height={"65vh"}
            >
              {aop?.application_objectives.length === 0 ? (
                <Grid xs={12}>
                  <AOPEmptyObjectives
                    isLoading={isLoading}
                    handleNavigate={handleNavigateObjectives}
                  />
                </Grid>
              ) : (
                <>
                  {/* LEFT – AOP DATA SUMMARY */}
                  <Grid xs={12} md={5} sx={{ alignSelf: "flex-start" }}>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        overflow: "hidden", // critical
                      }}
                    >
                      <AOPDataSummary
                        aop={aop}
                        handleNavigateObjectives={handleNavigateObjectives}
                      />
                    </Box>
                  </Grid>

                  {/* MIDDLE – CHECKLIST */}
                  <Grid xs={12} md={3.5}>
                    <Checklist fiscalYear={fiscalYear} />
                  </Grid>

                  {/* RIGHT – TIMELINE */}
                  <Grid xs={12} md={3.5}>
                    <Timeline aopId={aop.id} />
                  </Grid>
                </>
              )}
            </Grid>
          </BoxComponent>
        </Fragment>
      ) : (
        // aop empty state
        <AOPEmpty setOpenFiscalYearModal={setOpenFiscalYearModal} />
      )}

      {openFiscalYearModal && (
        <ModalComponent
          isOpen={openFiscalYearModal}
          handleClose={() => setOpenFiscalYearModal(false)}
          title={header}
          description={description}
          content={
            <FiscalYearModal
              fiscalYear={fiscalYear}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
            />
          }
          hasActionButtons={true}
          rightButtonLabel={"Save AOP"}
          rightButtonAction={() => handleSaveAOP()}
          maxWidth={500}
          isLoading={isLoading}
        />
      )}

      {openEditModal && (
        <ModalComponent
          isOpen={openEditModal}
          handleClose={() => setOpenEditModal(false)}
          title={"Edit Mission"}
          description={"Enter new or modify mission statement below"}
          content={
            <TextareaComponent
              label={"Mission Statement"}
              value={updateMissionValue}
              onChange={(e) => setUpdateMissionValue(e.target.value)}
            />
          }
          maxWidth={"512px"}
          minWidth={"512px"}
          rightButtonLabel="Save Changes"
          rightButtonAction={() => handleSaveMission()}
          hasActionButtons
          isLoading={isLoading}
        />
      )}

      <AlertDialogComponent
        leftButtonAction={() => handleClose()}
        rightButtonAction={() => handleClose()}
        noRightButton={false}
        isLoading={isLoading}
      />

      <FeedbackContent
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        comments={activity_comments}
        remarks={application_timelines}
        feedbackCount={feedbackCount}
        role={role}
        isActivity={true}
        // handleClick={() => navigate(`aop/activities/${activity_id}`)} // return objective id
      />
    </Fragment>
  );
}

export default DashboardEndUser;
