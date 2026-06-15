import React from "react";

import { Stack, Typography, Box, Avatar, useTheme } from "@mui/joy";
import { formatPeso } from "../../../../../Utils/FormatPeso";
import { EmojiObjectsOutlined } from "@mui/icons-material";

const AccordionSummary = ({ objectiveName, activitiesCount, cost, index }) => {
  const theme = useTheme();
  const color = theme.palette.custom;
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        padding={1}
      >
        <Stack direction={"row"} spacing={2} width={"100%"}>
          <Avatar color="primary">
            <EmojiObjectsOutlined />
          </Avatar>
          <Stack>
            <Typography level="body-xs" textTransform={"uppercase"}>
              #objective {index}
            </Typography>
            <Typography level="title-md" sx={{ color: color.main }}>
              {objectiveName}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} width={"40%"}>
          <Stack textAlign={"right"} width="50%">
            <Typography level="body-sm" textTransform={"capitalize"}>
              Activities
            </Typography>
            <Typography
              level="title-md"
              sx={{ color: color.main }}
              fontWeight={"600"}
            >
              {activitiesCount}
            </Typography>
          </Stack>

          <Stack textAlign={"right"} width={"50%"}>
            <Typography level="body-sm" textTransform={"capitalize"}>
              Cost
            </Typography>
            <Typography
              level="title-md"
              sx={{ color: color.main }}
              fontWeight={"600"}
            >
              {formatPeso(cost)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default AccordionSummary;
