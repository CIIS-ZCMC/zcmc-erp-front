import React from "react";

import { Box, Stack } from "@mui/joy";

import MenuItemWithChildren from "./MenuItemComponent/MenuItemWithChildren";
import { sidebarRoutes } from "../../../Data";

import SimpleMenuItem from "./MenuItemComponent/SimpleMenuItem";
import useSidebarHook from "../../../Hooks/SidebarHook";

const Content = () => {
  const { isCollapsed } = useSidebarHook();
  return (
    <Box>
      <Stack pt={4} gap={1} flexGrow={1}>
        {sidebarRoutes?.map((item, index) =>
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
    </Box>
  );
};

export default Content;
