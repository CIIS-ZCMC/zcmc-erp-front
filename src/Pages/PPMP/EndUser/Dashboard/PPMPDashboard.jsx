import React, { Fragment, useEffect, useState } from "react";
import { Box, Link, Stack, Typography, useTheme } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";
import { usePPMPActions, usePPMPState } from "../../../../Hooks/PPMP/PPMPHook";
import { nextYear } from "../../../../Utils/Functions";
import PageTitle from "@Components/Common/PageTitle";
import useModalHook from "../../../../Hooks/ModalHook";
import {
  useItemRequestActions,
  useItemRequestsByUser,
} from "../../../../Hooks/ItemRequest/ItemRequestHook";
import userErrorInputHook from "../../../../Hooks/ErrorInputHook";
import useAOPStore from "../../../../Store/AOPStore";
// View Item Requests Modal Components
import PPMPSummaryCards from "./PPMPSummaryCards";
import DashboardHeader from "./DashboardHeader";
import PPMPSubmissionModal from "../Modal/Dashboard/PPMPSubmissionModal";
import SuccessSubmissionModal from "../Modal/Dashboard/SuccessSubmissionModal";
import { happensNext } from "../../../../Data/constants";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { ArrowForward, ArrowRight } from "@mui/icons-material";
import CardComponent from "@Components/Common/Card/CardComponent";
import { blue } from "@mui/material/colors";

import { IconButton } from "@mui/joy";
import { Info, X } from "lucide-react";

function PPMPDashboard(props) {
  const location = useLocation();
  const pathName = location.pathname;

  const requestsByUser = useItemRequestsByUser();
  const { aop } = useAOPStore();

  const { getItemRequestByUser, postItmRequest } = useItemRequestActions();
  const { setError, clearErrors } = userErrorInputHook();

  const { data, current_page, per_page, next_page_url, prev_page_url, total } =
    requestsByUser || {};

  const navigate = useNavigate();
  const { dashboard, years, timeline } = usePPMPState();
  const {
    getPPMPDashboard,
    getYearList,
    postPPMP,
    getPPMPTimeline,
    postItemRequest,
  } = usePPMPActions();
  const searchParams = new URLSearchParams(location.search);
  const fromNotification =
    location.state?.fromNotification ||
    searchParams.get("fromNotification") === "true";
  const forceShowBanner =
    location.state?.showDispensingBanner ||
    searchParams.get("dispensing") === "true";

  const [pageLoader, setPageLoader] = useState(false);
  const [showDispensingBanner, setShowDispensingBanner] = useState(() => {
    const isDismissed = localStorage.getItem(
      "ppmp_dispensing_banner_dismissed",
    );
    return isDismissed !== "true";
  });

  useEffect(() => {
    if (fromNotification || forceShowBanner) {
      setShowDispensingBanner(true);
    }
  }, [fromNotification, forceShowBanner]);

  const handleDismissBanner = () => {
    setShowDispensingBanner(false);
    localStorage.setItem("ppmp_dispensing_banner_dismissed", "true");
  };
  const [openSave, setOpenSave] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [pin, setPin] = useState("");
  const [year, setYear] = useState(nextYear);
  const [openViewItemRequest, setOpenItemRequest] = useState();
  const [openNewRequest, setOpenNewRequest] = useState(false);
  const [step, setStep] = useState(1);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [itemReq, setItemReq] = useState({
    classification: null,
    category: null,
    item_name: "",
    unit: null,
    quantity: 0,
    estimated_budget: "",
    variant: null,
    market_research: false,
    specs: [
      { id: 1, value: "" },
      { id: 2, value: "" },
    ],
    pin: "",
  });

  const handleNavigate = (type) => {
    navigate(`/ppmp/manage-items/${type}`);
  };

  const AOP_ID = dashboard?.ppmp_application?.aop_application?.id;

  const handleSubmit = async () => {
    try {
      setButtonLoader(true);

      const payload = {
        status_id: 2,
        authorization_pin: pin,
      };

      await postPPMP(
        dashboard.ppmp_application.id,
        payload,
        (status, message, errors) => {
          if (status === 200) {
            setButtonLoader(false);
            setOpenSave(false);
            setPin("");
            setOpenSuccessDialog(true);
            getPPMPTimeline(AOP_ID, (status, message) => {
              if (!(status >= 200 && status < 300)) {
                // show toast error
              }
            });
            return;
          } else {
            setButtonLoader(false);
            setAlertDialog({
              status: "error",
              title: "Cannot submit PPMP",
              description: (
                <>
                  {status === 400 ? (
                    <Typography>{message}</Typography>
                  ) : (
                    <Stack spacing={2} alignItems={"flex-end"} mt={1}>
                      <Typography>{message}</Typography>
                      <Link
                        component={"button"}
                        onClick={() => {
                          closeAlertDialog();
                          handleNavigate("regular");
                        }}
                        endDecorator={<ArrowForward />}
                        sx={{
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                        variant="soft"
                      >
                        Go to Item Management
                      </Link>
                    </Stack>
                  )}
                </>
              ),
            });
          }
        },
      );
    } catch (error) {
      console.error(error);
      setAlertDialog({
        status: "error",
        title: "Something went wrong",
        description: "error",
      });
    }
  };

  useEffect(() => {
    setPageLoader(true);
    getYearList((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // show toast error
      }
    });
    getPPMPDashboard((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // show toast error
      }
      setPageLoader(false); // always hide loader
    }, year);
  }, [year]);

  useEffect(() => {
    if (!AOP_ID) return;

    getPPMPTimeline(AOP_ID, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // show toast error
      }
    });
  }, [AOP_ID]);

  const handleItemRequest = () => {
    setOpenItemRequest(true);

    const params = { status_id: 8 };

    (getItemRequestByUser(params),
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
      });
  };

  const isDispensing =
    dashboard?.is_dispensing !== undefined
      ? Boolean(dashboard?.is_dispensing)
      : true;

  return (
    <Fragment>
      <PageTitle
        title={"Project Procurement Management Plan"}
        description={
          " The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
      />
      {isDispensing && showDispensingBanner && (
        <Box mt={2}>
          <CardComponent
            statusColor={blue[600]}
            bgcolor={blue[50]}
            cardBody={
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={1.5}
                width="100%"
              >
                <Info
                  style={{ color: blue[600], marginTop: 2, flexShrink: 0 }}
                  size={20}
                />
                <Stack spacing={0.5} width="100%">
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography
                      level="title-sm"
                      sx={{ color: blue[800], fontWeight: 600 }}
                    >
                      You are designated as a Dispensing Unit
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={handleDismissBanner}
                      sx={{
                        color: "neutral.600",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                        p: 0.5,
                        minHeight: 0,
                        minWidth: 0,
                      }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Stack>
                  <Typography
                    level="body-xs"
                    sx={{
                      color: "neutral.600",
                      lineHeight: 1.5,
                      textAlign: "left",
                    }}
                  >
                    Your office manages two procurement plans: your own PPMP
                    covering resources from your office's activities, and a
                    separate Dispensing Supply PPMP covering common-use supply
                    requests from other offices that rely on your office for
                    dispensing. Both will be submitted together and reviewed
                    under a single approval process.
                  </Typography>
                </Stack>
              </Stack>
            }
          />
        </Box>
      )}
      <Box
        mt={3}
        height="83vh"
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 10,
          boxShadow: "xs",
          bgcolor: "white",
          minHeight: 0, // 🔑 allow children to scroll
        }}
      >
        {/* FIXED HEADER */}
        <Box sx={{ flexShrink: 0 }}>
          <DashboardHeader
            setYear={setYear}
            setOpenSave={setOpenSave}
            years={years}
            dashboard={dashboard}
          />
        </Box>

        {/* SCROLLABLE BODY */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0, // 🔑 required
            overflowY: "auto",
            px: 2,
            pb: 2,
          }}
        >
          <PPMPSummaryCards
            pageLoader={pageLoader}
            dashboard={dashboard}
            isDispensing={isDispensing}
            regularPPMP={dashboard?.regular_ppmp}
            dispensingPPMP={dashboard?.dispensed_ppmp}
            checklist={dashboard?.checklist}
            timeline={timeline}
            handleNavigate={handleNavigate}
            setOpenNewRequest={setOpenNewRequest}
            openNewRequest={openNewRequest}
            handleItemRequest={handleItemRequest}
          />
        </Box>
      </Box>

      {/* call api item request by user first */}
      {openSave && (
        <PPMPSubmissionModal
          openSave={openSave}
          setOpenSave={setOpenSave}
          nextYear={nextYear}
          handleSubmit={handleSubmit}
          buttonLoader={buttonLoader}
          setPin={setPin}
        />
      )}

      {openSuccessDialog && (
        <SuccessSubmissionModal
          openSuccessDialog={openSuccessDialog}
          setOpenSuccessDialog={setOpenSuccessDialog}
          nextYear={nextYear}
          happensNext={happensNext}
        />
      )}
    </Fragment>
  );
}

export default PPMPDashboard;
