import React from "react";

import { Stack, Box, Typography, useTheme } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Warning } from "@mui/icons-material";

import ButtonComponent from "@Components/Common/ButtonComponent";

import {
  STATUS_LABELS,
  STATUS_MESSAGES,
  AOP_BUTTON_LABEL,
} from "../../../../Data/constants";

const Draft = ({ status }) => {
  const theme = useTheme();
  const color = theme.palette.custom;

  const navigate = useNavigate();

  return (
    <>
      <Stack
        bgcolor={STATUS_LABELS[status] !== "Approved" ? "#FFF4E5" : ""}
        borderRadius={5}
        direction={"row"}
        alignItems="center"
        padding={2}
        spacing={STATUS_LABELS[status] !== "Approved" ? 1.5 : 0}
        width={"75%"}
        justifyContent={STATUS_LABELS[status] === "Approved" && "right"}
      >
        <Warning
          sx={{
            color: color.warning,
            fontSize: 20,
            display: STATUS_LABELS[status] !== "Approved" ? "flex" : "none",
          }}
        />
        <Box
          width={"100%"}
          display={STATUS_LABELS[status] !== "Approved" ? "block" : "none"}
        >
          <Typography level="body-sm" color="warning" sx={{ fontWeight: 600 }}>
            Status: {STATUS_LABELS[status] ?? ""}
          </Typography>
          <Typography level="body-xs" color="warning">
            {STATUS_MESSAGES[status] ?? "Unknown AOP status."}
          </Typography>
        </Box>
        <Box width={"450px"}>
          <ButtonComponent
            label={AOP_BUTTON_LABEL[status] ?? "Create PPMP"}
            onClick={() => navigate("/aop/summary")}
            fullWidth={true}
          />
        </Box>
      </Stack>
    </>
  );
};

export default Draft;
