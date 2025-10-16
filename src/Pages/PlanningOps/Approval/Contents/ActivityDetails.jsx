import { Fragment, useState } from "react";
import {
  useActivity,
  useActivityLoadingState,
} from "../../../../Hooks/AOP/ActivityHook";
import moment from "moment";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import { Box, Divider, Grid, Link, Sheet, Stack, Typography } from "@mui/joy";
import { CornerDownRight, ExternalLink } from "lucide-react";
import BoxComponent from "../../../../Components/Common/Card/BoxComponent";
import ContainerComponent from "../../../../Components/Common/ContainerComponent";
import { MarkReviewFooter } from "./MarkReviewFooter";
import ScrollableTableComponent from "../../../../Components/Common/Table/ScrollableTableComponent";
import { RESOURCES_HEADER } from "../../../../Data/Columns";
import { useUserTypes } from "../../../../Store/AuthStore";
import { AOP_RESOURCES } from "../../../../Data/TestData";
import DrawerComponent from "../../../../Components/Common/DrawerComponent";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";

export const ActivityDetails = () => {
  const { isPlanning } = useUserTypes();

  const [openResourcesModal, setOpenResourcesModal] = useState(false);
  const [openMarkModal, setOpenMarkModal] = useState(false);
  const activity = useActivity();
  const isLoading = useActivityLoadingState();

  const {
    activity_name,
    start_month,
    end_month,
    target: { q1, q2, q3, q4 } = {},
    resources = [],
    is_reviewed,
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
        noboxshadow
        // title={`Objective #${objectiveNumber}’s activity #${activityNumber}`}
        title={"Activity details"}
        description={
          "Scroll down below to mark this activity as “Reviewed” to help you in double-checking."
        }
        isLoading={isLoading}
        scrollable
        contentMaxHeight={!isPlanning ? "52vh" : "50vh"}
        contentMinHeight={!isPlanning ? "52vh" : "50vh"}
        footer={
          isPlanning && (
            <MarkReviewFooter
              is_reviewed={is_reviewed}
              openMarkModal={openMarkModal}
              setOpenMarkModal={setOpenMarkModal}
            />
          )
        }
      >
        <Grid
          container
          columns={{ md: 4, lg: 12 }}
          sx={{ width: !isPlanning ? "100%" : "auto" }}
          columnSpacing={!isPlanning ? 4 : 0}
          overflow={"hidden"}
        >
          <Grid item={"true"} xs={!isPlanning ? 6 : 12}>
            <Stack spacing={!isPlanning ? 2 : 1.5}>
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
                {[q1, q2, q3, q4]?.map((element, index) => (
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
                <Link
                  gap={0.5}
                  fontSize={12}
                  onClick={setOpenResourcesModal}
                  fontWeight={600}
                >
                  View resources <ExternalLink size={14} />
                </Link>
              </Typography>
              <Divider />
            </Stack>
          </Grid>

          <Grid item="true" xs={!isPlanning ? 6 : 12} mt={isPlanning && 2}>
            <Stack spacing={!isPlanning ? 2 : 1.5}>
              {/* PERSON */}
              <Typography
                level={titleStyles.level}
                fontWeight={titleStyles.fontWeight}
              >
                Responsible person
              </Typography>
              {responsible_people?.map(
                ({ name: person_name, designation = null }, index) => (
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
                        {person_name}
                      </Typography>
                      {designation && (
                        <Typography
                          level={titleStyles.level}
                          fontWeight={titleStyles.fontWeight}
                        >
                          {designation}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )
              )}

              {/* {!isPlanning && (
                <>
                  <Divider />
                  <MarkReviewFooter
                    openMarkModal={openMarkModal}
                    setOpenMarkModal={setOpenMarkModal}
                  />
                </>
              )} */}
            </Stack>
          </Grid>
        </Grid>
      </ContainerComponent>

      <DrawerComponent
        open={openResourcesModal}
        setOpen={setOpenResourcesModal}
        title={`Resources for this activity`}
        description={
          "The list below shows the list of all resources selected for this activity."
        }
        size="full"
        content={
          <ScrollableTableComponent
            columns={RESOURCES_HEADER}
            data={resources}
          />
        }
        // footer={<ButtonComponent label={"Close"} width={"auto"} />}
      />
    </Fragment>
  );
};
