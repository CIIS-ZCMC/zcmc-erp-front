import React from "react";

import {
  Card,
  CardContent,
  CardActions,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/joy";
import IconButtonComponent from "../IconButtonComponent";
import { blue } from "@mui/material/colors";

const CardComponent = ({
  statusColor,
  cardHeader,
  cardBody,
  cardActions,
  height,
  justifyContentHeader,
  justifyContentActions,
  direction,
  bgcolor,
  contentPadding,
  withDividerStyle = false,
  actionWidth,
  boxShadow,
}) => {
  return (
    <>
      <Card
        sx={{
          textAlign: "center",
          overflow: "visible",
          position: "relative",
          height: height,
          border: "none", // remove all borders
          borderLeft: `6px solid ${statusColor}`, // keep ONLY left border
          borderRadius: 20,
          bgcolor: bgcolor,
          boxShadow: boxShadow,
        }}
      >
        <CardContent sx={{ padding: contentPadding }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={
              justifyContentHeader ? justifyContentHeader : "flex-end"
            }
          >
            {cardHeader}
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"start"}
            justifyContent={"space-between"}
            gap={5}
          >
            {cardBody}
          </Stack>
        </CardContent>

        {cardActions && (
          <>
            <Divider
              inset="none"
              sx={{
                bgcolor: withDividerStyle && blue[100],
                padding: withDividerStyle && 0.09,
              }}
            />

            <CardActions
              sx={{
                justifyContent: justifyContentActions ? "" : "flex-end",
                zIndex: 1,
              }}
            >
              <Stack
                direction={direction ? direction : "column"}
                alignItems={"center"}
                width={actionWidth}
                sx={{
                  zIndex: 1,
                }}
              >
                {cardActions}
              </Stack>
            </CardActions>
          </>
        )}
      </Card>
    </>
  );
};

export default CardComponent;
