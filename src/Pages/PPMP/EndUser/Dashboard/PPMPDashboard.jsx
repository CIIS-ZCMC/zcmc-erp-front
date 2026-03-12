import React, { Fragment, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";
import { usePPMPActions, usePPMPState } from "../../../../Hooks/PPMP/PPMPHook";
import { nextYear } from "../../../../Utils/Functions";
import PageTitle from "@Components/Common/PageTitle";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import useModalHook from "../../../../Hooks/ModalHook";

import useItemRequestHook from "../../../../Hooks/ItemRequest/ItemRequestHookv2";
import useItemRequestStore from "../../../../Store/ItemRequestStore";
import userErrorInputHook from "../../../../Hooks/ErrorInputHook";
import useAOPStore from "../../../../Store/AOPStore";

// View Item Requests Modal Components
import Content from "../Modal/ItemRequests/Content";
import PPMPSummaryCards from "./PPMPSummaryCards";
import DashboardHeader from "./DashboardHeader";
import NewRequestModal from "../Modal/AddItemRequest/NewRequestModal";
import PPMPSubmissionModal from "../Modal/Dashboard/PPMPSubmissionModal";
import SuccessSubmissionModal from "../Modal/Dashboard/SuccessSubmissionModal";
import { happensNext } from "../../../../Data/constants";
import useItemRequestsHook from "../../../../Hooks/ItemRequest/ItemRequestHookv2";

function PPMPDashboard(props) {
  const location = useLocation();
  const pathName = location.pathname;

  const { requestsByUser } = useItemRequestStore();
  const { aop } = useAOPStore();

  const { getItemRequestByUser, postItmRequest } = useItemRequestsHook();
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
  const { setAlertDialog } = useModalHook();

  const [pageLoader, setPageLoader] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [pin, setPin] = useState("");
  const [year, setYear] = useState(nextYear);
  const [openViewItemRequest, setOpenItemRequest] = useState();
  const [openNewRequest, setOpenNewRequest] = useState(false);
  const [step, setStep] = useState(1);
  const [buttonLoader, setButtonLoader] = useState(false);
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
              title: message,
              description: "",
            });
            return;
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

  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submit = async () => {
    clearErrors();
    let hasError = false;

    itemReq.specs.forEach((spec, index) => {
      if (!spec.value.trim()) {
        setError(
          `specs[${index}]`,
          true,
          `Specification ${index + 1} is required.`,
        );
        hasError = true;
      }
    });
    if (!itemReq?.pin?.trim()) {
      setError("pin", true, "Authorization PIN is required.");
      hasError = true;
    }
    console.log(hasError);
    if (hasError) return;

    try {
      setButtonLoader(true);
      const payload = {
        name: itemReq.item_name || "",
        estimated_budget: itemReq?.estimated_budget ?? 0,
        item_unit_id: itemReq.unit?.id ?? null,
        item_category_id: itemReq.category?.id ?? null,
        item_classification_id: itemReq.classification?.id ?? null,
        market_research: itemReq?.market_research, // boolean
        specifications: itemReq?.specs?.map((spec) => ({
          description: spec?.value ?? "",
        })),
        authorization_pin: itemReq?.pin ?? "",
        terminology_category_id: itemReq?.variant?.id ?? null, // not required
      };

      await postItmRequest(payload, (status, message, data) => {
        if (status === 201) {
          setItemReq({
            classification: null,
            category: null,
            item_name: "",
            unit: null,
            estimated_budget: "",
            variant: null,
            market_research: false,
            specs: [
              { id: 1, value: "" },
              { id: 2, value: "" }, // initial two specs
            ],
            pin: "",
          });
          setAlertDialog({
            status: "success",
            title: "Request for new item successfully submitted.",
            description: message,
          });
          setButtonLoader(false);
          setOpenNewRequest(false); // close modal
          setStep(1); // reset to step 1 if using a stepper
        } else {
          setButtonLoader(false);
          setAlertDialog({
            status: "error",
            title: "Request Failed",
            description: message,
          });
        }
      });
    } catch (error) {
      console.log(error);
      setButtonLoader(false);
      setAlertDialog({
        status: "error",
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const isDispensing = dashboard?.is_dispensing;

  return (
    <Fragment>
      <PageTitle
        title={"Project Procurement Management Plan"}
        description={
          " The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
      />

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
      {/* <PageLoader isLoading={pageLoader} /> */}

      {/* View Item Requests Modal */}
      {openViewItemRequest && (
        <ModalComponent
          isOpen={openViewItemRequest}
          title={"Items Requested"}
          description={"Below are the items you’ve requested for this PPMP."}
          minWidth={"85%"}
          handleClose={() => setOpenItemRequest(false)}
          content={<Content data={requestsByUser} path={pathName} />}
        />
      )}

      {openNewRequest && (
        <NewRequestModal
          openNewRequest={openNewRequest}
          setOpenNewRequest={setOpenNewRequest}
          step={step}
          itemReq={itemReq}
          setItemReq={setItemReq}
          handlePreviousStep={handlePreviousStep}
          handleNextStep={handleNextStep}
          submit={submit}
          buttonLoader={buttonLoader}
        />
      )}

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
