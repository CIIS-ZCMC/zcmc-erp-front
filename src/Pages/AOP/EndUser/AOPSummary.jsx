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
import {
  Add,
  DownloadOutlined,
  FileDownload,
  WarningAmber,
} from "@mui/icons-material";
import ChipComponent from "@Components/Common/ChipComponent";
import SubmissionValidationContent from "./Summary/SubmissionValidationContent";
import { FeedbackContent } from "../Approval/Contents/FeedbackContent";

const AOPSummary = () => {
  const navigate = useNavigate();

  const aop = useAop();

  const [pin, setPin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedObjective, setExpandedObjective] = useState(null);
  const [targetActivityId, setTargetActivityId] = useState(null);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);

  const [validationModal, setValidationModal] = useState({
    open: false,
    data: null,
  });

  const { updateAOP, exportAOP } = useAOPHook();
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
    date_submitted,
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
    1: "Generate PPMP Confirmation",
    6: "Generate PPMP Confirmation",
  };

  const SUBMIT_ALERT_DESC = {
    1: `You are about to generate a Project Procurement Management Plan (PPMP) based on the procurable resources identified in this Annual Operations Plan (AOP) for Fiscal Year ${year}.`,
    6: `You are about to generate a Project Procurement Management Plan (PPMP) based on the procurable resources identified in this Annual Operations Plan (AOP) for Fiscal Year ${year}.`,
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

    try {
      await updateAOP(params, payload, (status, message) => {
        if (status === 200) {
          showSnack(status, message);
          navigate("/aop");
          setIsLoading(false);
        } else if (status === 422) {
          setValidationModal({
            open: true,
            data: message,
          });
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

  const handleExportAOP = () => {
    setIsExporting(true);

    exportAOP((status, message) => {
      setIsExporting(false);
      showSnack(status, message);
    }, aop);
  };

  const handleNavigateToActivities = (id) => {
    navigate(`/aop/activities/${id}`, {
      state: {
        objectiveId: id,
        aopId: aop?.id || aopApplication?.id,
      },
    });
  };

  const handleNavigateObjectives = () => {
    navigate(`/aop/objectives/${aop?.id}`, {
      state: { aopId: aop?.id }, // do not change state name
    });
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
          justifyContentActions={"space-between"}
          direction={"row"}
          cardHeader={<CardHeader status={status.id} />}
          cardBody={status.id !== 4 && <CardBody />}
          withDividerStyle
          actionWidth={"100%"}
          cardActions={
            <CardActions
              datePrepared={date_prepared}
              dateSubmitted={date_submitted}
              PreparedBySector={prepared_by_sector}
              handleExport={handleExportAOP}
              isLoading={isExporting}
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
                <Box
                  sx={{
                    maxHeight: "600px", // adjust to your preference
                    overflowY: "auto",
                    p: 1,
                  }}
                >
                  {applicationsObjectives?.map(
                    ({ id, objective, counts, activities }, index) => {
                      const { code, description } = objective;
                      const { activities_count, total_cost, comments_count } =
                        counts;

                      const objectiveIndex = index + 1;

                      return (
                        <>
                          <AccordionComponent
                            expanded={expandedObjective === id}
                            onChange={(event, isExpanded) =>
                              setExpandedObjective(isExpanded ? id : null)
                            }
                            expandedStyles={{ mb: 2 }}
                            summaryStyles={(expanded) => ({
                              bgcolor: expanded ? "#E0F5FF" : "background.body",
                            })}
                            accordionSummary={
                              <>
                                <AccordionSummary
                                  index={objectiveIndex}
                                  objectiveName={description}
                                  activitiesCount={activities_count}
                                  cost={total_cost}
                                />
                              </>
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
                                      Activities define what your unit will do
                                      to achieve this objective.
                                    </Typography>
                                    <ButtonComponent
                                      label={"Add an Activity"}
                                      startDecorator={<Add />}
                                      onClick={() =>
                                        handleNavigateToActivities(id)
                                      }
                                    />
                                  </Stack>
                                )}
                                <Stack my={1.5} direction={"row"}>
                                  <ChipComponent
                                    label={"Go to Objectives"}
                                    variant={"soft"}
                                    endDecorator
                                    status={"next"}
                                    color={"primary"}
                                    onClick={handleNavigateObjectives}
                                  />
                                </Stack>

                                <AccordionDetails
                                  objId={id}
                                  activities={activities}
                                  targetActivityId={targetActivityId}
                                />
                              </>
                            }
                          />
                        </>
                      );
                    },
                  )}
                </Box>
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
                    label={"Generate PPMP"}
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
                  <Typography level="title-md" sx={{ color: grey[800] }}>
                    Please confirm the following:
                  </Typography>

                  {AOP_CONFRIM_DATA.map(({ title, icon }) => (
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Typography
                        level="body-sm"
                        startDecorator={"✓"}
                        sx={{ color: grey[700] }}
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
          loadingLabel={"Submitting..."}
          rightButtonDisabled={!pin}
        />
      )}

      {validationModal.open && (
        <ModalComponent
          isOpen={validationModal.open}
          onClose={() => setValidationModal({ open: false, data: null })}
          title={
            <Typography color="danger">
              {validationModal.data?.statusMessage}
            </Typography>
          }
          handleClose={() => setValidationModal({ open: false, data: null })}
          description={
            "Fix the issues below before your AOP can be submitted for review."
          }
          maxWidth="700px"
          minWidth="700px"
          content={<SubmissionValidationContent data={validationModal.data} />}
        />
      )}
    </>
  );
};

export default AOPSummary;
