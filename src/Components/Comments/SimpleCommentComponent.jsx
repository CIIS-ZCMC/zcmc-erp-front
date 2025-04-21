import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import BoxComponent from "../Common/Card/BoxComponent";
import moment from "moment";

function SimpleCommentComponent({
  area_code = "MCC",
  name = "Juan Dela Cruz",
  comment = "This is a sample message content sent by a user, for demonstration purposes.",
  date,
}) {
  return (
    <Stack gap={0.6}>
      <Stack direction="row" justifyContent={"space-between "} spacing={1}>
        <Typography level="body-sm" textColor={"neutral.700"} fontWeight={500}>
          {name} - {area_code}
        </Typography>
        <Typography level="body-xs">{moment(date).format("lll")}</Typography>
      </Stack>

      <BoxComponent bgColor={"neutral.100"} p={1.3}>
        <pre>
          <Typography level="body-sm" textColor={"neutral.600"} my={-2}>
            {comment}
          </Typography>
        </pre>
      </BoxComponent>
    </Stack>
  );
}

export default SimpleCommentComponent;
