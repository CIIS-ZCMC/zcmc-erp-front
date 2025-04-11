import React, { Fragment, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useParams } from "react-router-dom";
import { AOP_CONSTANTS } from "../../../Data/constants";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  Radio,
  Stack,
  Typography,
} from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { CornerDownRight, ExternalLink } from "lucide-react";
import CustomAccordionComponent from "../../../Components/Common/Accordion/CustomAccordionComponent";
import EllipsisComponent from "../../../Components/Common/Typography/EllipsisComponent";
import { ActivityContainerComponent } from "../../../Components/Activities/ActivityContainerComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import moment from "moment/moment";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import SimpleCommentComponent from "../../../Components/Comments/SimpleCommentComponent";
import { ACTIVITY_COMMENTS, MANAGE_AOP_APPROVAL } from "../../../Data/TestData";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import InputComponent from "../../../Components/Form/InputComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";

export default function ManageAOP() {
  const { id } = useParams();
  const { comments } = ACTIVITY_COMMENTS;

  // ACCORDION DATA
  const [expanded, setExpanded] = useState([
    { name: "parent", id: MANAGE_AOP_APPROVAL[0]?.id },
  ]);
  const [expandedActivity, setExpandedActivity] = useState([
    // { name: "child", id: 0 },
  ]);
  const [activeActivity, setActiveActivity] = useState(null);

  // STYLES
  const titleStyles = { level: "body-xs", fontWeight: 400 };
  const valueStyles = {
    level: "body-sm",
    textColor: "neutral.900",
    fontWeight: 400,
  };

  // MODAL
  const { setAlertDialog } = useModalHook();
  const [openModal, setOpenModal] = useState(false);
  const [openProcessModal, setOpenProcessModal] = useState(false);

  // FUNCTIONS
  const handeEditObjective = (id) => {
    setOpenModal(true);
  };

  const handleClickActivity = (id) => {
    setActiveActivity(id);
  };

  const handleProcessRequest = () => {
    setOpenProcessModal(true);
  };

  const handleShowAlert = () => {
    const data = {
      status: 200,
      title: "AOP request for F.Y. “2026” successfully approved.",
      description:
        "Everyone can now see the changes you’ve made. The request is now ready for processing of the next approving body (Division Chief).",
    };
    setOpenProcessModal(false);
    setAlertDialog(data);
  };

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Manage AOP{" "}
              <Typography textColor={"success.500"}>#{id} </Typography>
              for Fiscal year 2026
            </Typography>
          }
          description={AOP_CONSTANTS?.AOP_SUBHEADING}
        />
        {/* CONTENT */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 12,
            border: 1,
            borderColor: "neutral.100",
            padding: 0,
            pr: 2.5,
          }}
        >
          <Grid
            container
            columns={{ xs: 4, sm: 4, md: 4, lg: 12 }}
            columnSpacing={{ md: 0, lg: 3 }}
            rowSpacing={{ xs: 1, sm: 3, md: 1 }}
            sx={{
              minHeight: "84vh",
              height: "84vh",
              msOverflowY: "auto",
              overflowY: "auto",
            }}
          >
            {/* OBJECTIVES  */}
            <Grid item="true" xs={4} height={{ md: "auto", lg: "100%" }}>
              <ContainerComponent
                title={"List of objectives and activities"}
                description={"This is a subtitle"}
                footer={
                  <Stack direction={"row"} spacing={2}>
                    <ButtonComponent
                      label={"Process request"}
                      onClick={handleProcessRequest}
                    />

                    <Link gap={0.5} fontSize={12}>
                      Go to feedback <ExternalLink size={14} />
                    </Link>
                  </Stack>
                }
                scrollable
                contentMaxHeight={"64vh"}
                contentMinHeight={"64vh"}
              >
                <Stack width={400} gap={1} sx={{ width: "100%" }}>
                  {MANAGE_AOP_APPROVAL.map(
                    (
                      {
                        id,
                        function_description,
                        objective,
                        success_indicator,
                        activity_count,
                        activities,
                      },
                      objective_key
                    ) => (
                      <CustomAccordionComponent
                        key={objective_key}
                        id={id}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title={
                          <Typography>
                            Objective #{objective_key + 1} -
                            <Typography
                              textColor={"success.700"}
                              fontWeight={600}
                            >
                              {function_description}
                            </Typography>
                          </Typography>
                        }
                        withEdit
                        name="parent"
                        onClickEdit={() => handeEditObjective(id)}
                      >
                        <Stack gap={2} px={0.5}>
                          <EllipsisComponent
                            label={"Objective:"}
                            text={objective}
                          />
                          <EllipsisComponent
                            label={"Success indicators:"}
                            text={success_indicator}
                          />

                          <CustomAccordionComponent
                            size={"sm"}
                            expanded={expandedActivity}
                            setExpanded={setExpandedActivity}
                            title={`Activities (${activity_count})`}
                            id={objective_key}
                            name="child"
                          >
                            <Stack gap={1}>
                              {activities.map(
                                (
                                  {
                                    id,
                                    description,
                                    with_comment,
                                    is_reviewed,
                                  },
                                  activity_key
                                ) => (
                                  <ActivityContainerComponent
                                    key={activity_key}
                                    onClick={() => handleClickActivity(id)}
                                    active={id === activeActivity}
                                    label={`Activity #${activity_key + 1}`}
                                    text={description}
                                    withComment={with_comment}
                                    reviewed={is_reviewed}
                                  />
                                )
                              )}
                            </Stack>
                          </CustomAccordionComponent>
                        </Stack>
                      </CustomAccordionComponent>
                    )
                  )}
                </Stack>
              </ContainerComponent>
            </Grid>

            {/* ACTIVITY DETAILS  */}
            <Grid item="true" xs={4} mt={3}>
              <ContainerComponent
                noBoxShadow
                title={"Objective #1’s activity #4"}
                description={
                  "This is a subheading. It should add more context to the interaction."
                }
                scrollable
                contentMaxHeight={"49vh"}
                contentMinHeight={"49vh"}
                footer={
                  <Stack gap={2}>
                    {/* REVIEW */}
                    <Typography
                      level={titleStyles.level}
                      fontWeight={titleStyles.fontWeight}
                    >
                      Double-checking support
                    </Typography>
                    <FormControl sx={{ gap: 1 }}>
                      <Checkbox
                        label="Mark activity as “Reviewed”"
                        size="sm"
                        sx={{ fontSize: 12, color: "neutral.800" }}
                        color="success"
                      />
                      <FormHelperText
                        sx={{ fontSize: 11, color: "neutral.400" }}
                      >
                        Showing marks helps you determine which among all
                        activities has successfully passed your double-checking
                        so that you don't have to double-check again.
                      </FormHelperText>

                      <FormHelperText
                        sx={{ fontSize: 12, color: "neutral.600" }}
                      >
                        Marked as <b>“Reviewed”</b> on {moment().format("ll")}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                }
              >
                <Stack gap={1.5} width={"100%"} overflow={"hidden"}>
                  {/* ACTIVITY NAME */}
                  <Typography
                    level={titleStyles.level}
                    fontWeight={titleStyles.fontWeight}
                  >
                    Programs/activities/projects
                  </Typography>
                  <Typography
                    level={valueStyles.level}
                    textColor={valueStyles.textColor}
                    fontWeight={valueStyles.fontWeight}
                  >
                    This is a sample objective for the Core function. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </Typography>
                  <Divider />

                  {/* TARGET */}
                  <Typography
                    level={titleStyles.level}
                    fontWeight={titleStyles.fontWeight}
                  >
                    Target (by quarter)
                  </Typography>

                  <Grid container columns={{ xs: 2, sm: 4 }} spacing={1}>
                    {Array.from({ length: 4 }, (item, index) => (
                      <Grid xs={1}>
                        <BoxComponent>
                          <Stack gap={1}>
                            <Typography level={titleStyles.level}>
                              Q{index + 1}:
                            </Typography>

                            <Typography
                              level={valueStyles.level}
                              textColor={valueStyles.textColor}
                              fontWeight={valueStyles.fontWeight}
                            >
                              123
                            </Typography>
                          </Stack>
                        </BoxComponent>
                      </Grid>
                    ))}
                  </Grid>
                  <Divider />

                  {/* TIMEFRAME */}
                  <Typography
                    level={titleStyles.level}
                    fontWeight={titleStyles.fontWeight}
                  >
                    Timeframe
                  </Typography>

                  <Typography
                    level={valueStyles.level}
                    textColor={valueStyles.textColor}
                    fontWeight={valueStyles.fontWeight}
                  >
                    January - December
                  </Typography>
                  <Divider />

                  {/* RESOURCES */}
                  <Typography
                    level={titleStyles.level}
                    display={"flex"}
                    justifyContent={"space-between"}
                    fontWeight={titleStyles.fontWeight}
                  >
                    Resources for this activity
                    <Link gap={0.5} fontSize={12}>
                      View resources <ExternalLink size={14} />
                    </Link>
                  </Typography>
                  <Divider />

                  {/* PERSON */}
                  <Typography
                    level={titleStyles.level}
                    fontWeight={titleStyles.fontWeight}
                  >
                    Responsible person
                  </Typography>

                  {Array.from({ length: 1 }, (index) => (
                    <Box
                      key={index}
                      display={"flex"}
                      gap={1}
                      alignItems={"start"}
                    >
                      <CornerDownRight
                        size={14}
                        style={{ color: "green", marginTop: 4 }}
                      />
                      <Box>
                        <Typography
                          level={valueStyles.level}
                          textColor={valueStyles.textColor}
                          fontWeight={valueStyles.fontWeight}
                        >
                          Maryn Dela Cerna, MD
                        </Typography>
                        <Typography
                          level={titleStyles.level}
                          fontWeight={titleStyles.fontWeight}
                        >
                          Computer Programmer II - IISU
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </ContainerComponent>
            </Grid>

            {/* ACTIVITY DETAILS  */}
            <Grid item="true" xs={4} mt={3}>
              <ContainerComponent
                noBoxShadow
                title={"Comments for the selected activity"}
                description={
                  "This is a subheading. It should add more context to the interaction."
                }
                scrollable
                contentMaxHeight={"35.8vh"}
                contentMinHeight={"35.8vh"}
                footer={
                  <Stack gap={2}>
                    <TextareaComponent
                      label={"Comment"}
                      color="success"
                      minRows={7.3}
                      maxRows={7.3}
                    />
                    <Box>
                      <ButtonComponent label={"Post comment"} width="auto" />{" "}
                    </Box>
                  </Stack>
                }
              >
                <Stack gap={2.5} mr={1}>
                  {comments.map(({ id, user, comment, date }, index) => (
                    <SimpleCommentComponent
                      key={index}
                      name={user}
                      comment={comment}
                      date={date}
                    />
                  ))}
                </Stack>
              </ContainerComponent>
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {/* MODAL */}
      <ModalComponent
        isOpen={openModal}
        handleClose={() => setOpenModal(false)}
        title={`Revisions for objective #14 - Core`}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        content={
          <Stack gap={2} py={1}>
            <TextareaComponent minRows={4} label={"Objective"} />
            <TextareaComponent minRows={4} label={"Success indicators"} />

            <Divider />

            <InputComponent
              type="password"
              label="Authorization pin"
              helperText={
                "Confirm you action by typing-in your authorization PIN."
              }
              // setValue={handlePinInput}
              // value={pin}
            />
          </Stack>
        }
      />
      {/* PROCESS REQUEST */}
      <ModalComponent
        isOpen={openProcessModal}
        handleClose={() => setOpenProcessModal(false)}
        title={`Revisions for objective #14 - Core`}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        leftButtonLabel="Back to request"
        rightButtonLabel="Confirm and save"
        rightButtonAction={handleShowAlert}
        content={
          <Stack gap={2} py={1}>
            Select status
            <TextareaComponent
              minRows={2}
              label={"Remarks"}
              placeholder={"Enter your remarks here"}
            />
            <Divider />
            <InputComponent
              type="password"
              label="Authorization pin"
              helperText={
                "Confirm you action by typing-in your authorization PIN."
              }
              // setValue={handlePinInput}
              // value={pin}
            />
          </Stack>
        }
      />
    </Fragment>
  );
}
