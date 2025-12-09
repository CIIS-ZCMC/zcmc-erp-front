import React from "react";

import { Stack, Typography } from "@mui/joy";
import { TriangleAlert } from "lucide-react";

import { AOP_SUMMARY } from "../../../../../Data/constants";
import { blue } from "@mui/material/colors";

const CardHeader = () => {
  const { SUMMARY_CARD_HEADER } = AOP_SUMMARY;

  return (
    <>
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <Typography
          color="primary"
          level="body-md"
          fontWeight={600}
          alignItems={"center"}
          startDecorator={
            <TriangleAlert size={20} style={{ color: blue[800] }} />
          }
        >
          {SUMMARY_CARD_HEADER}
        </Typography>
      </Stack>
    </>
  );
};

export default CardHeader;
