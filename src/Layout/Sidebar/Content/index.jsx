import React, { useMemo } from "react";
import { Stack, useTheme, CircularProgress } from "@mui/joy";
import MenuItemWithChildren from "./MenuItemComponent/MenuItemWithChildren";
import SimpleMenuItem from "./MenuItemComponent/SimpleMenuItem";
import useSidebarHook from "../../../Hooks/SidebarHook";
import { sidebarConfig } from "../../../Routes/sidebarConfig";
import { useAuth } from "../../../Store/AuthStore";
import { isBudgetOfficerUser } from "../../../Utils/BudgetOfficerCheck";

const checkPermission = (requiredPermissions, userPermSet) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (requiredPermissions[0] === "*") return true;
  return requiredPermissions.some((perm) => userPermSet.has(perm));
};

const checkRouteAccess = (route, userPermSet, isBudgetOfficer) => {
  if (route?.budgetOfficerOnly && !isBudgetOfficer) return false;
  return checkPermission(route?.childPermissions || route?.permissions, userPermSet);
};

const Content = () => {
  const { isCollapsed } = useSidebarHook();
  const { user, permissions, isAuthenticated } = useAuth();
  const theme = useTheme();
  const color = theme.palette.custom;

  // Use useMemo to recalculate when permissions or auth state changes
  const filteredRoutes = useMemo(() => {
    if (!isAuthenticated || !permissions || permissions.length === 0) {
      return [];
    }

    const permSet = new Set(permissions);
    const budgetOfficer = isBudgetOfficerUser(user);

    return sidebarConfig
      .map((route) => {
        // Top-level permission and role check
        if (!checkRouteAccess(route, permSet, budgetOfficer)) {
          return null;
        }

        // If route has children, filter children that user has access to
        if (route.children && route.children.length > 0) {
          const childrenItems = route.children.filter((child) =>
            checkRouteAccess(child, permSet, budgetOfficer)
          );

          // If user has no access to any child items, prune the parent section
          if (childrenItems.length === 0) {
            return null;
          }

          return { ...route, childrenItems };
        }

        return route;
      })
      .filter(Boolean);
  }, [user, permissions, isAuthenticated]);

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
      mt={3}
      gap={1}
      mb={1}
      flexGrow={1}
      width={isCollapsed ? "auto" : "100%"}
      px={isCollapsed ? 0.5 : 0}
      sx={{
        overflowY: isCollapsed ? "hidden" : "auto",
        overflowX: isCollapsed ? "visible" : "hidden",
        maxHeight: "100%",
        "&::-webkit-scrollbar": {
          width: "5px",
          height: "0px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.45)",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      {filteredRoutes.map((item) => {
        const itemKey = item.path || item.parentPath || item.name;
        return item.childrenItems ? (
          <MenuItemWithChildren
            key={itemKey}
            {...item}
            childrenItems={item.childrenItems}
            isCollapsed={isCollapsed}
          />
        ) : (
          <SimpleMenuItem key={itemKey} {...item} isCollapsed={isCollapsed} />
        );
      })}
    </Stack>
  );
};

export default React.memo(Content);
