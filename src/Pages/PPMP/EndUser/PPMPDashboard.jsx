import React, { Fragment, useEffect, useState } from "react";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { PhilippinePesoIcon, TargetIcon } from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { useNavigate } from "react-router-dom";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import no_result from "../../../assets/empty-state-icon-base.png";
import { ThreeDotsLoader } from "../../../Components/Common/Loading/ThreeDotsLoader";
import { socket } from "../../../Services/Socket";
import { useAuth } from "../../../Store/AuthStore";
import { nextYear } from "../../../Utils/Functions";
import SelectComponent from "@Components/Form/YearSelectComponent";
import {
  Check,
  Comment,
  East,
  FormatListNumbered,
  Handyman,
  Warning,
  WarningAmber,
} from "@mui/icons-material";
import PageTitle from "@Components/Common/PageTitle";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { grey } from "@mui/material/colors";
import InputComponent from "@Components/Form/InputComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";

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

function PPMPDashboard(props) {
  const navigate = useNavigate();
  const { dashboard, getPPMPDashboard } = usePPMPHook();
  const [pageLoader, setPageLoader] = useState(false);
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};
  const status = dashboard?.ppmp_application?.is_draft;

  const theme = useTheme();
  const color = theme.palette.custom;

  const [openSave, setOpenSave] = useState(false);
  const [pin, setPin] = useState("");

  const handleNavigate = () => {
    navigate("/ppmp/manage-items");
  };
  useEffect(() => {
    setPageLoader(true);
    getPPMPDashboard((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setPageLoader(false);
    });
  }, []);

  useEffect(() => {
    if (!assignedArea?.name) return;

    socket.emit("register-user", {
      userId: id,
      name: name,
      area: assignedArea.name,
    });
  }, [assignedArea]);
  return (
    <Fragment>
      <Stack>
        <Typography level="h2">
          Project Procurement Management Planning
        </Typography>
        <Typography level="body-xs">
          The following below serves as the summary of your AOP request. You can
          open and update your request before the deadline as set by the
          administrators.
        </Typography>
      </Stack>
      <BoxComponent
        mt={3}
        height={"84vh"}
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
            alignItems={"center"}
          >
            <Stack width={"100%"}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  sx={{ color: "white", fontSize: 28, fontWeight: 600 }}
                >
                  PPMP for Fiscal year
                </Typography>
                <SelectComponent
                  width="120px"
                  bgcolor="#004366"
                  txtcolor="white"
                />
              </Box>
              <Typography level="body-sm" sx={{ color: "white" }}>
                Mission: This is a sample mission written by the requesting
                body. This could be as short as a single sentence but could be
                as long as two sentences if necessary.
              </Typography>
            </Stack>
            {dashboard?.ppmp_application?.is_draft ? (
              <Stack
                bgcolor={"#FFF4E5"}
                borderRadius={5}
                direction={"row"}
                alignItems="center"
                padding={2}
                spacing={1.5}
                width={"75%"}
              >
                <WarningAmber sx={{ color: color.warning, fontSize: 20 }} />
                <Box width={"100%"}>
                  <Typography
                    level="body-xs"
                    color="warning"
                    sx={{ fontWeight: 600 }}
                  >
                    {" "}
                    Status: Draft Mode{" "}
                  </Typography>
                  <Typography level="body-xs" color="warning">
                    This is a draft PPMP request that we’ve generated based from
                    the AOP you’ve just created recently. Update the draft so
                    you can submit it for approval.
                  </Typography>
                </Box>
                <Box>
                  <ButtonComponent
                    label={"Submit PPMP for Review"}
                    width="190px"
                    onClick={() => setOpenSave(true)}
                  />
                </Box>
              </Stack>
            ) : (
              <Stack
                bgcolor={"#FFF4E5"}
                borderRadius={5}
                direction={"row"}
                alignItems="center"
                padding={2}
                spacing={1.5}
                width={"75%"}
              >
                <WarningAmber sx={{ color: color.warning, fontSize: 20 }} />
                <Box width={"100%"}>
                  <Typography
                    level="body-xs"
                    color="warning"
                    sx={{ fontWeight: 600 }}
                  >
                    {" "}
                    Status: Not Generated
                  </Typography>
                  <Typography level="body-xs" color="warning">
                    AOP for 2026 is missing. Submit the AOP to generate the PPMP
                    and enable updates.
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </Grid>
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
                        AOP for 2026 is missing
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
              sx={{ flexGrow: 1 }}
              bgcolor={"#FAFAFA"}
              p={1}
            >
              <Grid xs={8}>
                <BoxComponent
                  bgColor={"#FAFAFA"}
                  display={"flex"}
                  gap={2}
                  padding={2}
                  height="62vh" // <-- FULL HEIGHT
                  flex={1} // <-- ALLOWS STRETCHING IN FLEX CONTEXT
                  minHeight={0}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 800,
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: 2,
                    }}
                  >
                    <PPMPCard
                      icon={
                        <Handyman sx={{ fontSize: 25, color: color.main }} />
                      }
                      label={"   Total Items"}
                      value={"₱ 12, 000"}
                      description={
                        "             Contained from (14) total combined activities"
                      }
                      btnAction={() => handleNavigate()}
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
                      value={"14,000"}
                      description={
                        "With (₱22,000,000.00) total allocated budget"
                      }
                    />
                    <PPMPCard
                      bgColor="#FFD2D2"
                      icon={
                        <PhilippinePesoIcon
                          style={{ fontSize: 25, color: "red" }}
                        />
                      }
                      label={"TOTAL COST"}
                      value={"₱22.0M"}
                      description={
                        "as found in (12) items in total on this request"
                      }
                    />
                    <PPMPCard
                      bgColor="#FBE2CC"
                      icon={<Comment sx={{ fontSize: 25, color: "orange" }} />}
                      label={"COMMENTS"}
                      value={"12"}
                      description={
                        "as found in (12) items in total on this request"
                      }
                    />
                  </Box>
                  <BoxComponent width="100%" padding={2}>
                    <Typography level="title-lg">PPMP Checklist</Typography>
                  </BoxComponent>
                </BoxComponent>
              </Grid>
              <Grid xs={4}>
                {/* Approval Timeline Here */}
                <BoxComponent bgColor={"#FFFFFF"} p={2}>
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
                    height={"55vh"}
                  >
                    <Typography level="body-sm" sx={{ color: color.fontLight }}>
                      No transactions done yet.
                    </Typography>
                  </Box>
                </BoxComponent>
              </Grid>
            </Grid>
          </>
        )}
      </BoxComponent>
      {/* <PageLoader isLoading={pageLoader} /> */}

      <ModalComponent
        isOpen={openSave}
        title={"Official Submission Confirmation"}
        description={
          "You are about to officially submit your Project Procurement Management Plan for Fiscal Year 2026 to the approving bodies for review and approval."
        }
        maxWidth={"571px"}
        handleClose={() => setOpenSave(false)}
        content={
          <>
            <Stack
              sx={{
                bgcolor: grey[100],
                border: `1px solid ${grey[400]}`,
                borderRadius: 10,
                padding: 2,
                mt: 1.5,
              }}
              spacing={1}
            >
              <Typography
                level="body-sm"
                sx={{ fontWeight: 500, color: grey[800] }}
              >
                Please confirm the following:
              </Typography>
              <Typography level="body-sm" sx={{ color: grey[800] }}>
                <b>✓</b> All information provided is accurate and complete
              </Typography>
              <Typography level="body-sm" sx={{ color: grey[800] }}>
                <b>✓</b> All required resource item details have been properly
                filled out
              </Typography>
              <Typography level="body-sm" sx={{ color: grey[800] }}>
                <b>✓</b> You have the authority to submit this document
              </Typography>
            </Stack>
            <AuthorizationPinComponent setPin={setPin} />
          </>
        }
        hasActionButtons
        noRightButton={true}
        leftButtonLabel="Submit"
      />
    </Fragment>
  );
}

export default PPMPDashboard;
