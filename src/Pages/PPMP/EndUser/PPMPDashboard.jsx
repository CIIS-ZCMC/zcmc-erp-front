import React, { Fragment, useEffect, useState } from "react";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  Link,
} from "@mui/joy";

import {
  PhilippinePesoIcon,
  ExternalLink,
  TargetIcon,
  CloudDownload,
} from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { useNavigate, useLocation } from "react-router-dom";
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
  Circle,
  CloudDownloadOutlined,
  Comment,
  East,
  FormatListNumbered,
  Handyman,
  Launch,
  TextSnippetOutlined,
  Warning,
  WarningAmber,
} from "@mui/icons-material";
import PageTitle from "@Components/Common/PageTitle";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { grey } from "@mui/material/colors";
import InputComponent from "@Components/Form/InputComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import useModalHook from "../../../Hooks/ModalHook";
import StepperComponent from "@Components/Stepper/StepperComponent";

import useItemRequestHook from "../../../Hooks/ItemRequest/ItemRequestHookv2";
import useItemRequestStore from "../../../Store/ItemRequestStore";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import useAOPStore from "../../../Store/AOPStore";

// Add New Item Request Components
import NewRequestContent from "./Modal/AddItemRequest/Content";

// View Item Requests Modal Components
import Content from "./Modal/ItemRequests/Content";
import Footer from "./Modal/ItemRequests/Footer";
import CardComponent from "@Components/Common/Card/CardComponent";

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
          pt: 3,
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
  const location = useLocation();
  const pathName = location.pathname;

  const { requestsByUser } = useItemRequestStore();
  const { aop } = useAOPStore();

  const { getItemRequestByUser } = useItemRequestHook();
  const { setError, clearErrors } = userErrorInputHook();

  const { data, current_page, per_page, next_page_url, prev_page_url, total } =
    requestsByUser || {};

  const navigate = useNavigate();
  const {
    dashboard,
    years,
    timeline,
    getPPMPDashboard,
    getYearList,
    postPPMP,
    getPPMPTimeline,
    postItemRequest,
    itemRequestStore,
  } = usePPMPHook();
  const { setAlertDialog } = useModalHook();

  useEffect(() => {
    console.log(dashboard);
  }, [dashboard]);

  const [pageLoader, setPageLoader] = useState(false);
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};
  const status = dashboard?.ppmp_application?.is_draft;

  const theme = useTheme();
  const color = theme.palette.custom;

  const [openSave, setOpenSave] = useState(false);
  const [pin, setPin] = useState("");
  const [year, setYear] = useState(nextYear);

  const [openViewItemRequest, setOpenItemRequest] = useState();
  const [openNewRequest, setOpenNewRequest] = useState();
  const [step, setStep] = useState(1);

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [activity, setActivity] = useState(null);
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

  const handleNavigate = () => {
    navigate("/ppmp/manage-items");
  };

  const AOP_ID = dashboard?.ppmp_application?.aop_application?.id;

  const happensNext = [
    {
      description: (
        <Typography level="body-sm" color="black">
          ● <b>Planning Office Review:</b> Your AOP will be reviewed by the
          Planning Office within 7–10 business days
        </Typography>
      ),
    },
    {
      description: (
        <Typography level="body-sm" color="black">
          ● <b>Notification:</b> You will receive an official notification once
          the review is complete
        </Typography>
      ),
    },
    {
      description: (
        <Typography level="body-sm" color="black">
          ● <b>Dashboard Updates:</b> Check your AOP Dashboard anytime to track
          the status of your submission
        </Typography>
      ),
    },
    {
      description: (
        <Typography level="body-sm" color="black">
          ● <b>Possible Outcomes:</b> Your AOP may be approved, returned for
          revision, or require additional information
        </Typography>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const payload = {
        status_id: 2,
        authorization_pin: pin,
      };

      await postPPMP(
        dashboard.ppmp_application.id,
        payload,
        (status, message, errors) => {
          if (status === 200) {
            console.log("here");
            setOpenSave(false);
            setPin("");
            setOpenSuccessDialog(true);
            getPPMPTimeline(
              dashboard?.ppmp_application?.id,
              (status, message) => {
                if (!(status >= 200 && status < 300)) {
                  // show toast error
                }
              },
            );
            return;
          } else {
            setAlertDialog({
              status: "error",
              title: "Submission Failed",
              description: message,
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

    getPPMPTimeline(AOP_ID, "ppmp", (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // show toast error
      }
    });
  }, [AOP_ID]);

  useEffect(() => {
    if (!assignedArea?.name) return;

    socket.emit("register-user", {
      userId: id,
      name: name,
      area: assignedArea.name,
    });
  }, [assignedArea]);

  const handleItemRequest = () => {
    setOpenItemRequest(true);

    const params = { status_id: 8 };

    (getItemRequestByUser(params),
      (status, message) => {
        console.log(params);
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

      await itemRequestStore(payload, (status, message, data) => {
        const alertData = {
          status: status === 201 ? "success" : "error",
          title: "Request for new item successfully submitted.",
          description: message,
        };

        setAlertDialog(alertData);

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
          setButtonLoader(false);
          setActivity(null);
          setSelectedActivities([]);
          setOpenNewRequest(false); // close modal
          setStep(1); // reset to step 1 if using a stepper
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

  return (
    <Fragment>
      <PageTitle
        title={"Project Procurement Management Planning"}
        description={
          " The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
      />

      <BoxComponent
        mt={3}
        height={"82vh"}
        boxShadow={"xs"}
        borderRadius={10}
        sx={{
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
            spacing={2}
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
                  years={years.years}
                  onChange={(value) => {
                    setYear(value);
                  }}
                />
              </Box>
              <Typography level="body-sm" sx={{ color: "white" }}>
                {/* Mission: This is a sample mission written by the requesting
                body. This could be as short as a single sentence but could be
                as long as two sentences if necessary. */}
                Mission :{" "}
                {dashboard?.mission ? dashboard?.mission : "No mission yet"}
              </Typography>
            </Stack>
            {dashboard?.ppmp_application?.status_id === 1 ||
            dashboard?.ppmp_application?.status_id === 6 ? (
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
                    label={
                      dashboard?.ppmp_application?.status_id === 1
                        ? "Submit AOP and PPMP for Review"
                        : "Resubmit AOP and PPMP for Review"
                    }
                    width="250px"
                    onClick={() => setOpenSave(true)}
                  />
                </Box>
              </Stack>
            ) : dashboard?.ppmp_application?.status_id === null ? (
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
            ) : (
              ""
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
              <Grid xs={8.5}>
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
                      height: "100%",
                      maxWidth: 800,
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                      gridTemplateRows: "repeat(2, 1fr)",
                      gap: 2,
                    }}
                  >
                    <PPMPCard
                      icon={
                        <Handyman sx={{ fontSize: 25, color: color.main }} />
                      }
                      label={"   Total Items"}
                      value={dashboard?.summary?.total_items_count}
                      description={`Contained from (${dashboard?.summary?.activity_count}) total combined activities`}
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
                      value={dashboard?.summary?.total_quantity}
                      description={`With a total cost of (₱ ${dashboard?.summary?.total_cost?.toLocaleString(
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
                      value={`₱ ${(dashboard?.summary?.total_cost).toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}`}
                      description={`as found in (${dashboard?.summary?.total_items_count}) items in total on this request`}
                    />
                    <PPMPCard
                      bgColor="#FBE2CC"
                      icon={<Comment sx={{ fontSize: 25, color: "orange" }} />}
                      label={"COMMENTS"}
                      value={dashboard?.summary?.comments_count}
                      description={`as found in (${dashboard?.summary?.items_with_comments_count}) items in total on this request`}
                    />
                  </Box>

                  <BoxComponent width="60%">
                    <Typography level="title-lg">PPMP Checklist</Typography>
                    <Box
                      sx={{
                        flex: 1, // take remaining height
                        overflowY: "auto", // scroll if content exceeds
                        maxHeight: "51vh", // important for flex scroll
                        pr: 1, // padding to avoid scrollbar overlapping content
                        mt: 2,
                      }}
                    >
                      <List size="lg" component="nav" variant="">
                        {dashboard?.checklist?.map((list, key) => (
                          <>
                            <ListItem>
                              <ListItemDecorator>
                                <Checkbox
                                  checked={!!list.status}
                                  color={!!list.status && "success"}
                                />
                              </ListItemDecorator>
                              <Stack>
                                <Typography
                                  level={list?.status ? "title-sm" : "body-sm"}
                                  sx={{
                                    color: list?.status ? grey[900] : grey[400],
                                  }}
                                >
                                  {list?.title}
                                </Typography>
                                <Typography
                                  level="body-xs"
                                  fontWeight={400}
                                  sx={{
                                    color: list?.status ? grey[700] : grey[400],
                                  }}
                                  textAlign={"justify"}
                                >
                                  {list?.description}
                                </Typography>
                              </Stack>
                            </ListItem>
                            <ListDivider inset={"gutter"} />
                          </>
                        ))}
                      </List>
                    </Box>
                  </BoxComponent>
                </BoxComponent>

                <Stack
                  direction={"row"}
                  alignItems={"flex-end"}
                  justifyContent={"space-between"}
                  pt={1}
                >
                  <Link
                    sx={{
                      fontSize: 12,
                      // textDecoration: "none",
                      textDecoration: "underline",
                      gap: 0.5,
                    }}
                    endDecorator={<CloudDownloadOutlined />}
                    // onClick={() => setOpenItemRequest(true)}
                  >
                    Print as (.XLS)
                  </Link>

                  <Stack
                    display={"flex"}
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {dashboard.ppmp_application.status_id === 1 ||
                      (dashboard.ppmp_application.status_id === 6 && (
                        <Link
                          sx={{
                            fontSize: 12,
                            // textDecoration: "none",
                            textDecoration: "underline",
                            gap: 0.5,
                          }}
                          onClick={() => setOpenNewRequest(true)}
                          endDecorator={<ExternalLink size={18} />}
                        >
                          Request new item
                        </Link>
                      ))}

                    <Link
                      sx={{
                        fontSize: 12,
                        // textDecoration: "none",
                        textDecoration: "underline",
                        gap: 0.5,
                      }}
                      onClick={() => handleItemRequest()}
                      endDecorator={<ExternalLink size={18} />}
                    >
                      View Item Request
                    </Link>
                  </Stack>
                </Stack>
              </Grid>
              <Grid
                xs={3.5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%", // make the grid occupy full available height
                }}
              >
                {/* Approval Timeline Here */}
                {timeline?.length > 0 ? (
                  <BoxComponent bgColor="#FFFFFF" p={2} height={"62vh"}>
                    <Typography level="title-lg">Approval Timeline</Typography>

                    <Typography
                      level="body-xs"
                      mt={0.5}
                      sx={{ color: color.fontLight }}
                    >
                      The list below shows the current status of the request.
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Stack
                      sx={{
                        height: "calc(60vh - 80px)", // adjust for title, subtitle, divider
                        overflowY: "auto",
                        overflowX: "hidden", // prevent horizontal overflow
                        pr: 1, // optional padding for scrollbar
                        mt: 3,
                      }}
                    >
                      <StepperComponent data={timeline} />
                    </Stack>
                  </BoxComponent>
                ) : (
                  <BoxComponent height="62vh" padding={2}>
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
                      height={"50vh"}
                    >
                      <Typography
                        level="body-sm"
                        sx={{ color: color.fontLight }}
                      >
                        No transactions done yet.
                      </Typography>
                    </Box>
                  </BoxComponent>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </BoxComponent>
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
        <ModalComponent
          isOpen={openNewRequest}
          handleClose={() => setOpenNewRequest(false)}
          title={step === 1 ? "General information" : "Specifications"}
          description={
            step === 1
              ? "Fill in the item information to create it"
              : "List down details for the item you want to cretae to specify it."
          }
          maxWidth={"500px"}
          height={step === 1 ? "auto" : step === 2 ? "680px" : "650px"}
          content={
            <NewRequestContent
              step={step}
              itemReq={itemReq}
              setItemReq={setItemReq}
            />
          }
          leftButtonLabel={step > 1 ? "Back to previous" : "Cancel"}
          leftButtonAction={() => {
            if (step > 1) {
              handlePreviousStep();
            } else {
              setOpenNewRequest(false);
            }
          }}
          rightButtonLabel={step < 2 ? "Next step" : "Confirm and save"}
          rightButtonAction={() => {
            if (step < 2) {
              handleNextStep();
            } else {
              submit();
            }
          }}
          isLoading={buttonLoader}
          hasActionButtons
        />
      )}

      {/* call api item request by user first */}
      {openSave && (
        <ModalComponent
          isOpen={openSave}
          title={
            <Typography color="success">
              Official Submission Confirmation
            </Typography>
          }
          description={`You are about to officially submit your Annual Operational Plan and Project Procurement Management Plan for Fiscal Year ${nextYear} to the approving bodies for review and approval.`}
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
          leftButtonAction={() => handleSubmit()}
        />
      )}

      {openSuccessDialog && (
        <ModalComponent
          isOpen={openSuccessDialog}
          title={
            <Typography level="title-lg" color="">
              AOP and PPMP for F.Y. {nextYear}{" "}
              <b style={{ fontWeight: 600, color: "green" }}>
                successfully submitted for review.
              </b>
            </Typography>
          }
          description="Your AOP and PPMP applications has been sent to designated to the next approving body and notified them for approvals."
          content={
            <Stack padding={2}>
              <CardComponent
                statusColor={"#0288D1"}
                bgcolor={"#E0F5FF"}
                justifyContentHeader={"flex-start"}
                cardHeader={
                  <Typography
                    level="title-lg"
                    startDecorator={<TextSnippetOutlined />}
                    color="primary"
                    mb={2}
                  >
                    What Happens Next?
                  </Typography>
                }
                cardBody={
                  <Stack
                    spacing={2}
                    textAlign={"left"}
                    sx={{ textAlign: "justify" }}
                  >
                    {happensNext.map((item, index) => item.description)}
                  </Stack>
                }
              />
            </Stack>
          }
          maxWidth={"571px"}
          handleClose={() => setOpenSuccessDialog(false)}
          hasActionButtons
          noRightButton={true}
          leftButtonLabel="Close"
          leftButtonAction={() => setOpenSuccessDialog(false)}
        />
      )}
    </Fragment>
  );
}

export default PPMPDashboard;
