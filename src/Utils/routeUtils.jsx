// Utils/routeUtils.js

import { sidebarConfig } from "../Routes/sidebarConfig";

// Build a map of only the routes that users can actually navigate to
export const routePermissionMap = {};

const buildRouteMap = (routes) => {
  routes.forEach((route) => {
    // Skip parentPath containers - they're just for organization
    if (route.parentPath) {
      // Still need to process their children
      if (route.children) {
        buildRouteMap(route.children);
      }
      return;
    }

    // Handle regular routes that users can actually visit
    if (route.path && route.path !== "/") {
      // Use childPermissions if available, otherwise use route permissions
      const permissions = route.childPermissions || route.permissions || [];

      routePermissionMap[route.path] = {
        permissions: permissions,
        name: route.name,
      };
    }

    // Handle nested children
    if (route.children) {
      route.children.forEach((child) => {
        if (child.index) return;

        if (child.path) {
          const fullPath = child.path.startsWith("/")
            ? child.path
            : `${route.path || ""}/${child.path}`;

          const permissions = child.childPermissions || child.permissions || [];

          routePermissionMap[fullPath] = {
            permissions: permissions,
            name: child.name || fullPath,
          };
        }
      });
    }
  });
};

buildRouteMap(sidebarConfig);

// Simple function to check if user can access a path
export const canAccessRoute = (pathname, userPermissions) => {
  // Remove trailing slash
  const cleanPath = pathname.replace(/\/$/, "");

  // Check exact match first
  if (routePermissionMap[cleanPath]) {
    const requiredPerms = routePermissionMap[cleanPath].permissions;
    if (requiredPerms.length === 0) return true;

    return requiredPerms.some((p) => userPermissions?.includes(p));
  }

  // Handle dynamic routes (like /aop/objectives/123)
  // Find the matching base path
  const matchingPath = Object.keys(routePermissionMap).find(
    (key) => cleanPath.startsWith(key) && key !== "/",
  );

  if (matchingPath) {
    const requiredPerms = routePermissionMap[matchingPath].permissions;
    if (requiredPerms.length === 0) return true;

    return requiredPerms.some((p) => userPermissions?.includes(p));
  }

  return true; // Allow if no matching route found
};
