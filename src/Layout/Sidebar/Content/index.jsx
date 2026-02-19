import React, { useEffect, useMemo } from "react";
import { Box, Stack, Tooltip, useTheme } from "@mui/joy";
import MenuItemWithChildren from "./MenuItemComponent/MenuItemWithChildren";
import SimpleMenuItem from "./MenuItemComponent/SimpleMenuItem";
import useSidebarHook from "../../../Hooks/SidebarHook";
import { sidebarRoutes } from "../../../Routes/PageRoutes";
import { useAuth } from "../../../Store/AuthStore";
import { CircularProgress } from "@mui/joy";

const Content = ({ sidebarWidth }) => {
  const { isCollapsed } = useSidebarHook();
  const { permissions, isAuthenticated } = useAuth(); // Add isAuthenticated
  const theme = useTheme();
  const color = theme.palette.custom;

  // Use useMemo to recalculate when permissions change
  const filteredRoutes = useMemo(() => {
    // If not authenticated yet, don't filter (or show loading)
    if (!isAuthenticated) {
      return [];
    }
    // If permissions are still loading, return empty
    if (!permissions || permissions.length === 0) {
      return [];
    }

    return (
      sidebarRoutes?.filter((route) => {
        // If route has no permissions specified, show it
        if (!route.permissions || route.permissions.length === 0) {
          return true;
        }
        // If route has wildcard, show it
        if (route.permissions[0] === "*") {
          return true;
        }
        // Check if user has any of the required permissions
        const hasPermission = route.permissions.some((permission) =>
          permissions.includes(permission),
        );

        return hasPermission;
      }) || []
    );
  }, [permissions, isAuthenticated]); // Re-run when permissions or auth state changes

  // Debug logging
  console.log("Content - isAuthenticated:", isAuthenticated);
  console.log("Content - permissions:", permissions);
  console.log("Content - filteredRoutes:", filteredRoutes);

  // Show loading state if not authenticated or no permissions yet
  if (!isAuthenticated || !permissions || permissions.length === 0) {
    return (
      <Stack
        mt={4}
        flexGrow={1}
        width={isCollapsed ? "auto" : "100%"}
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size="sm" />
      </Stack>
    );
  }

  // Show message if no routes match permissions
  if (filteredRoutes.length === 0) {
    return (
      <Stack
        mt={4}
        flexGrow={1}
        width={isCollapsed ? "auto" : "100%"}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          fontSize: "0.875rem",
          textAlign: "center",
          px: 2,
        }}
      >
        {isCollapsed ? "..." : "No menu items available"}
      </Stack>
    );
  }

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
      {filteredRoutes.map((item, index) =>
        item.children ? (
          <MenuItemWithChildren
            key={index}
            {...item}
            isCollapsed={isCollapsed}
            sidebarWidth={sidebarWidth}
          />
        ) : (
          <SimpleMenuItem key={index} {...item} isCollapsed={isCollapsed} />
        ),
      )}
    </Stack>
  );
};

export default Content;
