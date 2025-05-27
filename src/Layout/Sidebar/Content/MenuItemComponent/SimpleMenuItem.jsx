import React from "react";

import { Box, Divider, Typography } from "@mui/joy";

import MenuItemComponent from ".";

const SimpleMenuItem = ({ name, path, icon, isCollapsed }) => {
  const location = window.location.pathname;
  const isActive = location === path;

  const simpleIconStyles = {
    fontSize: { xs: 16, md: 20 },
    alignItems: "center",
    color: isActive ? "primary.900" : "white",
  };

  return (
    <Box
      sx={{
        backgroundColor: isActive ? "primary.100" : "transparent",

        borderRadius: "md",
        transition: "background 0.2s",
      }}
    >
      <MenuItemComponent to={path} path={path}>
        <Box sx={simpleIconStyles}>{icon}</Box>
        {!isCollapsed && (
          <Typography
            ml={1}
            textColor={isActive ? "primary.900" : "white"}
            fontSize={{ xs: 12, md: 14 }}
          >
            {name}
          </Typography>
        )}
      </MenuItemComponent>
      {!isCollapsed && <Divider sx={{ mx: 1 }} />}
    </Box>
  );
};

export default SimpleMenuItem;
