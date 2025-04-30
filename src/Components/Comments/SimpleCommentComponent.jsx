import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import React from "react";
import BoxComponent from "../Common/Card/BoxComponent";
import moment from "moment";

function SimpleCommentComponent({
  area_code = "MCC",
  name = "Juan Dela Cruz",
  comment = "This is a sample message content sent by a user, for demonstration purposes.",
  date,
  isLoading = false,
}) {
  return isLoading ? (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <CircularProgress />
    </Box>
  ) : (
    <Stack gap={0.6}>
      <Stack direction="row" justifyContent={"space-between "} spacing={1}>
        <Typography level="body-sm" textColor={"neutral.700"} fontWeight={500}>
          {name} ({area_code})
        </Typography>
        <Typography level="body-xs">{moment(date).calendar()}</Typography>
      </Stack>

      <BoxComponent bgColor={"neutral.100"} p={1.5}>
        <pre style={{ textWrap: "wrap", wordSpacing: 2 }}>
          <Typography
            fontWeight={400}
            fontSize={14}
            textColor={"neutral.600"}
            my={-2}
          >
            {comment}
          </Typography>
        </pre>
      </BoxComponent>
    </Stack>
  );
}

export default SimpleCommentComponent;
