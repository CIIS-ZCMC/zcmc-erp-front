import React from "react";
import { Typography, Stack, Box } from "@mui/joy";
import moment from "moment";
import { formatPeso } from "../../../../../Utils/FormatPeso";

const CardBody = ({
  objective,
  activity,
  timeframe,
  cost,
  comments,
  status,
}) => {
  const ellipsisText = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "pointer",
  };

  const popupStyle = {
    display: "none",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bgcolor: "#F2F2F2",
    borderRadius: 10,
    p: 1.5,
    boxShadow: "lg",
    zIndex: 9999,
  };
  return (
    <>
      <Stack
        direction={"column"}
        textAlign={"left"}
        width={"80%"}
        sx={{
          position: "relative",

          "&:hover .activityPopup": {
            display: "block",
          },

          "&:hover .activityText": {
            visibility: "hidden",
          },
        }}
      >
        {/* <Typography level={"body-sm"} sx={{ color: "black" }}>
          {objective}
        </Typography> */}

        <Typography
          className="activityText"
          level={"title-lg"}
          sx={ellipsisText}
        >
          {activity}
        </Typography>

        <Box className="activityPopup" sx={popupStyle}>
          <Typography
            level="title-lg"
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {activity}
          </Typography>
        </Box>

        <Typography level={"body-sm"} sx={{ color: "black" }}>
          {timeframe}
        </Typography>
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
        <Typography level="body-sm" sx={{ color: "black" }}>
          Cost
        </Typography>
        <Typography level="body-md" sx={{ color: "black" }}>
          {formatPeso(cost)}
        </Typography>
      </Stack>
    </>
  );
};

export default CardBody;
