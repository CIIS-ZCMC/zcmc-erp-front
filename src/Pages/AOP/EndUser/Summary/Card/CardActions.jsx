import React from "react";

import { Stack, Typography } from "@mui/joy";
import { formattedDate } from "../../../../../Utils/formattedLongDate";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { FileDownload } from "@mui/icons-material";

const CardActions = ({
  datePrepared,
  dateSubmitted,
  PreparedBySector,
  handleExport,
  isLoading = false,
}) => {
  return (
    <>
      <Stack textAlign="start" ml={4}>
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
        <Typography level="body-sm">Date Submitted:</Typography>
        <Typography level="title-md" color="primary">
          {formattedDate(dateSubmitted)}
        </Typography>
      </Stack>

      <ButtonComponent
        label={"Export AOP"}
        startDecorator={<FileDownload />}
        onClick={() => handleExport()}
        isLoading={isLoading}
        loadingLabel={"Exporting..."}
      />
    </>
  );
};

export default CardActions;
