import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import BoxComponent from "../Common/Card/BoxComponent";
import moment from "moment";

function SimpleCommentComponent({
  id,
  name = "Juan Dela Cruz",
  comment = "This is a sample message content sent by a user, for demonstration purposes.",
  date,
}) {
  return (
    <Stack gap={0.5}>
      <Stack direction="row" justifyContent={"space-between "} spacing={1}>
        <Typography level="body-sm" textColor={"neutral.800"} fontWeight={500}>
          {name}
        </Typography>
        <Typography level="body-xs">{moment(date).format("lll")}</Typography>
      </Stack>

      <BoxComponent bgColor={"neutral.100"}>
        <Typography level="body-sm" textColor={"neutral.600"}>
          {comment}
        </Typography>
      </BoxComponent>
    </Stack>
  );
}

export default SimpleCommentComponent;
