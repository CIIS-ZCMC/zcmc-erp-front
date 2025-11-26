import { Button, Grid, Stack, } from "@mui/joy";

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";

import ButtonComponent from "@Components/Common/ButtonComponent";
import AlertDialogComponent from "@Components/Common/Dialog/AlertDialogComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import ChipComponent from "@Components/Common/ChipComponent";
import { FeedbackContent } from "../../../Pages/PlanningOps/Approval/Contents/FeedbackContent";

import useAOPHook from "../../../Hooks/AOP/AOPHook";
import useModalHook from "../../../Hooks/ModalHook";
import useObjectivesHook from "../../../Hooks/ObjectivesHook";

import useObjectivesStore from "../../../Store/ObjectivesStore";
import useAOPStore, { useAOPActions } from "../../../Store/AOPStore";

import Title from "./Title/Title";
import Header from './Header/Header';
import Draft from "./Mode/Draft";
import AOPEmpty from "./AOPEmpty";
import AOPEmptyObjectives from "./AOPEmptyObjectives";
import Timeline from "./Timeline/Timeline";
import Checklist from "./Checklist/Checklist";
import FiscalYearModal from "./Modal/FiscalYearModal";
import AOPDataSummary from "./AOPDataSummary";

import { ANNUAL_OPS } from "../../../Data/constants";

function DashboardEndUser(props) {
  const { header, description } = ANNUAL_OPS;

  const navigate = useNavigate();

  const { getObjectives } = useObjectivesHook();
  const { createAOP, getAopBySectorAndYear, getAopYearList } = useAOPHook();
  const { setAlertDialog } = useModalHook();

  const { applicationObjectives } = useObjectivesStore();
  const { aop, mission, fiscalYear, yearDetails, } = useAOPStore();
  const { setMission, clearMission } = useAOPActions();

  const [openFiscalYearModal, setOpenFiscalYearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAopLoading, setIsAopLoading] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);


  useEffect(() => {
    getObjectives(aop.id, (status, message) => {
      return
    })
  }, [])

  const {
    activity_comments,
    application_timelines,
    current_user,
  } = applicationObjectives;

  const { role } = current_user || {}

  useEffect(() => {
    console.log(application_timelines)
  }, [application_timelines])

  const remarksCount = application_timelines?.length || 0;
  const commentCount = activity_comments?.length || 0;
  const feedbackCount = commentCount + remarksCount;

  const handleSaveAOP = async () => {
    const body = {
      mission,
      year: fiscalYear,
    };

    await createAOP(body, (status, message) => {
      if (status === 200) {
        clearMission();
        setOpenFiscalYearModal(false);
        // console.log(`fiscal year: ${fiscalYear}, mission: ${mission}`);
        setAlertDialog({
          status: "success",
          title: "Success",
          description: `${message}`,
        });
        return;
        // navigate("/aop-management");
      } else {
        setAlertDialog({
          status: "error",
          title: `${message}`,
          description: "",
        });
        return;
      }
    });
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
    // console.log('aop loading:', isAopLoading)
    // console.log('loading :', isLoading)

  }, [isAopLoading])

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
      state: { aopId: aop.id },
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

  const handleViewFeedback = () => {
    setOpenFeedbackModal(true);
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
            sx={{
              height: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
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
                alignItems={"flex-start"}
              >

                {/* Header here */}
                <Header
                  yearsData={years}
                  nextYearIncluded={next_year_included}
                  mission={aop.mission}
                  handleChange={handleChangeFiscalYear}
                />

                {(aop?.status?.id !== 2 && aop?.status?.id !== 4) &&
                  <Draft />
                }

                {!aop?.status?.id !== 2 &&
                  <>
                    <ButtonComponent
                      variant={'soft'}
                      label={'Feedback'}
                      onClick={handleViewFeedback}
                      endDecorator={
                        <ChipComponent
                          variant={'soft'}
                          size={'sm'}
                          label={feedbackCount}
                        />
                      }
                      startDecorator={
                        <MessageSquareText
                          size={16}
                        />
                      }
                    />
                  </>
                }

              </Stack>
            </Grid>

            <Grid
              container
              bgcolor={"#FAFAFA"}
              padding={0.5}
              spacing={2}
              sx={{
                flexGrow: 1,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {!aop?.counts?.activities_count && (
                <Grid mt={1} xs={8}>
                  {/* have aop but empty objectives */}
                  <AOPEmptyObjectives
                    isLoading={isLoading}
                    handleNavigate={handleNavigateObjectives}
                  />
                </Grid>
              )}

              {(
                aop?.counts &&
                Object.values(aop.counts).some(value => value > 0)
              ) && (
                  <>
                    <Grid xs={12} sm={10} md={8} lg={5}>
                      <Grid container>
                        <AOPDataSummary
                          aop={aop}
                          handleNavigateObjectives={handleNavigateObjectives}
                        />
                      </Grid>
                    </Grid>

                    <Grid mt={1} sm={12} md={3}>
                      <Checklist fiscalYear={fiscalYear} />
                    </Grid>
                  </>
                )}

              <Grid mt={1} sm={12} md={4}>
                <Timeline
                  aopId={aop.id}
                />
              </Grid>
            </Grid>
          </BoxComponent>
        </Fragment>
      ) : (
        // aop empty state
        <AOPEmpty
          setOpenFiscalYearModal={setOpenFiscalYearModal}
        />
      )}

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
      />

      <AlertDialogComponent
        leftButtonAction={() => handleClose()}
      />

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

export default DashboardEndUser;
