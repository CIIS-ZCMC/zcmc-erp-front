import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import { Box, Stack } from "@mui/joy";
import { TargetIcon } from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { useNavigate } from "react-router-dom";
import usePPMPHook from "../../../Hooks/PPMPHook";
import {
  MdFindInPage,
  MdOutlineFindInPage,
  MdOutlineShop,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import no_result from "../../../assets/not-found.png";
import PageLoader from "../../../Components/Loading/PageLoader";

function PPMPDashboard(props) {
  const navigate = useNavigate();
  const { dashboard, getPPMPDashboard } = usePPMPHook();
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    setPageLoader(true);
    getPPMPDashboard((status, message) => {
      // console.log(status)
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setPageLoader(false);
    });
  }, []);
  return (
    <Fragment>
      {dashboard &&
      Object.keys(dashboard).length === 0 &&
      dashboard.constructor === Object ? (
        <>
          <Stack
            height="85vh"
            sx={{ border: "2px solid #003049", borderRadius: 10 }}
            alignItems="center"
            justifyContent="center"
            mt={3}
            gap={2}
          >
            <img src={no_result} alt="not-found-img" width={150} />

            <Box>
              <Typography fontSize={24} textAlign="center">
                Your PPMP for this year isn’t ready yet.{" "}
              </Typography>
              <Typography
                sx={{ color: "#003049", fontSize: 24, fontWeight: "bold" }}
                textAlign="center"
              >
                Begin by creating a new request.
              </Typography>
            </Box>

            <Typography width={"35%"} textAlign="center">
              Nothing to show yet for this year’s PPMP. You may request new
              items for the meantime or create a new AOP request.
            </Typography>
            <Stack direction="row" gap={1}>
              <ButtonComponent label="Request new items" variant="outlined" />
              <ButtonComponent
                label="Create AOP"
                variant="solid"
                onClick={() => navigate("/aop-create")}
              />
            </Stack>
          </Stack>
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
                  PPMP for Fiscal year 2026
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
                sx={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                gap={2}
              >
                <Stack width="100%" gap={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <BoxComponent width="100%" padding={2}>
                      <Typography fontWeight={600} pb={2} fontSize={20}>
                        Plan summary:
                      </Typography>
                      <Stack direction={"row"} spacing={2}>
                        <BoxComponent width="100%">
                          <Typography fontSize={16} fontWeight={600} py={1}>
                            {dashboard?.item_count?.toLocaleString()}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            gap={1}
                          >
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
                            {dashboard?.total_quantity?.toLocaleString()} total
                            item quantity
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            gap={1}
                          >
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
                                ({dashboard?.ppmp_application?.ppmp_total})
                              </b>
                            </Typography>
                          </Stack>
                        </BoxComponent>
                      </Stack>
                    </BoxComponent>
                  </Box>
                </Stack>

                <BoxComponent width="100%">
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
                      onClick={() => navigate("ppmp-items")}
                      width="auto"
                    />
                  </Stack>
                </BoxComponent>
              </Stack>
            </Stack>
          </BoxComponent>
        </>
      )}
      <PageLoader isLoading={pageLoader} />
    </Fragment>
  );
}

export default PPMPDashboard;
