import React, { Fragment, useEffect } from "react";
import { Box, Grid, Stack, Typography } from "@mui/joy";
import PageTitle from "../../Components/Common/PageTitle";
import { useAuth } from "../../Store/AuthStore";
import { blue, green, grey } from "@mui/material/colors";
import no_result from "../../assets/empty-state-icon-base.png";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import DashboardStatCard from "./StatCard";
import {
  AccessTime,
  Check,
  KeyboardReturn,
  PendingActions,
  TrendingUp,
  Warning,
  WarningAmberOutlined,
  WarningOutlined,
} from "@mui/icons-material";
import HorizontalBars from "@Components/Charts/HorizontalBarChart";
import VerticalBars from "@Components/Charts/VerticalBarChart";
import SubmissionWatchlist from "./SubmissionWatchlist";
import ContainerComponent from "@Components/Common/ContainerComponent";
import {
  useERPDashboard,
  useERPDashboardActions,
  useERPDashboardLoading,
} from "../../Hooks/AOP/ERPDashboardHook";
import { formatPeso } from "../../Utils/FormatPeso";
import PageLoader from "@Components/Loading/PageLoader";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { StatCardSkeleton } from "@Components/Common/Loading/SkeletonLoader";

function Dashboard() {
  const { user } = useAuth();

  const { getERPDashboard } = useERPDashboardActions();
  const approverDashboard = useERPDashboard();
  const isLoading = useERPDashboardLoading();

  useEffect(() => {
    Promise.all([getERPDashboard(() => {})]).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <Fragment>
      <PageTitle
        title={<Typography>Enterprise Resource Planning </Typography>}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
      />

      <>
        <Grid container spacing={2} sx={{ flexGrow: 1, mt: 3 }}>
          {/* LEFT PANEL */}
          <Grid xs={12} md={4} lg={2}>
            <Box
              sx={{
                flex: 1,
                background: `linear-gradient(220deg, #0086CC 0%, #004366 100%)`,
                padding: 2,
                borderRadius: 10,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Stack spacing={2}>
                <Typography sx={{ color: "white" }}>Fiscal Year</Typography>

                <Typography
                  fontSize={80}
                  fontWeight={500}
                  sx={{ color: "white" }}
                >
                  {approverDashboard.fiscal_year}
                </Typography>

                <Stack>
                  <Typography level="title-lg" sx={{ color: "white" }}>
                    {formatPeso(approverDashboard.total_estimated_cost)}{" "}
                  </Typography>
                  <Typography
                    level="body-xs"
                    fontWeight={300}
                    sx={{ color: "#F5FCFF", opacity: 0.5 }}
                  >
                    Total Estimated Cost
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* MIDDLE PANEL */}
          <Grid xs={12} md={8} lg={6.5}>
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr", // mobile
                  sm: "1fr", // small tablets
                  md: "repeat(2, 1fr)", // laptop and up
                },
              }}
            >
              <DashboardStatCard
                icon={<Check />}
                value={approverDashboard?.approved_applications}
                label="Approved"
                subLabel={
                  approverDashboard?.approved_since_yesterday > 0 && (
                    <Typography
                      level="body-xs"
                      color={"success"}
                      sx={{ opacity: 0.8, mt: 0.5 }}
                    >
                      ↑ {approverDashboard?.approved_since_yesterday} since
                      yesterday
                    </Typography>
                  )
                }
                iconColor="success"
                subTxtcolor={"success"}
                isLoading={isLoading}
              />

              <DashboardStatCard
                icon={<PendingActions />}
                value={approverDashboard?.pending_applications}
                label="Pending Review"
                subLabel={
                  approverDashboard?.pending_since_yesterday > 0 && (
                    <Typography
                      level="body-xs"
                      color={"danger"}
                      sx={{ opacity: 0.8, mt: 0.5 }}
                    >
                      ↑ {approverDashboard?.pending_since_yesterday} since
                      yesterday
                    </Typography>
                  )
                }
                iconColor="primary"
                isLoading={isLoading}
              />

              <DashboardStatCard
                icon={<KeyboardReturn />}
                value={approverDashboard?.returned_applications}
                label="Returned"
                iconColor={"warning"}
                isLoading={isLoading}
              />
              <DashboardStatCard
                icon={<WarningAmberOutlined />}
                value={approverDashboard?.not_submitted_applications}
                label="Not Submitted"
                iconColor={"danger"}
                isLoading={isLoading}
              />
            </Box>
          </Grid>

          {/* RIGHT PANEL */}
          <Grid xs={12} md={12} lg={3.5}>
            <Stack spacing={2}>
              <DashboardStatCard
                icon={<TrendingUp />}
                value={approverDashboard?.completion_rate + "%"}
                gradient={`linear-gradient(to right, #C7EBC9 , #E2FFE3 )`}
                iconColor={"success"}
                textColor={green[800]}
                topLabel={
                  <Typography level="body-xs" color="success">
                    Completion Rate
                  </Typography>
                }
                subLabel={
                  <Typography
                    level="body-xs"
                    color="success"
                    fontStyle={"italic"}
                    fontWeight={400}
                  >
                    20 out of 35 offices have submitted
                  </Typography>
                }
                withBorderLeft
                isLoading={isLoading}
              />
              <DashboardStatCard
                icon={<AccessTime />}
                value={approverDashboard?.average_turnaround_time + " days"}
                gradient={`linear-gradient(to right, #99DCFF , #CCEEFF)`}
                textColor={blue[800]}
                iconColor={"primary"}
                topLabel={
                  <Typography level="body-xs" color="primary">
                    Average Turnaround Time{" "}
                  </Typography>
                }
                subLabel={
                  <Typography
                    level="body-xs"
                    color="primary"
                    fontStyle={"italic"}
                    fontWeight={400}
                  >
                    Average number of days from submission to approval{" "}
                  </Typography>
                }
                withBorderLeft
                isLoading={isLoading}
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ flexGrow: 1, mt: 3 }}>
          <Grid xs={12} md={4} lg={4}>
            <ContainerComponent
              title={"Total Cost by Area"}
              description={
                "Total Budget Cost for each section/division/unit (in PHP)"
              }
            >
              <HorizontalBars isLoading={isLoading} />
            </ContainerComponent>
          </Grid>
          <Grid xs={12} md={4} lg={4}>
            <ContainerComponent
              title={"Approval Turnaround Time"}
              description={"Average processing days per approval level"}
            >
              <VerticalBars
                isLoading={isLoading}
                dataset={approverDashboard?.average_turnaround_approver}
                dataKey="avr_turnaround"
              />
            </ContainerComponent>
          </Grid>
          <Grid xs={12} md={4} lg={4}>
            <ContainerComponent
              title={"Submission Watchlist"}
              description={`${approverDashboard?.submission_watchlist?.length} departments pending`}
            >
              {" "}
              {/* {console.log(approverDashboard?.submission_watchlist)} */}
              <SubmissionWatchlist
                data={approverDashboard?.submission_watchlist}
                isLoading={isLoading}
              />
            </ContainerComponent>
          </Grid>
        </Grid>
      </>
    </Fragment>
  );
}

export default Dashboard;
