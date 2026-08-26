import StepperComponent from "@Components/Stepper/StepperComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment } from "react";

export default function ApprovalTimeline({
  timeline = [],
  isDispensing = false,
  pageLoader = false,
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
          height: !isDispensing ? "65vh" : "45vh", // 👈 parent owns height
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
            p: 2,
            ...(pageLoader || !timeline?.length
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {}),
          }}
        >
          {pageLoader ? (
            <ThreeDotsLoader />
          ) : timeline?.length > 0 ? (
            <Box sx={{ width: "100%" }}>
              <StepperComponent data={timeline} />
            </Box>
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
