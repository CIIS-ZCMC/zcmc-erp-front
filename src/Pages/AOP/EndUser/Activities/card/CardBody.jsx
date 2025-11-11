import React from "react";

import { Typography, Stack } from "@mui/joy";

const CardBody = ({ objective, activity, timeframe, cost }) => {
  return (
    <>
      <Stack direction={"column"} textAlign={"left"} width={"80%"}>
        <Typography level={"body-sm"}>{objective}</Typography>

        <Typography level={"title-md"} sx={{}}>
          {activity}
        </Typography>

        <Typography level={"body-sm"}>{timeframe}</Typography>
      </Stack>

      <Stack
        textAlign={"left"}
        sx={{
          bgcolor: "#F2F2F2",
          padding: 1,
          borderRadius: 10,
        }}
        width={"30%"}
      >
        <Typography level="body-sm">Cost</Typography>
        <Typography
          level="body-md"
          sx={
            {
              // flex: 1,
              // whiteSpace: 'nowrap',
              // overflow: 'hidden',
              // textOverflow: 'ellipsis',
              // maxWidth: '50%',
            }
          }
        >
          ₱{" "}
          {cost
            ? cost?.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00"}
        </Typography>
      </Stack>
    </>
  );
};

export default CardBody;
