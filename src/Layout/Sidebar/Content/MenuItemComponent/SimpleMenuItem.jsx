import React from "react";

import { Box, Divider, Typography, useTheme } from "@mui/joy";

import MenuItemComponent from ".";

const SimpleMenuItem = ({ name, path, icon, isCollapsed }) => {
  const location = window.location.pathname;
  const isActive = location?.includes(path);
  const theme = useTheme();
  const color = theme.palette.custom;

  const simpleIconStyles = {
    fontSize: { xs: 16, md: 20 },
    alignItems: "center",
    color: isActive ? "white" : "white",
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: isActive ? color.light : "transparent",

          borderRadius: "md",
          transition: "background 0.2s",
        }}
      >
        <MenuItemComponent to={path} path={path}>
          <Box sx={simpleIconStyles}>{icon}</Box>
          {!isCollapsed && (
            <Typography
              ml={1}
              textColor={isActive ? "white" : "white"}
              fontSize={{ xs: 12, md: 14 }}
            >
              {name}
            </Typography>
          )}
        </MenuItemComponent>
      </Box>
      {!isCollapsed && <Divider sx={{ mx: 1, backgroundColor: "#006599" }} />}
    </>
  );
};

export default SimpleMenuItem;
