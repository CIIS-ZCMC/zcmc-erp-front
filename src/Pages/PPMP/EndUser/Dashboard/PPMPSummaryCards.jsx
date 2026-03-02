import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import StepperComponent from "@Components/Stepper/StepperComponent";
import {
  Comment,
  East,
  FormatListNumbered,
  Handyman,
  Launch,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { PhilippinePesoIcon } from "lucide-react";
import React, { Fragment } from "react";
import Checklist from "./Checklist";
import ApprovalTimeline from "./ApprovalTimeline";
import { nextYear } from "../../../../Utils/Functions";
import { useAuth } from "../../../../Store/AuthStore";
import { PPMP_CONSTANTS } from "../../../../Data/constants";

const PPMPCard = ({
  bgColor = "#CCEEFF",
  icon,
  label,
  value,
  description,
  btnAction,
  btnLabel,
}) => {
  const theme = useTheme();
  const color = theme.palette.custom;
  return (
    <>
      <Card
        variant="soft"
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #F0F0F0",
          borderRadius: 20,
          bgcolor: "white",
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Box
              width={56}
              height={56}
              sx={{ bgcolor: bgColor }}
              borderRadius={50}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {icon}
            </Box>
            <Typography
              level="body-xs"
              textTransform={"uppercase"}
              sx={{ color: color.main, fontWeight: 600 }}
            >
              {label}
            </Typography>
            <Typography level="h3" sx={{ color: color.main, fontWeight: 600 }}>
              {value}
              {/* {activity?.cost?.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}*/}
            </Typography>
            <Typography level="body-xs"> {description}</Typography>
            {btnAction && (
              <ButtonComponent
                label={btnLabel}
                endDecorator={<East />}
                onClick={btnAction}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

const FooterLinks = ({ setOpenNewRequest, handleItemRequest, status_id }) => {
  return (
    <>
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={2}
      >
        {(status_id === 1 || status_id === 6) && (
          <Link
            color="primary"
            sx={{
              fontSize: 14,
              textDecoration: "none",
              gap: 0.5,
            }}
            onClick={() => setOpenNewRequest(true)}
            endDecorator={<Launch size={18} />}
          >
            Request new item
          </Link>
        )}

        <Link
          sx={{
            fontSize: 14,
            textDecoration: "none",
            gap: 0.5,
          }}
          onClick={() => handleItemRequest()}
          endDecorator={<Launch size={18} />}
        >
          View Item Request
        </Link>
      </Stack>
    </>
  );
};

export default function PPMPSummaryCards({
  pageLoader,
  dashboard = {},
  isDispensing = false,
  timeline = [],
  handleNavigate,
  setOpenNewRequest,
  openNewRequest,
  handleItemRequest,
  regularPPMP = {},
  dispensingPPMP = {},
  checklist = [],
}) {
  const theme = useTheme();
  const color = theme.palette.custom;

  const { user } = useAuth();

  return (
    <Fragment>
      {pageLoader ? (
        <Stack height="70vh" alignItems="center" justifyContent="center">
          <ThreeDotsLoader />
        </Stack>
      ) : dashboard &&
        Object.keys(dashboard).length === 0 &&
        dashboard.constructor === Object ? (
        <>
          {" "}
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
            <Grid mt={1} xs={8}>
              <BoxComponent
                justifyContent="center"
                alignItems="center"
                height="64vh"
                display="flex"
                padding={2}
              >
                <Box textAlign="center">
                  <Stack mb={1}>
                    <Typography level="body-lg">
                      {" "}
                      AOP for {nextYear} is missing
                    </Typography>
                    <Typography level="title-lg">
                      Submit the AOP first to generate and update the PPMP.
                    </Typography>
                  </Stack>

                  <ButtonComponent
                    label={"Go to AOP"}
                    onClick={() => navigate("/aop")}
                  />
                </Box>
              </BoxComponent>
            </Grid>

            <Grid mt={1} sm={12} md={4}>
              <BoxComponent height="64vh" padding={2}>
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
                  height={"57vh"}
                >
                  <Typography level="body-sm" sx={{ color: color.fontLight }}>
                    No transactions done yet.
                  </Typography>
                </Box>
              </BoxComponent>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid
            container
            spacing={1}
            sx={{
              flexGrow: 1,
              height: isDispensing ? "75vh" : "70vh", // ONE source of truth
            }}
            bgcolor={"#FAFAFA"}
            p={1}
          >
            <Grid xs={8.5}>
              <Box
                bgcolor={"#FAFAFA"}
                display={"flex"}
                gap={2}
                padding={0.5}
                height={isDispensing ? "95%" : "90%"} // <-- FULL HEIGHT
                minHeight={0}
              >
                <Box width="100%" display="flex" flexDirection="column">
                  <Box
                    sx={{
                      backgroundColor: "#004366",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      mb: 1,
                      padding: 2,
                    }}
                  >
                    <Typography level="title-lg" sx={{ color: "white" }}>
                      {regularPPMP?.area_code} PPMP{" "}
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{ color: "white", fontWeight: 300 }}
                    >
                      {PPMP_CONSTANTS.PPMP_REGULAR}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1, // 🔑 this is the fix
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr",
                      gap: 2,
                      minHeight: 0,
                    }}
                  >
                    <PPMPCard
                      icon={
                        <Handyman sx={{ fontSize: 25, color: color.main }} />
                      }
                      label={"   Total Items"}
                      value={regularPPMP?.summary?.total_items_count}
                      description={`Contained from (${regularPPMP?.summary?.activity_count}) total combined activities`}
                      btnAction={() => handleNavigate("regular")}
                      btnLabel={"Go to Item Management"}
                    />
                    <PPMPCard
                      bgColor="#C7EBC9"
                      icon={
                        <FormatListNumbered
                          sx={{ fontSize: 25, color: "green" }}
                        />
                      }
                      label={"Total Item Quantity"}
                      value={regularPPMP?.summary?.total_quantity}
                      description={`With a total cost of (₱ ${regularPPMP?.summary?.total_cost?.toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )})`}
                    />
                    <PPMPCard
                      bgColor="#FFD2D2"
                      icon={
                        <PhilippinePesoIcon
                          style={{ fontSize: 25, color: "red" }}
                        />
                      }
                      label={"TOTAL COST"}
                      value={`₱ ${(regularPPMP?.summary?.total_cost).toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}`}
                      description={`as found in (${regularPPMP?.summary?.total_items_count}) items in total on this request`}
                    />
                    <PPMPCard
                      bgColor="#FBE2CC"
                      icon={<Comment sx={{ fontSize: 25, color: "orange" }} />}
                      label={"COMMENTS"}
                      value={regularPPMP?.summary?.comments_count}
                      description={`as found in (${regularPPMP?.summary?.items_with_comments_count}) items in total on this request`}
                    />
                  </Box>
                  <FooterLinks
                    handleItemRequest={handleItemRequest}
                    setOpenNewRequest={setOpenNewRequest}
                    status_id={regularPPMP?.status_id}
                  />
                </Box>

                {isDispensing ? (
                  <Box width="100%" display="flex" flexDirection="column">
                    <Box
                      sx={{
                        backgroundColor: "#0E5844",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        mb: 1,
                        padding: 2,
                      }}
                    >
                      <Typography level="title-lg" sx={{ color: "white" }}>
                        Dispensing Supply PPMP{" "}
                      </Typography>
                      <Typography
                        level="body-xs"
                        sx={{ color: "white", fontWeight: 300 }}
                      >
                        {PPMP_CONSTANTS.PPMP_DISPENSING}{" "}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1, // 🔑 this is the fix
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
                        gap: 2,
                        minHeight: 0,
                      }}
                    >
                      <PPMPCard
                        icon={
                          <Handyman sx={{ fontSize: 25, color: color.main }} />
                        }
                        label={"   Total Items"}
                        value={dispensingPPMP?.summary?.total_items_count}
                        description={`Contained from (${dispensingPPMP?.summary?.activity_count}) total combined activities`}
                        btnAction={() => handleNavigate("dispensed")}
                        btnLabel={"Go to Item Management"}
                      />
                      <PPMPCard
                        bgColor="#C7EBC9"
                        icon={
                          <FormatListNumbered
                            sx={{ fontSize: 25, color: "green" }}
                          />
                        }
                        label={"Total Item Quantity"}
                        value={dispensingPPMP?.summary?.total_quantity}
                        description={`With a total cost of (₱ ${dispensingPPMP?.summary?.total_cost?.toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )})`}
                      />
                      <PPMPCard
                        bgColor="#FFD2D2"
                        icon={
                          <PhilippinePesoIcon
                            style={{ fontSize: 25, color: "red" }}
                          />
                        }
                        label={"TOTAL COST"}
                        value={`₱ ${(dispensingPPMP?.summary?.total_cost).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}`}
                        description={`as found in (${dispensingPPMP?.summary?.total_items_count}) items in total on this request`}
                      />
                      <PPMPCard
                        bgColor="#FBE2CC"
                        icon={
                          <Comment sx={{ fontSize: 25, color: "orange" }} />
                        }
                        label={"COMMENTS"}
                        value={dispensingPPMP?.summary?.comments_count}
                        description={`as found in (${dispensingPPMP?.summary?.items_with_comments_count}) items in total on this request`}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Checklist checklist={checklist} />
                )}
              </Box>
            </Grid>
            <Grid
              xs={3.5}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%", // make the grid occupy full available height
                gap: 2,
              }}
            >
              {console.log(timeline)}
              <ApprovalTimeline
                timeline={timeline}
                isDispensing={isDispensing}
              />
              {isDispensing && (
                <Checklist
                  checklist={dashboard?.checklist}
                  isDispensing={true}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Fragment>
  );
}
