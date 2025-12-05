import React, { useEffect } from "react";

import { Avatar, Stack, Typography } from "@mui/joy";

import { formattedLongDate } from "../../../../../Utils/formattedLongDate";
import formattedPrice from "../../../../../Utils/formattedPrice";
import { CircleIcon } from "lucide-react";
import {
  Cancel,
  CheckCircle,
  Circle,
  ExtensionOutlined,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const AccordionSummary = ({
  activityIndex,
  name,
  startMonth,
  endMonth,
  isGadRelated,
  totalCost,
  resourcesCount,
  peopleCount,
}) => {
  // useEffect(() => {
  //     console.log(startMonth)
  //     console.log(endMonth)
  // }, [startMonth, endMonth])

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={2}
        width={"100%"}
      >
        <Stack flex={1} minWidth={0} direction={"row"} spacing={1}>
          <Avatar color="neutral" size={"lg"}>
            <ExtensionOutlined />
          </Avatar>
          <Stack>
            <Typography level="body-xs" textTransform={"uppercase"}>
              # Activity {activityIndex}
            </Typography>

            <Typography level="title-sm">{name}</Typography>

            <Typography
              level="body-xs"
              // color={'primary'}
            >
              {startMonth && endMonth
                ? `${formattedLongDate(startMonth)} to ${formattedLongDate(
                    endMonth
                  )}`
                : "Please select a start month and end month"}
            </Typography>
          </Stack>
        </Stack>

        {/* GAD Related */}
        <Stack direction="row" alignItems="center" width="180px">
          <Typography
            level="body-xs"
            textTransform="capitalize"
            startDecorator={
              isGadRelated ? (
                <CheckCircle sx={{ fontSize: 20, color: grey[400] }} />
              ) : (
                <Cancel sx={{ fontSize: 20, color: grey[400] }} />
              )
            }
            color="neutral"
          >
            {isGadRelated ? "GAD-related" : "Not GAD-related"}
          </Typography>
        </Stack>
        {/* Resources */}
        <Circle sx={{ fontSize: 10, color: grey[300], pr: 5 }} />

        <Stack direction="row" alignItems="center" width="120px">
          <Typography level="body-xs" color="neutral">
            {resourcesCount} Resources
          </Typography>
        </Stack>
        {/* Personnel */}
        <Circle sx={{ fontSize: 10, color: grey[300], pr: 5 }} />

        <Stack direction="row" alignItems="center" width="120px">
          <Typography level="body-xs" color="neutral">
            {peopleCount} Personnel
          </Typography>
        </Stack>

        {/* Cost */}
        <Stack width="140px" alignItems="flex-end">
          <Typography level="body-sm" color="neutral">
            Cost
          </Typography>
          <Typography level="title-md" fontWeight={600} color="primary">
            {formattedPrice(totalCost)}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default AccordionSummary;
