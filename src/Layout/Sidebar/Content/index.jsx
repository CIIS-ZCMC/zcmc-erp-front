import React, { useEffect } from "react";

import { Box, Stack, Tooltip, useTheme } from "@mui/joy";

import MenuItemWithChildren from "./MenuItemComponent/MenuItemWithChildren";
// import { sidebarRoutes } from "../../../Data"; //routes from data.jsx

import SimpleMenuItem from "./MenuItemComponent/SimpleMenuItem";
import useSidebarHook from "../../../Hooks/SidebarHook";
import { sidebarRoutes } from "../../../Routes/PageRoutes"; // routes from page routes
import { useAuth } from "../../../Store/AuthStore";

const Content = ({ sidebarWidth }) => {
  const { isCollapsed } = useSidebarHook();
  const { permissions } = useAuth();
  const theme = useTheme();

  const color = theme.palette.custom;

  // Filter routes based on abilities if needed
  const filteredRoutes = sidebarRoutes?.filter((route) => {
    if (route.permissions && route.permissions[0] === "*") return true; // No abilities means it's always accessible

    const hasPermission = route.permissions.some((permission) =>
      permissions.includes(permission)
    );

    return hasPermission;
  });

  // console.log(permissions)

  return (
    <Stack
      mt={4}
      gap={1}
      flexGrow={1}
      width={isCollapsed ? "auto" : "100%"}
      sx={{
        overflowY: isCollapsed ? "none" : "auto",
        maxHeight: "100%",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#1E5978",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: color.main,
        },
      }}
    >
      {filteredRoutes?.map((item, index) =>
        item.children ? (
          <MenuItemWithChildren
            key={index}
            {...item}
            isCollapsed={isCollapsed}
            sidebarWidth={sidebarWidth}
          />
        ) : (
          <SimpleMenuItem key={index} {...item} isCollapsed={isCollapsed} />
        )
      )}
    </Stack>
  );
};

export default Content;
