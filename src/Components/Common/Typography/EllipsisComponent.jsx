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
    text.length > 100 && !isExpanded ? text.slice(0, 100) + "..." : text;

  return (
    <Stack gap={1} width="100%">
      <Typography level="body-sm" textColor={"neutral.800"}>
        {label}
      </Typography>
      <motion.div
        initial={{ height: "auto" }}
        animate={{ height: isExpanded ? "auto" : "2.5em" }}
        exit={{ height: "2em" }}
        transition={{ duration: 0.3 }}
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
          {truncatedText}
        </Typography>
      </motion.div>
      {text.length > 100 && (
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
    </Stack>
  );
}

export default EllipsisComponent;
