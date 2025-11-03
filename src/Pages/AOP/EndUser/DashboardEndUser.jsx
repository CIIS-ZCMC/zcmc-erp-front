import ButtonComponent from "@Components/Common/ButtonComponent";

import { Box, Divider, Grid, Stack, Typography, useTheme, Skeleton } from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import no_result from "../../../assets/empty-state-icon-base.svg";
import { ANNUAL_OPS } from "../../../Data/constants";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import { Warning } from "@mui/icons-material";
import InputComponent from "@Components/Form/InputComponent";

import useAOPStore, { useAOPActions } from "../../../Store/AOPStore";

import BoxComponent from "@Components/Common/Card/BoxComponent";
import { TbTargetArrow } from "react-icons/tb";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import YearSelectorComponent from "@Components/Form/YearSelectorComponent";
import SelectComponent from "@Components/Form/YearSelectComponent";
import useAOPHook from "../../../Hooks/AOP/AOPHook";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import useModalHook from "../../../Hooks/ModalHook";
import AlertDialogComponent from "@Components/Common/Dialog/AlertDialogComponent";

import { Outlet } from "react-router-dom";
import ObjectivesCard from "./status/ObjectivesCard";
import ActivitiesCard from "./status/ActivitiesCard";
import ResourcesCard from "./status/ResourcesCard";
import ResponsiblePersonCard from "./status/ResponsiblePersonCard";

import Checklist from "./checklist/Checklist";

const FiscalYearModal = ({ value, onChange, fiscalYear }) => {
  const { missionPlaceHolder } = ANNUAL_OPS;
  const theme = useTheme();
  const color = theme.palette.custom;

  return (
    <>
      <Stack spacing={2}>
        <InputComponent
          label={"Fiscal Year"}
          fontWeight={500}
          value={fiscalYear}
          disabled
        />
        <TextareaComponent
          label={"Mission"}
          placeholder={missionPlaceHolder}
          value={value}
          onChange={onChange}
        />
        <Stack
          direction="row"
          spacing={2}
          bgcolor="#FFF4E5"
          p={2}
          borderRadius={8}
        >
          <Box>
            <Warning sx={{ color: color.warning, fontSize: 20 }} />
          </Box>
          <Typography color="warning" level="body-xs">
            After creating this new AOP, you’ll need to define its details such
            as functions, objectives, activities, resources and responsible
            persons before formal submission. This AOP will remain in draft mode
            until all required information is completed and submitted for
            review.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

function DashboardEndUser(props) {
  const { header, description } = ANNUAL_OPS;
  const theme = useTheme();
  const color = theme.palette.custom;

  const navigate = useNavigate();
  const { getAOP, createAOP, getAopBySectorAndYear, getAopYearList } = useAOPHook();
  const { setAlertDialog } = useModalHook();
  const { aop, mission, fiscalYear, years } = useAOPStore();
  const { setMission, clearMission } = useAOPActions();

  const [openFiscalYearModal, setOpenFiscalYearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAopLoading, setIsAopLoading] = useState(false)
  const [aopId, setAopId] = useState(null);
  const [year, setYear] = useState("");

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const handleSaveAOP = async () => {
    const body = {
      mission,
      year: fiscalYear,
    };

    await createAOP(body, (status, message) => {
      if (status === 200) {
        clearMission();
        setOpenFiscalYearModal(false);
        console.log(`fiscal year: ${fiscalYear}, mission: ${mission}`);
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

  const startYear = 2024;

  // const years = Array.from(
  //   { length: currentYear - startYear + 1 },
  //   (_, i) => currentYear - i
  // );

  // useEffect(() => {
  //   setIsLoading(true);
  //   getAOP((status, message) => {
  //     if (!(status >= 200 && status < 300)) {
  //       // if status not success
  //       return; //Toast error
  //     }
  //     setIsLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    setIsAopLoading(true);

    const params = { year: fiscalYear }

    getAopBySectorAndYear(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsAopLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    getAopYearList((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  }, []);

  const yearsData = years?.years
  const { next_year_included } = years || {};

  useEffect(() => {
    console.log('yearsData', yearsData)
    console.log('next_year_included', next_year_included)
  }, [yearsData])


  const handleNavigateObjectives = () => {
    navigate(`/dashboard/objectives/${aop.id}`, {
      state: { aopId: aop.id }
    });
  }

  const handleChangeFiscalYear = (e) => {
    // console.log(e)
    setIsLoading(true)
    const params = { year: e }

    getAopBySectorAndYear(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  }

  return (
    <Fragment>
      {
        isAopLoading ?
          <>
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
              my={2}
              height={'85vh'}
            >
              <ThreeDotsLoader />
            </Stack>
          </> :
          aop ? (
            <Fragment>
              <Stack>
                <Typography level="h2">Annual Operations Planning</Typography>
                <Typography level="body-xs">
                  The following below serves as the summary of your AOP request. You
                  can open and update your request before the deadline as set by the
                  administrators.
                </Typography>
              </Stack>
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
                    <Stack width={"100%"}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          sx={{ color: "white", fontSize: 28, fontWeight: 600 }}
                        >
                          AOP for Fiscal year
                        </Typography>
                        <SelectComponent
                          years={yearsData}
                          onChange={(e) => handleChangeFiscalYear(e)}
                          startYear={next_year_included}
                          width="120px"
                          bgcolor="#004366"
                          txtcolor="white"
                        />
                      </Box>
                      <Typography level="body-sm" sx={{ color: "white", mt: 1 }}>
                        Mission: {aop.mission}
                      </Typography>
                    </Stack>
                    <Stack
                      bgcolor={"#FFF4E5"}
                      borderRadius={5}
                      direction={"row"}
                      alignItems="center"
                      padding={2}
                      spacing={1.5}
                      width={"75%"}
                    >
                      <Warning sx={{ color: color.warning, fontSize: 20 }} />
                      <Box width={"100%"}>
                        <Typography
                          level="body-xs"
                          color="warning"
                          sx={{ fontWeight: 600 }}
                        >
                          {" "}
                          Status: Draft Mode
                        </Typography>
                        <Typography level="body-xs" color="warning">
                          This AOP is currently in draft mode. You may click this
                          button and confirm to submit this AOP for review.
                        </Typography>
                      </Box>
                      <Box width={"450px"}>
                        <ButtonComponent
                          label={"Submit AOP for Review"}
                          fullWidth={"true"}
                        />
                      </Box>
                    </Stack>
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

                  {!aop.counts.activities_count &&
                    <Grid mt={1} xs={8}>
                      <BoxComponent
                        justifyContent="center"
                        alignItems="center"
                        height="65vh"
                        display="flex"
                        padding={2}
                      >
                        <Box textAlign="center">

                          <Stack
                            direction={'column'}
                            mb={2}
                          >
                            <Skeleton
                              loading={isLoading}
                              animation="wave"
                              variant="text"
                            />

                            <Skeleton
                              loading={isLoading}
                              animation="wave"
                              variant="text"
                            />
                          </Stack>

                          {
                            !isLoading &&
                            <>
                              <Typography>
                                You don't have anything for this year's AOP yet.
                              </Typography>

                              <Typography fontWeight={600} mb={2}>
                                {/* {" "} */}
                                Begin by adding a new objective.
                              </Typography>
                            </>
                          }

                          <ButtonComponent
                            isLoading={isLoading}
                            label={"Go to Manage Objectives"}
                            onClick={() => {
                              navigate(`/dashboard/objectives/${aop.id}`, {
                                state: { aopId }
                              });
                            }}
                          />

                        </Box>
                      </BoxComponent>
                    </Grid>
                  }

                  {(
                    aop?.counts &&
                    Object.values(aop.counts).some(value => value > 0)
                  ) && (
                      <>
                        <Grid xs={12} sm={10} md={8} lg={5}>
                          <Grid container>
                            <Grid xs={12} sm={6} >
                              <ObjectivesCard
                                handleNavigate={handleNavigateObjectives}
                                objectiveCounts={aop.counts.objectives_count} />
                            </Grid>

                            <Grid xs={12} sm={6}>
                              <ActivitiesCard activitiesCount={aop.counts.activities_count} />
                            </Grid>

                            <Grid xs={12} sm={6}>
                              <ResourcesCard resourcesCount={aop.counts.resources_count} />
                            </Grid>

                            <Grid xs={12} sm={6}>
                              <ResponsiblePersonCard PersonsCount={aop.counts.responsible_people_count} />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid mt={1} sm={12} md={3}>
                          <Checklist fiscalYear={fiscalYear} />
                        </Grid>
                      </>
                    )}

                  <Grid mt={1} sm={12} md={4}>
                    <BoxComponent height="65vh" padding={2}>
                      <Typography level="title-lg">Approval Timeline</Typography>
                      <Typography
                        level="body-xs"
                        mt={0.5}
                        sx={{ color: color.fontLight }}
                      >
                        {" "}
                        The list below shows the current status of the request.
                      </Typography>
                      <Divider sx={{ my: 1, color: "gray" }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        height={"58vh"}
                      >
                        <Typography level="body-sm" sx={{ color: color.fontLight }}>
                          No transactions done yet.
                        </Typography>
                      </Box>
                    </BoxComponent>
                  </Grid>

                </Grid>

              </BoxComponent>
            </Fragment>
          ) : (
            <Fragment>
              <Stack>
                <Typography level="h2">
                  Enterprise Resource Planning System
                </Typography>
                <Typography level="body-xs">Sample description</Typography>
              </Stack>

              <Stack
                height="85vh"
                sx={{
                  border: "2px solid #003049",
                  borderRadius: 10,
                  bgcolor: "white",
                }}
                alignItems="center"
                justifyContent="center"
                mt={3}
                gap={2}
              >
                <img src={no_result} alt="not-found-img" width={300} />

                <Box>
                  <Typography fontSize={24} textAlign="center">
                    You don't have an AOP for this year yet.{" "}
                  </Typography>
                  <Typography
                    sx={{ color: "#003049", fontSize: 24, fontWeight: "bold" }}
                    textAlign="center"
                  >
                    Begin by creating a new AOP.
                  </Typography>
                </Box>

                <Typography width={"35%"} textAlign="center">
                  Nothing to show yet for this year’s PPMP. You may request new
                  items for the meantime or create a new AOP request.
                </Typography>
                <Stack direction="row" gap={1}>
                  <ButtonComponent label="Request new items" variant="outlined" />
                  <ButtonComponent
                    label="Create New AOP"
                    variant="solid"
                    onClick={() => setOpenFiscalYearModal(true)}
                  />
                </Stack>
              </Stack>

              <ModalComponent
                isOpen={openFiscalYearModal}
                handleClose={() => setOpenFiscalYearModal(false)}
                title={header}
                description={description}
                content={
                  <FiscalYearModal
                    fiscalYear={currentFiscalYear}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                  />
                }
                hasActionButtons={true}
                rightButtonLabel={"Save AOP"}
                rightButtonAction={() => handleSaveAOP()}
                maxWidth={500}
              />
            </Fragment>
          )}
      <AlertDialogComponent leftButtonAction={() => handleClose()} />

    </Fragment>
  );
}

export default DashboardEndUser;
