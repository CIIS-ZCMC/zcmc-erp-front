import React, { Fragment, useEffect, useState } from "react";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import {
  Box,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { TargetIcon } from "lucide-react";
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
import { Warning, WarningAmber } from "@mui/icons-material";
import PageTitle from "@Components/Common/PageTitle";

function PPMPDashboard(props) {
  const navigate = useNavigate();
  const { dashboard, getPPMPDashboard } = usePPMPHook();
  const [pageLoader, setPageLoader] = useState(false);
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};
  const status = dashboard?.ppmp_application?.is_draft;

  const theme = useTheme();
  const color = theme.palette.custom;

  const handleNavigate = () => {
    navigate("ppmp-items");
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
      <PageTitle
        title={"Project Procurement Management Plan"}
        description={
          "The following below serves as the summary of your PPMP request. You can open and update your request before the deadline as set by the administrators."
        }
      />
      {pageLoader ? (
        <Stack height="85vh" alignItems="center" justifyContent="center">
          <ThreeDotsLoader />
        </Stack>
      ) : dashboard &&
        Object.keys(dashboard).length === 0 &&
        dashboard.constructor === Object ? (
        <>
          {" "}
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
                    body. This could be as short as a single sentence but could
                    be as long as two sentences if necessary.
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
                  <WarningAmber sx={{ color: color.warning, fontSize: 20 }} />
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
              <Grid mt={1} xs={8}>
                <BoxComponent
                  justifyContent="center"
                  alignItems="center"
                  height="64vh"
                  display="flex"
                  padding={2}
                >
                  <Box textAlign="center"></Box>
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
          </BoxComponent>
        </>
      ) : (
        <>
          <BoxComponent mt={3}>
            <Stack>
              <Box
                bgcolor="#006599"
                padding={3}
                sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              >
                <Typography
                  sx={{ color: "white", fontSize: 32, fontWeight: 600 }}
                >
                  {nextYear} Project Procurement Management Plan (PPMP)
                </Typography>
                {/* <Typography sx={{ color: "white", fontSize: 14 }}>
              Mission: This is a sample mission written by the requesting body.
              This could be as short as a single sentence but could be as long
              as two sentences if necessary.
            </Typography> */}
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
                bgcolor="#FAFAFA"
                paddingX={5}
                paddingY={5}
                sx={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                gap={2}
              >
                <BoxComponent width="100%" padding={2}>
                  <Typography fontWeight={600} pb={2} fontSize={20}>
                    Plan summary:
                  </Typography>
                  <Stack direction={"row"} spacing={2} alignItems="flex-end">
                    <BoxComponent width="100%">
                      <Typography fontSize={16} fontWeight={600} py={1}>
                        {dashboard?.item_count?.toLocaleString()}
                      </Typography>
                      <Stack direction="row" alignItems="flex-start" gap={1}>
                        <TbTargetArrow
                          style={{
                            fontSize: 25,
                            marginTop: "5px",
                            color: "#666666",
                          }}
                        />

                        <Typography>
                          Contained from{" "}
                          <b style={{ color: "#004366" }}>
                            ({dashboard?.activity_count?.toLocaleString()})
                          </b>{" "}
                          total combined activities
                        </Typography>
                      </Stack>
                    </BoxComponent>
                    <BoxComponent width="100%">
                      <Typography fontSize={16} fontWeight={600} py={1}>
                        {dashboard?.total_quantity?.toLocaleString()} total item
                        quantity
                      </Typography>
                      <Stack direction="row" alignItems="flex-start" gap={1}>
                        <MdOutlineShoppingCartCheckout
                          style={{
                            fontSize: 25,
                            marginTop: "5px",
                            color: "#666666",
                          }}
                        />
                        <Typography>
                          With a PPMP total of{" "}
                          <b style={{ color: "#004366" }}>
                            ( &#8369;{" "}
                            {dashboard?.ppmp_application?.ppmp_total?.toLocaleString()}
                            )
                          </b>
                        </Typography>
                      </Stack>
                    </BoxComponent>
                  </Stack>
                </BoxComponent>

                <BoxComponent width="100%" padding={2}>
                  <Stack gap={3} alignItems="start">
                    <Typography fontWeight={600} fontSize={20} align="left">
                      About your PPMP
                    </Typography>
                    <Typography>
                      This is a draft PPMP request that we’ve generated based
                      from the AOP you’ve just created recently. Update the
                      draft so you can submit it for approval.
                    </Typography>
                    <ButtonComponent
                      label={"View PPMP"}
                      onClick={() => handleNavigate()}
                      width="auto"
                      boxShadow={"2px 3px 4px #D3D3D3"}
                    />
                  </Stack>
                </BoxComponent>
              </Stack>
            </Stack>
          </BoxComponent>
        </>
      )}

      {/* <PageLoader isLoading={pageLoader} /> */}
    </Fragment>
  );
}

export default PPMPDashboard;
