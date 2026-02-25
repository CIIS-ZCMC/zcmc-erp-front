// Utils/routeUtils.js

import { sidebarRoutes } from "../Routes/PageRoutes";

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

    // Handle nested children (like /aop/summary)
    if (route.children) {
      route.children.forEach((child) => {
        // Skip index routes (they use parent path)
        if (child.index) return;

        if (child.path && route.path) {
          // Build full path for nested routes
          const fullPath = child.path.startsWith("/")
            ? child.path
            : `${route.path}/${child.path}`;

          const permissions = child.childPermissions || child.permissions || [];

          routePermissionMap[fullPath] = {
            permissions: permissions,
            name: child.name || fullPath,
          };
        }

        // Handle deeper nesting if needed
        if (child.children) {
          child.children.forEach((deepChild) => {
            if (deepChild.path && !deepChild.index) {
              const deepPath = `${route.path}/${child.path}/${deepChild.path}`;
              const permissions =
                deepChild.childPermissions || deepChild.permissions || [];

              routePermissionMap[deepPath] = {
                permissions: permissions,
                name: deepChild.name || deepPath,
              };
            }
          });
        }
      });
    }
  });
};

buildRouteMap(sidebarRoutes);

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
