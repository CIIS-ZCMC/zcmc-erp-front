import React from "react";
import { Box, Typography } from "@mui/joy";
import MenuItemComponent from ".";

const childIconStyles = {
  fontSize: { xs: 16, md: 20 },
  display: "flex",
  alignItems: "center",
};

const ChildMenuItem = ({ icon, name, path, isInPopout = false }) => {
  return (
    <MenuItemComponent
      to={path}
      path={path}
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: "md",
        transition: "background 0.2s",
        ...(isInPopout
          ? {
              bgcolor: "transparent",
              color: "neutral.900",
              "&:hover": {
                bgcolor: "neutral.100",
              },
            }
          : {
              color: "white",
            }),
      }}
    >
      <Box sx={childIconStyles}>{icon}</Box>
      <Typography
        ml={isInPopout ? 1 : 2}
        fontSize={{ xs: 13 }}
        color={isInPopout ? "neutral.900" : "white"}
      >
        {name}
      </Typography>
    </MenuItemComponent>
  );
};

export default ChildMenuItem;
