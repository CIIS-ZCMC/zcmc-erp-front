import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "../Common/Card/BoxComponent";
import { Box, Link, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { Dot, ExternalLink } from "lucide-react";
import EllipsisComponent from "../Common/Typography/EllipsisComponent";
import { blue, grey } from "@mui/material/colors";
import { Circle } from "@mui/icons-material";

CommentContainerComponent.propTypes = {};

function CommentContainerComponent({
  name,
  comment,
  date,
  area_code,
  handleClick,
  activityName,
  path,
  isActivity = false,
  withActivityPath = false,
}) {
  const fontSize = "body-xs";
  return (
    <Box
      onClick={handleClick}
      p={1.7}
      sx={{
        maxHeight: "auto",
        bgcolor: "white",
        borderRadius: 8,
        borderLeft: `6px solid ${blue[800]}`,
        boxShadow: "0 3px 10px -3px rgba(131, 129, 129, 0.2)",
        // borderColor: "neutral.200",
        // "&: hover": {
        //   border: 1,
        //   borderColor: "neutral.400",
        // },
      }}
    >
      <Typography fontWeight={600} level="title-sm">
        {!isActivity
          ? `${area_code} - ${name}`
          : // `${area_code} - ${name}`}
            `${area_code} - ${name}`}
      </Typography>
      {withActivityPath && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ bgcolor: blue[50], padding: 0.5, borderRadius: 2, my: 1 }}
        >
          <Typography
            level={fontSize}
            sx={{
              width: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            color="primary"
          >
            Activity: {activityName}
          </Typography>
          <Link
            component={"button"}
            level={fontSize}
            gap={0.7}
            textColor="primary.700"
            color="primary"
            onClick={() => handleClick()}
          >
            Go to activity <ExternalLink size={14} />
          </Link>
        </Stack>
      )}
      <EllipsisComponent text={comment} />

      <Stack
        mt={comment?.length > 100 ? 4 : 1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography level={fontSize} display={"flex"} alignItems={"center"}>
          {moment(date).isSame(moment(), "day")
            ? "Today"
            : moment(date).format("dddd")}
          <Circle sx={{ fontSize: 12, mx: 1, color: grey[400] }} />
          {moment(date).format("h:mm a")}
        </Typography>

        {/* {isActivity && (
          <Link
            level={fontSize}
            gap={0.7}
            textColor="success.700"
            color="success"
            handleClick={handleClick}
          >
            Go to activity <ExternalLink size={14} />
          </Link>
        )} */}
      </Stack>
    </Box>
  );
}

export default CommentContainerComponent;
