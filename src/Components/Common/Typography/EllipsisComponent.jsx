import { Stack, Typography } from "@mui/joy";
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function EllipsisComponent({ label, text }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedText =
    text?.length > 100 && !isExpanded ? text?.slice(0, 100) + "..." : text;

  return (
    <Stack gap={1} width="100%">
      <Typography level="body-sm" textColor={"neutral.800"}>
        {label}
      </Typography>
      <motion.div
        initial={{ height: "2em" }}
        animate={{ height: isExpanded ? "100%" : "2em" }}
        exit={{ height: "2em" }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "0.82rem",
            overflow: isExpanded ? "visible" : "hidden",
            textOverflow: isExpanded ? "clip" : "ellipsis",
            color: "neutral.500",
          }}
        >
          {truncatedText}{" "}
          {text?.length > 100 && (
            <Typography
              level="body-xs"
              component="span"
              sx={{
                color: "primary.500",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={handleToggle}
            >
              {isExpanded ? "Read less" : "Read more"}
            </Typography>
          )}
        </Typography>
      </motion.div>
    </Stack>
  );
}

export default EllipsisComponent;
