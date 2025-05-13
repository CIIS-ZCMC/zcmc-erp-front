import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useParams } from "react-router-dom";
import { AOP_CONSTANTS, approvalActions } from "../../../Data/constants";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
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
import moment from "moment";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import SimpleCommentComponent from "../../../Components/Comments/SimpleCommentComponent";
import { ACTIVITY_COMMENTS, MANAGE_AOP_APPROVAL } from "../../../Data/TestData";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import InputComponent from "../../../Components/Form/InputComponent";
import { useAOPApplication } from "../../../Hooks/AOP/AOPApplicationsHook";
import { useActivityActions } from "../../../Hooks/AOP/ActivityHook";
import { localStorageGetter } from "../../../Utils/LocalStorage";
import RadioButtonComponent from "../../../Components/Common/RadioButtonComponent";
import PostCommentComponent from "../../../Components/Form/PostCommentComponent";
import ObjectivesList from "./Contents/ObjectivesList";
import { ActivityDetails } from "./Contents/ActivityDetails";
import { useComments } from "../../../Hooks/CommentHook";
import { CommentsDetails } from "./Contents/CommentsDetails";

export default function ManageAOP() {
  const { id } = useParams();

  // STATES
  const [action, setAction] = useState("approve");
  // const comments = useComments();
  // // AOP HOOK
  // const AOPApplication =
  //   useAOPApplication() ?? localStorageGetter("aopApplication");

  // ACTIVITY HOOK
  // const defaultActivityId = AOPApplication[0]?.activities[0]?.id;

  // const { getActivityById } = useActivityActions();

  // STYLES
  const titleStyles = { level: "body-xs", fontWeight: 400 };

  // MODAL
  const { setAlertDialog } = useModalHook();
  const [openProcessModal, setOpenProcessModal] = useState(false);

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

  // useEffect(() => {
  //   getActivityById(defaultActivityId, () => {});
  // }, []);

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
                <ObjectivesList />
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
                <ActivityDetails />
              </ContainerComponent>
            </Grid>

            {/* COMMENT DETAILS  */}
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
                footer={<PostCommentComponent />}
              >
                <CommentsDetails />
              </ContainerComponent>
            </Grid>
          </Grid>
        </Box>
      </Stack>

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
        maxWidth={500}
        content={
          <Stack gap={2} py={1}>
            <Typography level="title-sm" mt={1}>
              Select the action you would like to take:
            </Typography>
            <RadioButtonComponent
              actions={approvalActions}
              value={action}
              setValue={setAction}
            />
            <TextareaComponent
              minRows={2}
              label={"Remarks"}
              maxRows={200}
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
