import React from "react";
import { Box, Stack, Typography } from "@mui/joy";
import ChipComponent from "../Common/ChipComponent";
import { CircleSmall } from "lucide-react";

export const ActivityContainerComponent = ({
  label,
  text,
  withComment = false,
  reviewed = true,
  active,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: 2,
        padding: 1,
        boxShadow: active && "md",
        borderRadius: 8,
        borderColor: active ? "warning.400" : "neutral.100",
        "&: hover": {
          borderColor: !active && "neutral.200",
          cursor: "pointer",
        },
      }}
    >
      <Stack gap={1.5}>
        <Stack
          direction={{ md: "column", lg: "row" }}
          justifyContent={{ md: "start", lg: "space-between" }}
          alignItems={{ md: "start", lg: "center" }}
          rowGap={0.5}
        >
          <Typography level="body-xs" textColor={"neutral.800"}>
            {label}
          </Typography>{" "}
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
