import React from "react";
import BoxComponent from "../Common/Card/BoxComponent";
import { Box, Stack, Typography } from "@mui/joy";
import ChipComponent from "../Common/ChipComponent";
import { CircleSmall } from "lucide-react";

export const ActivityContainerComponent = ({
  label,
  text,
  withComment = true,
  reviewed = true,
  active,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: active ? 2 : 1,
        padding: 1,
        borderRadius: 8,
        borderColor: active ? "primary.200" : "neutral.100",

        "&: hover": {
          borderColor: !active && "neutral.200",
          cursor: "pointer",
          boxShadow: !active && "sm",
        },
      }}
    >
      <Stack gap={1}>
        <Stack
          direction={"row-reverse"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box display={"flex"} gap={0.5}>
            {withComment && (
              <ChipComponent
                label={"With comments"}
                size="sm"
                variant={"soft"}
              />
            )}
            {reviewed && (
              <ChipComponent
                label={"Reviewed"}
                size="sm"
                variant={"soft"}
                color={"success"}
                startDecorator={<CircleSmall size={12} />}
              />
            )}
          </Box>
          <Typography level="body-sm" textColor={"neutral.800"}>
            {label}
          </Typography>
        </Stack>

        <Typography
          level="body-xs"
          sx={{
            fontWeight: 400,
            color: "neutral.500",
          }}
        >
          {text}
        </Typography>
      </Stack>
    </Box>
  );
};
