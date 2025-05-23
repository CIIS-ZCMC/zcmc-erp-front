import React from "react";
import { Box } from "@mui/joy";

const FlexContainer = ({
  children,
  direction = "row",
  alignItems = "center",
  justifyContent = "start",
  ...props
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: direction,
          alignItems,
          justifyContent,
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </>
  );
};

export default FlexContainer;
