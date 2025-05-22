import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "../Common/Card/BoxComponent";
import { Box, Link, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { Dot, ExternalLink } from "lucide-react";
import EllipsisComponent from "../Common/Typography/EllipsisComponent";

CommentContainerComponent.propTypes = {};

function CommentContainerComponent({
  name,
  comment,
  date,
  handleClick,
  isActivity = false,
}) {
  const fontSize = "body-xs";
  return (
    <Box
      onClick={handleClick}
      p={1.7}
      sx={{
        maxHeight: "10vh",
        border: 1,
        borderRadius: 8,
        borderColor: "neutral.200",
        "&: hover": {
          border: 1,
          borderColor: "neutral.400",
        },
      }}
    >
      <Typography fontWeight={600} level="title-sm">
        {!isActivity ? `Posted by ${name}` : name}
      </Typography>

      <EllipsisComponent text={comment} />
      <Stack
        mt={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography level={fontSize} display={"flex"} alignItems={"center"}>
          {moment(date).fromNow()} <Dot />
          {moment(date).format("LT")}
        </Typography>

        {isActivity && (
          <Link
            level={fontSize}
            gap={0.7}
            textColor="success.700"
            color="success"
          >
            Go to activity <ExternalLink size={14} />
          </Link>
        )}
      </Stack>
    </Box>
  );
}

export default CommentContainerComponent;
