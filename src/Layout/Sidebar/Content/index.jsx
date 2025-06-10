import React from "react";

import { Box, Stack, Tooltip } from "@mui/joy";

import MenuItemWithChildren from "./MenuItemComponent/MenuItemWithChildren";
import { sidebarRoutes } from "../../../Data"; //routes from data.jsx

import SimpleMenuItem from "./MenuItemComponent/SimpleMenuItem";
import useSidebarHook from "../../../Hooks/SidebarHook";
// import { sidebarRoutes } from "../../../Routes/PageRoutes"; // routes from page routes
import { useAuth } from "../../../Store/AuthStore";

const Content = () => {
  const { isCollapsed } = useSidebarHook();
  const { permissions } = useAuth();

  // Filter routes based on abilities if needed
  const filteredRoutes = sidebarRoutes?.filter((route) => {
    if (route.permissions && route.permissions[0] === "*") return true; // No abilities means it's always accessible

    const hasPermission = route.permissions.some((permission) =>
      permissions.includes(permission)
    );

    return hasPermission;
  });

  return (
    <Stack pt={4} gap={1} flexGrow={1} width={isCollapsed ? "auto" : "100%"}>
      {filteredRoutes?.map((item, index) =>
        item.children ? (
          <MenuItemWithChildren
            key={index}
            {...item}
            isCollapsed={isCollapsed}
          />
        ) : (
          <SimpleMenuItem key={index} {...item} isCollapsed={isCollapsed} />
        )
      )}
    </Stack>
  );
};

export default Content;
