import React from "react";

import { Stack, Typography } from "@mui/joy";
import { formattedDate } from "../../../../../Utils/formattedLongDate";

const CardActions = ({ datePrepared, dateToday, PreparedBySector }) => {
  return (
    <Stack
      ml={4}
      direction="row"
      justifyContent="space-between"
      width="100%"
      flex={1} // ⬅️ makes it fill available space
    >
      <Stack direction="column" textAlign="start">
        <Typography level="body-sm">Prepared by:</Typography>
        <Typography level="title-md" color="primary">
          {PreparedBySector}
        </Typography>
      </Stack>

      <Stack textAlign="start">
        <Typography level="body-sm">Date Prepared:</Typography>
        <Typography level="title-md" color="primary">
          {formattedDate(datePrepared)}
        </Typography>
      </Stack>

      <Stack textAlign="start">
        <Typography level="body-sm">Date Today:</Typography>
        <Typography level="title-md" color="primary">
          {formattedDate(dateToday)}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CardActions;
