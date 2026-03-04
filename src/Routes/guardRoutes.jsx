// Routes/guardRoutes.js
import RouteGuard from "./RouteGuard";

export const guardRoutes = (routes, inheritedPermissions = []) => {
  return routes.map((route) => {
    const { element, children, permissions, childPermissions, ...rest } = route;

    // Permissions cascade downward
    const effectivePermissions =
      childPermissions || permissions || inheritedPermissions;

    const guardedRoute = {
      ...rest,
      ...(element && {
        element: (
          <RouteGuard permissions={effectivePermissions}>{element}</RouteGuard>
        ),
      }),
    };

    if (children) {
      guardedRoute.children = guardRoutes(children, effectivePermissions);
    }

    return guardedRoute;
  });
};
