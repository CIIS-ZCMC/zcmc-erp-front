import { Fragment, useEffect } from "react";

import { Typography, useTheme, Divider, Box } from "@mui/joy";

import useTimelinesStore from "../../../../Store/TimelinesStore";
import useTimelineHook from "../../../../Hooks/AOP/TimelineHook";

import BoxComponent from "@Components/Common/Card/BoxComponent";
import StepperComponent from "@Components/Stepper/StepperComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

import { AOP_TIMELINE } from "../../../../Data/constants";

const Timeline = ({ aopId, isAopLoading = false }) => {
  const { TITLE, SUBTITLE, EMPTY_STATE } = AOP_TIMELINE;

  const theme = useTheme();
  const color = theme.palette.custom;

  const { timelines, isLoading: isTimelineLoading } = useTimelinesStore();

  const { getTimelines } = useTimelineHook();

  useEffect(() => {
    if (!aopId) return;
    getTimelines(aopId, "aop", (status, message) => {
      if (!(status >= 200 && status < 300)) {
        return; //Toast error
      }
    });
  }, [aopId]);

  return (
    <Fragment>
      <BoxComponent height="58vh">
        <Typography level="title-lg">{TITLE}</Typography>

        <Typography
          level="body-xs"
          mt={0.5}
          sx={{
            color: color.fontLight,
          }}
        >
          {SUBTITLE}
        </Typography>

        <Divider
          sx={{
            my: 1,
            color: "gray",
          }}
        />

        <Box
          sx={{
            height: "calc(58vh - 80px)",
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
            mt: 3,
          }}
        >
          {isTimelineLoading || isAopLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ThreeDotsLoader />
            </Box>
          ) : (
            <Fragment>
              {timelines?.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  height={"50vh"}
                >
                  <Typography level="body-sm" sx={{ color: color.fontLight }}>
                    {EMPTY_STATE}
                  </Typography>
                </Box>
              ) : (
                <StepperComponent data={timelines} />
              )}
            </Fragment>
          )}
        </Box>
      </BoxComponent>
    </Fragment>
  );
};

export default Timeline;
