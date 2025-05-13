import React from "react";

import { Box, Divider, Typography } from "@mui/joy";

import MenuItemComponent from ".";

const simpleIconStyles = {
  fontSize: { xs: 16, md: 20 },
  alignItems: "center",
};

const SimpleMenuItem = ({ name, path, icon, isCollapsed }) => {
  return (
    <>
      <MenuItemComponent to={path} path={path}>
        <Box sx={simpleIconStyles}>{icon}</Box>
        {!isCollapsed && (
          <Typography ml={1} color="white" fontSize={{ xs: 12, md: 14 }}>
            {name}
          </Typography>
        )}
      </MenuItemComponent>
      {!isCollapsed && <Divider />}
    </>
  );
};

export default SimpleMenuItem;
