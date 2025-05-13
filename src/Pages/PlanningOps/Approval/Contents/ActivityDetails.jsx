import React, { Fragment, useState } from "react";
import {
  useActivity,
  useActivityLoadingState,
} from "../../../../Hooks/AOP/ActivityHook";
import moment from "moment";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import { Box, Divider, Grid, Link, Stack, Typography } from "@mui/joy";
import { CornerDownRight, ExternalLink } from "lucide-react";
import BoxComponent from "../../../../Components/Common/Card/BoxComponent";
import ContainerComponent from "../../../../Components/Common/ContainerComponent";
import { MarkReviewFooter } from "./MarkReviewFooter";
import ScrollableTableComponent from "../../../../Components/Common/Table/ScrollableTableComponent";
import { RESOURCES_HEADER } from "../../../../Data/Columns";

export const ActivityDetails = () => {
  const [openResourcesModal, setOpenResourcesModal] = useState(false);
  const [openMarkModal, setOpenMarkModal] = useState(false);
  const activity = useActivity();
  const isLoading = useActivityLoadingState();

  const {
    activity_name,
    start_month,
    end_month,
    target: {
      first_quarter,
      second_quarter,
      third_quarter,
      fourth_quarter,
    } = {},
    resources = [],
    responsible_people = [],
  } = activity || {};

  // STYLES
  const titleStyles = { level: "body-xs", fontWeight: 400 };
  const valueStyles = {
    level: "body-sm",
    textColor: "neutral.900",
    fontWeight: 400,
  };
  return (
    <Fragment>
      <ContainerComponent
        noBoxShadow
        // title={`Objective #${objectiveNumber}’s activity #${activityNumber}`}
        title={"Activity details"}
        description={
          "Scroll down below to mark this activity as “Reviewed” to help you in double-checking."
        }
        isLoading={isLoading}
        scrollable
        contentMaxHeight={"47vh"}
        contentMinHeight={"47vh"}
        footer={
          <MarkReviewFooter
            openMarkModal={openMarkModal}
            setOpenMarkModal={setOpenMarkModal}
          />
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
            {activity_name}
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
            {[
              first_quarter,
              second_quarter,
              third_quarter,
              fourth_quarter,
            ]?.map((element, index) => (
              <Grid xs={1} key={index}>
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
                      {element}
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
            {moment(start_month).format("MMMM")} -
            {moment(end_month).format("MMMM")}
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
            <Link gap={0.5} fontSize={12} onClick={setOpenResourcesModal}>
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

          {responsible_people?.map(
            ({ user: { name: person_name, email } }, index) => (
              <Box key={index} display={"flex"} gap={1} alignItems={"start"}>
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
                    {person_name}
                  </Typography>
                  <Typography
                    level={titleStyles.level}
                    fontWeight={titleStyles.fontWeight}
                  >
                    {email}
                  </Typography>
                </Box>
              </Box>
            )
          )}
        </Stack>
      </ContainerComponent>

      {/* VIEW RESOURCES */}
      <ModalComponent
        isOpen={openResourcesModal}
        handleClose={() => setOpenResourcesModal(false)}
        title={`Resources for activity`}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        content={
          <Stack>
            <ScrollableTableComponent
              columns={RESOURCES_HEADER}
              data={resources}
            />
          </Stack>
        }
      />
    </Fragment>
  );
};
