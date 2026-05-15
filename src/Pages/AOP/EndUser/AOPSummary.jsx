import React, { Fragment, useEffect, useState } from "react";

import { Stack, Typography, Breadcrumbs, Grid, Divider, Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import { useAop } from "../../../Store/AOPStore";

import BoxComponent from "@Components/Common/Card/BoxComponent";
import AccordionComponent from "@Components/Common/AccordionComponent";
import CardComponent from "@Components/Common/Card/CardComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";

import Summary from "./Summary/Summary";
import AccordionSummary from "./accordion/Objectives/AccordionSummary";
import AccordionDetails from "./accordion/Objectives/AccordionDetails";

import CardHeader from "./Summary/Card/CardHeader";
import CardBody from "./Summary/Card/CardBody";
import CardActions from "./Summary/Card/CardActions";

import useModalHook from "../../../Hooks/ModalHook";
import useAOPHook from "../../../Hooks/AOP/AOPHook";

import { AOP_SUMMARY, AOP_CONFRIM_DATA } from "../../../Data/constants";
import { blue, common, grey } from "@mui/material/colors";
import PageTitle from "@Components/Common/PageTitle";

import { isAopDisabled } from "../../../Utils/AopStatus";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import useSnackbarHook from "../../../Hooks/SnackbarHook";

const AOPSummary = () => {
  const navigate = useNavigate();

  const aop = useAop();

  const [pin, setPin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { updateAOP } = useAOPHook();
  const {
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog,
  } = useModalHook();

  const { showSnack } = useSnackbarHook();

  const {
    PAGE_TITLE,
    PAGE_REVIEW,
    SUMMARY_TITLE,
    SUMMARY_FOOTER_TITLE,
    SUMMARY_FOOTER_CONTENT,
  } = AOP_SUMMARY;

  const breadcrumbs = [
    <Typography key="3" sx={{ color: "text.primary" }}>
      Submission of AOP
    </Typography>,
  ];

  const {
    id,
    counts,
    application_objectives,
    date_prepared,
    date_today,
    prepared_by_sector,
    year,
    status,
  } = aop;

  // get counts related data from aop
  const {
    activities_count,
    gad_activities_count,
    non_gad_activities_count,
    objectives_count,
    resources_count,
    responsible_people_count,
    total_cost,
    unified_success_indicators_count,
    users_only,
    designations_only,
  } = counts;

  const applicationsObjectives = application_objectives;

  const SUBMIT_ALERT_MESSAGES = {
    1: "Official Submission Confirmation",
    6: "Official Resubmission Confirmation",
  };

  const SUBMIT_ALERT_DESC = {
    1: `You are about to officially create PMMP for Fiscal Year ${year}.`,
    6: `You are about to resubmit PMMP for Fiscal Year ${year}.`,
  };

  const handleOpenSubmitAopModal = () => {
    const data = {
      status: "success",
      title: `${SUBMIT_ALERT_MESSAGES[status.id]}`,
      description: `${SUBMIT_ALERT_DESC[status.id]}`,
    };
    setConfirmationModal(data);
    setOpenModal(true);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/aop");
      closeAlertDialog();
      setIsLoading(false);
    }, 2000);
  };

  const handleSubmitAop = async () => {
    setIsLoading(true);

    const params = { id };

    const payload = {
      status_id: 2,
      authorization_pin: pin,
    };

    // console.log(payload)

    try {
      await updateAOP(params, payload, (status, message) => {
        if (status === 200) {
          showSnack(status, message);
          navigate("/aop");
          setIsLoading(false);
        } else if (status === 422) {
          // console.log(message)
          const {
            statusMessage,
            activities_without_resources,
            activities_without_responsible_people,
            activities_without_target,
            objectives_without_activities,
            mission_missing,
          } = message;

          const MISSING_DATA_SECTIONS = [
            {
              title: "These activities do not contain any resources:",
              data: activities_without_resources,
            },
            {
              title: "These activities do not contain any responsible people:",
              data: activities_without_responsible_people,
            },
            {
              title: "These activities do not contain any target quarter:",
              data: activities_without_target,
            },
          ];

          const data = {
            status: status,
            title: statusMessage,
            description: (
              <>
                {mission_missing && (
                  <>
                    {mission_missing?.map((mission, idx) => (
                      <Typography key={idx} level="body-xs">
                        {mission}
                      </Typography>
                    ))}
                  </>
                )}
                {objectives_without_activities && (
                  <>
                    <Typography level="title-sm">
                      These objectives do not contain any activities :
                    </Typography>
                    {objectives_without_activities.map((objective, idx) => (
                      <Typography key={idx} level="body-xs">
                        {objective}
                      </Typography>
                    ))}
                  </>
                )}

                <Divider
                  sx={{
                    my: 1,
                  }}
                />

                {MISSING_DATA_SECTIONS.map(({ title, data }, idx) =>
                  data?.length > 0 ? (
                    <Fragment key={idx}>
                      <Typography level="title-sm">{title}</Typography>

                      <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={1}
                        sx={{
                          maxWidth: "100%",
                          overflowX: "hidden",
                        }}
                      >
                        {data.map(({ objective, activities }, i) => (
                          <>
                            {activities.map((activity) => (
                              <Typography
                                key={i}
                                level="body-xs"
                                sx={{
                                  flex: "0 1 auto",
                                  bgcolor: "#F5F5F5",
                                  borderRadius: "8px",
                                  px: 1.5,
                                  py: 0.5,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {activity}
                              </Typography>
                            ))}
                            <Typography level="body-xs">
                              From objective: {objective}
                            </Typography>
                          </>
                        ))}
                      </Box>

                      <Divider
                        sx={{
                          my: 1,
                        }}
                      />
                    </Fragment>
                  ) : null,
                )}
              </>
            ),
          };

          setAlertDialog(data);
          setIsLoading(false);
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "",
          });
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: "Something went wrong.",
      });
    }
  };

  return (
    <>
      <PageTitle
        title={PAGE_TITLE}
        description={PAGE_REVIEW}
        withArrowBack
        onClickArrow={() => navigate("/aop")}
      />
      <Stack spacing={2} pb={5} mt={3}>
        <CardComponent
          statusColor={blue[600]}
          bgcolor={blue[50]}
          contentPadding={"10px"}
          justifyContentHeader={"flex-start"}
          justifyContentActions={"flex-start"}
          direction={"row"}
          cardHeader={<CardHeader status={status.id} />}
          cardBody={status.id !== 4 && <CardBody />}
          withDividerStyle
          actionWidth={"80%"}
          cardActions={
            <CardActions
              datePrepared={date_prepared}
              dateToday={date_today}
              PreparedBySector={prepared_by_sector}
            />
          }
        />

        <Summary
          hasTotalCost={true}
          activitiesCount={activities_count}
          gadActivitiesCount={gad_activities_count}
          nonGadActivitiesCount={non_gad_activities_count}
          objectivesCount={objectives_count}
          resourcesCount={resources_count}
          responsiblePeopleCount={responsible_people_count}
          totalCost={total_cost}
          successIndicatorCount={unified_success_indicators_count}
          usersCount={users_only}
          designationCount={designations_only}
        />

        {applicationsObjectives.length !== 0 && (
          <BoxComponent p={0}>
            <Grid
              xs={12}
              bgcolor="#004366"
              sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              p={2}
            >
              <Grid xs={12}>
                <Typography textColor={"white"}>{SUMMARY_TITLE}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid xs={12}>
                {/* map here */}
                {applicationsObjectives?.map(
                  ({ objective, counts, activities }, index) => {
                    const { code } = objective;
                    const { activities_count, total_cost, comments_count } =
                      counts;

                    const objectiveIndex = index + 1;

                    return (
                      <>
                        <AccordionComponent
                          defaultExpanded={false}
                          expandedStyles={{ mb: 2 }}
                          summaryStyles={(expanded) => ({
                            bgcolor: expanded ? "#E0F5FF" : "background.body",
                          })}
                          accordionSummary={
                            <>
                              <AccordionSummary
                                index={objectiveIndex}
                                objectiveName={code}
                                activitiesCount={activities_count}
                                cost={total_cost}
                              />
                            </>
                          }
                          accordionDetails={
                            <>
                              {activities.length === 0 && (
                                <Typography
                                  p={4}
                                  textAlign={"center"}
                                  level="title-md"
                                >
                                  There are no activities for this
                                  objective.{" "}
                                </Typography>
                              )}
                              <AccordionDetails activities={activities} />
                            </>
                          }
                        />
                      </>
                    );
                  },
                )}
              </Grid>
            </Grid>
          </BoxComponent>
        )}

        {/* do not display if status is 2 = submitted or 4 = approved */}
        {(status.id === 1 || status.id === 6) && (
          <BoxComponent>
            <Stack p={2} mb={2}>
              <Stack>
                <Typography level="title-md">{SUMMARY_FOOTER_TITLE}</Typography>

                <Stack
                  mt={2}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography level="body-sm" width={1000}>
                    {SUMMARY_FOOTER_CONTENT}
                  </Typography>

                  <ButtonComponent
                    label={status.id === 6 ? "Resubmit AOP" : "Submit AOP"}
                    size={"lg"}
                    onClick={() => handleOpenSubmitAopModal()}
                    color="primary"
                  />
                </Stack>
              </Stack>
            </Stack>
          </BoxComponent>
        )}
      </Stack>

      {openModal && (
        <ModalComponent
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={
            <Typography color="success">
              {SUBMIT_ALERT_MESSAGES[status.id]}
            </Typography>
          }
          handleClose={() => {
            setOpenModal(false);
            setPin("");
          }}
          description={`${SUBMIT_ALERT_DESC[status.id]}`}
          maxWidth={"571px"}
          minWidth={"571px"}
          hasActionButtons
          content={
            <>
              <BoxComponent bgColor={"#F5F5F5"}>
                <Stack p={1} spacing={1}>
                  <Typography level="title-md">
                    Please confirm the following:
                  </Typography>

                  {AOP_CONFRIM_DATA.map(({ title, icon }) => (
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Typography
                        level="body-sm"
                        startDecorator={"✓"}
                        sx={{ color: grey[900] }}
                      >
                        {title}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </BoxComponent>
              <AuthorizationPinComponent
                pin={pin}
                setPin={setPin}
                isLoading={isLoading}
              />
            </>
          }
          leftButtonLabel="Cancel"
          rightButtonLabel={status.id === 6 ? "Resubmit" : "Submit"}
          rightButtonAction={() => handleSubmitAop()}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default AOPSummary;
