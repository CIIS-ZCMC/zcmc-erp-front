import React from "react";

import { Card, CardContent, CardActions, Stack, Divider } from "@mui/joy";
import { blue } from "@mui/material/colors";

const CardComponent = ({
  statusColor,
  cardHeader,
  cardBody,
  cardActions,
  height,
  justifyContentHeader,
  justifyContentActions = "flex-end",
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
            sx={{ zIndex: 0 }}
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

            <CardActions sx={{ justifyContent: "flex-end", zIndex: 0 }}>
              <Stack
                direction={direction ? direction : "column"}
                alignItems={"center"}
                justifyContent={justifyContentActions}
                width={actionWidth}
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
