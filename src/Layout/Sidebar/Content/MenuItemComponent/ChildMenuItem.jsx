import React from "react";
import { Box, Typography } from "@mui/joy";
import MenuItemComponent from ".";

const childIconStyles = {
  fontSize: { xs: 16, md: 20 },
  display: "flex",
  alignItems: "center",
};

const ChildMenuItem = ({ icon, name, path, isInPopout = false }) => {
  const location = window.location.pathname;
  const isActive = location === path;

  return (
    <MenuItemComponent
      to={path}
      path={path}
      sx={{
        px: 1.5,
        py: 1.5,

        borderRadius: "md",
        transition: "background 0.2s",

        backgroundColor: isActive ? "primary.100" : "transparent",

        ...(isInPopout
          ? {
              bgcolor: "transparent",
              color: "neutral.900",
              "&:hover": {
                bgcolor: "neutral.100",
              },
            }
          : {
              color: isActive ? "primary.900" : "white",
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
