import React from "react";

import { Stack, Typography, Box, Avatar } from "@mui/joy";
import { formatPeso } from "../../../../../Utils/FormatPeso";
import {
  EmojiObjectsOutlined,
  LightbulbCircleOutlined,
  LightbulbOutline,
} from "@mui/icons-material";

const AccordionSummary = ({ objectiveName, activitiesCount, cost, index }) => {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        padding={1}
      >
        <Stack direction={"row"} spacing={2} flex={1} minWidth={0}>
          <Avatar color="primary">
            <EmojiObjectsOutlined />
          </Avatar>
          <Stack>
            <Typography level="body-xs" textTransform={"uppercase"}>
              #objective {index}
            </Typography>
            <Typography level="title-md" color={"primary"}>
              {objectiveName}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} spacing={10}>
          <Stack textAlign={"right"} width="120px">
            <Typography level="body-sm" textTransform={"capitalize"}>
              Activities
            </Typography>
            <Typography level="title-md" color={"primary"} fontWeight={"600"}>
              {activitiesCount}
            </Typography>
          </Stack>

          <Stack textAlign={"right"}>
            <Typography level="body-sm" textTransform={"capitalize"}>
              Cost
            </Typography>
            <Typography level="title-md" color={"primary"} fontWeight={"600"}>
              {formatPeso(cost)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default AccordionSummary;
