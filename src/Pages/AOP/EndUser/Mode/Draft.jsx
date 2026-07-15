import React from "react";

import { Stack, Box, Typography, useTheme, Avatar } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import {
  InsertComment,
  PendingActions,
  Warning,
  WarningAmber,
  WarningOutlined,
} from "@mui/icons-material";

import ButtonComponent from "@Components/Common/ButtonComponent";

import {
  STATUS_LABELS,
  STATUS_MESSAGES,
  AOP_BUTTON_LABEL,
} from "../../../../Data/constants";
import { orange } from "@mui/material/colors";
import ChipComponent from "@Components/Common/ChipComponent";

const Draft = ({ status, commentsCount, setValue }) => {
  const theme = useTheme();
  const color = theme.palette.custom;

  const navigate = useNavigate();

  const statusLabel = STATUS_LABELS[status] ?? "";
  const isDraftOrReturned = ["Draft", "Returned"].includes(statusLabel);

  return (
    <>
      {isDraftOrReturned ? (
        <Stack
          bgcolor="#FFF4E5"
          borderRadius={5}
          direction="row"
          alignItems="center"
          padding={2}
          spacing={1.5}
          width={"80%"}
        >
          <WarningAmber
            sx={{
              color: color.warning,
              fontSize: 20,
            }}
          />

          <Box width="100%">
            <Typography
              level="body-sm"
              color="warning"
              sx={{ fontWeight: 600 }}
            >
              Status: {statusLabel}
            </Typography>

            <Typography level="body-xs" color="warning">
              {STATUS_MESSAGES[status] ?? "Unknown AOP status."}
            </Typography>
          </Box>

          <Box width="450px">
            <ButtonComponent
              label={AOP_BUTTON_LABEL[status] ?? "Submit AOP"}
              onClick={() => navigate("/aop/summary")}
              fullWidth
            />
          </Box>
        </Stack>
      ) : (
        <Stack gap={1} width={"80%"} alignItems="flex-end">
          <ButtonComponent
            label="AOP Overview"
            variant={"soft"}
            onClick={() => navigate("/aop/summary")}
            startDecorator={<PendingActions />}
            color="primary"
            width="200px"
          />
          <ButtonComponent
            label="All Feedback"
            variant={"soft"}
            onClick={() => setValue(true)}
            startDecorator={<InsertComment />}
            endDecorator={
              <ChipComponent
                label={commentsCount}
                sx={{ bgcolor: orange[800], fontSize: 13 }}
                variant={"solid"}
              />
            }
            color="primary"
            width="200px"
          />
        </Stack>
      )}
    </>
  );
};

export default Draft;
