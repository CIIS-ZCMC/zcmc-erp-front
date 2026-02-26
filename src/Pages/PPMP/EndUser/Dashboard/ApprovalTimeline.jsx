import BoxComponent from "@Components/Common/Card/BoxComponent";
import StepperComponent from "@Components/Stepper/StepperComponent";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment } from "react";

export default function ApprovalTimeline({
  timeline = [],
  isDispensing = false,
}) {
  const theme = useTheme();
  const color = theme.palette.custom;
  return (
    <Fragment>
      {/* Approval Timeline Here */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: !isDispensing ? "60vh" : "40vh", // 👈 parent owns height
          minHeight: 0, // 🔑 required for flex scrolling children
          borderColor: "neutral.100",
          bgcolor: "white",
        }}
      >
        <Box padding={2}>
          <Typography level="title-lg">Approval Timeline</Typography>

          <Typography level="body-xs" mt={0.5} sx={{ color: color.fontLight }}>
            The list below shows the current status of the request.
          </Typography>

          <Divider sx={{ my: 1 }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto", // ✅ only this scrolls
            pr: 1,
            p: 1,
            display: timeline?.length > 0 ? "none" : "flex",
            alignItems: timeline?.length > 0 ? "none" : "center",
            justifyContent: timeline?.length > 0 ? "none" : "center",
          }}
        >
          {timeline?.length > 0 ? (
            <StepperComponent data={timeline} />
          ) : (
            <Typography level="body-sm" sx={{ color: color.fontLight }}>
              No transactions done yet.
            </Typography>
          )}
        </Box>
      </Box>
    </Fragment>
  );
}
